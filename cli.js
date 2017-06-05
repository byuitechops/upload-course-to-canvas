/*eslint-env node*/
/*eslint no-console:0*/

'use-strict';

const https = require('https'),
    chalk = require('chalk'),
    queryString = require('query-string'),
    auth = require('./auth.js'),
    fs = require('fs'),
    request = require('request');


function postRequest(url, content, authRequired, cb, custom) {
    console.log('\nURL:\n', url);
    console.log('\ncontent:\n', content);
    console.log('\nauthRequired:\n', authRequired);
    //    console.log('cb:', typeof cb);
    console.log('\nCustom:\n', custom);

    var contentType = content.type,
        postOptions = {
            url: url
        };
    delete content.type;

    if (contentType === "form/multipart")
        postOptions.formData = content;
    else
        postOptions.form = content;


    function postCallback(err, response, body) {
        if (err) {
            console.error(chalk.red(err));
        } else {
            //console.log('Content Type:', contentType);
            if (contentType === 'form/multipart') {
                cb(response, custom);
            } else {
                try {
                    body = JSON.parse(body);
                    cb(body, custom);
                } catch (e) {
                    console.error(chalk.red(e));
                    console.log('da body', body);
                }
            }
        }
    }

    console.log('\npostOptions:\n', postOptions);

    if (authRequired === true)
        request.post(postOptions, postCallback).auth(null, null, true, auth.token);
    else
        request.post(postOptions, postCallback);
}


/*postRequest('https://google.com', {
    name: 'joe',
    type: 'form/multipart'
}, true, 'a function goes here');*/


//check status of migration
function checkProgress(progressUrl) {
    request.get(progressUrl, function (err, response, body) {
        if (err) {
            console.error(chalk.red(err));
        } else {
            try {
                body = JSON.parse(body);
            } catch (e) {
                console.error(chalk.red(e));
            }
            // console.log('\n DA PROGRESS:\n', JSON.parse(body));
            console.log(chalk.blue('Status:'), body.workflow_state);
        }
    }).auth(null, null, true, auth.token);
}

//GET content migration
function getMigration(migrationId) {
    var url = 'https://byui.instructure.com/api/v1/courses/' + auth.courseId + '/content_migrations/' + migrationId;
    request.get(url, function (err, response, body) {
        if (err) {
            console.error(chalk.red(err));
        } else {
            console.log(chalk.green('Retrieved migration'));
            try {
                body = JSON.parse(body);
            } catch (e) {
                console.error('error: ', chalk.red(e));
            }
            //CHECK STATUS OF MIGRATION
            checkProgress(body.progress_url);
        }
    }).auth(null, null, true, auth.token);
}


/**********************
 * file upload process *
 **********************/
function confirmUpload(redirectUrl, migrationId) {
    /*function confirmUpload(response, migrationId) {
        console.log(chalk.yellow('Redirect URL obtained'));
        console.log(response.headers);

        var redirectUrl = response.headers.location;

        postRequest(redirectUrl, {
            type: 'application/x-www-form-urlencoded'
        }, true, getMigration, migrationId);*/


    request.post({
        url: redirectUrl
    }, function (err, response, body) {
        if (err) {
            console.error(chalk.red(err));
        } else {
            //console.log('\nbody\n', body);
            console.log('file upload complete');
            getMigration(migrationId);
        }
    }).auth(null, null, true, auth.token);
}


//begins the upload?
function uploadZip(preAttachment, migrationId) {
    /*function uploadZip(body, migrationId) {
        console.log(chalk.yellow('Migration Created'));

        var migrationId = body.id,
            preAttachment = body.pre_attachment;

        preAttachment.upload_params.type = 'form/multipart';

        postRequest(preAttachment.upload_url, preAttachment.upload_params, false, confirmUpload, migrationId);*/


    // form/multipart POST
    request.post({
        url: preAttachment.upload_url,
        formData: preAttachment.upload_params //formData specifies a form/multipart content type
    }, function (err, response, body) {
        if (err) {
            console.error(chalk.red(err));
        } else {
            //body is empty
            var redirectUrl = response.headers.location;
            //console.log(chalk.green(redirectUrl));
            console.log('redirect URL obtained');

            confirmUpload(redirectUrl, migrationId);
        }
    });
}

//creates the migration req within canvas
function createMigration(fileName) {
    var postBody = {
            type: 'application/x-www-form-urlencoded',
            migration_type: 'd2l_exporter',
            'pre_attachment[name]': fileName,
            'pre_attachment[size]': '34930210',
            'pre_attachment[content_type]': 'folder/zip',
            'settings[folder_id]': auth.parentFolderId
        },
        url = 'https://byui.instructure.com/api/v1/courses/' + auth.courseId + '/content_migrations';

    //    postRequest(url, postBody, true, uploadZip);

    request.post({
        url: 'https://byui.instructure.com/api/v1/courses/' + auth.courseId + '/content_migrations',
        form: postBody
    }, function (err, respoonse, body) {
        if (err) {
            console.error(chalk.red(err));
        } else {
            //console.log('\nbody\n', JSON.parse(body));
            body = JSON.parse(body);
            body.pre_attachment.upload_params.file = fileName;

            console.log('Migration Created');
            uploadZip(body.pre_attachment, body.id);
        }
    }).auth(null, null, true, auth.token);
}

//checkProgress('https://byui.instructure.com/api/v1/progress/220');
//getMigration('122');
//confirmUpload('https://byui.instructure.com/api/v1/files/36766/create_success?uuid=yzjiJk19CcAu97qFaqesmMqnwREhqpQ29WGdfq8f&bucket=instructure-uploads&key=account_107060000000000001%2Fattachments%2F36766%2FD2LExport_236812_201752517.zip&etag=%223f39406c197596b9b2c8309fe1029839%22');
/*uploadZip({
    upload_url: 'https://instructure-uploads.s3.amazonaws.com',
    upload_params: {
        AWSAccessKeyId: 'AKIAJFNFXH2V2O7RPCAA',
        Filename: 'D2LExport_236812_201752517.zip',
        key: 'account_107060000000000001/attachments/36901/D2LExport_236812_201752517.zip',
        acl: 'private',
        Policy: 'eyJleHBpcmF0aW9uIjoiMjAxNy0wNi0wMlQxNTo1OToxN1oiLCJjb25kaXRpb25zIjpbeyJidWNrZXQiOiJpbnN0cnVjdHVyZS11cGxvYWRzIn0seyJrZXkiOiJhY2NvdW50XzEwNzA2MDAwMDAwMDAwMDAwMVwvYXR0YWNobWVudHNcLzM2OTAxXC9EMkxFeHBvcnRfMjM2ODEyXzIwMTc1MjUxNy56aXAifSx7ImFjbCI6InByaXZhdGUifSxbInN0YXJ0cy13aXRoIiwiJEZpbGVuYW1lIiwiIl0sWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsMSwxMDczNzQxODI0MF0seyJzdWNjZXNzX2FjdGlvbl9yZWRpcmVjdCI6Imh0dHBzOlwvXC9ieXVpLmluc3RydWN0dXJlLmNvbVwvYXBpXC92MVwvZmlsZXNcLzM2OTAxXC9jcmVhdGVfc3VjY2Vzcz91dWlkPTRucE9pdEM3cHRXNGlURE9aSllydUxJT1JSMzBTVWxkOWFrazVzSnYifSx7ImNvbnRlbnQtdHlwZSI6ImZvbGRlclwvemlwIn1dfQ==',
        Signature: '8PWm3GpTFzevsNS83hwrQ2AlyoU=',
        success_action_redirect: 'https://byui.instructure.com/api/v1/files/36901/create_success?uuid=4npOitC7ptW4iTDOZJYruLIORR30SUld9akk5sJv',
        'content-type': 'folder/zip',
        file: 'D2LExport_236812_201752517.zip'
    },
    file_param: 'file'
});*/
createMigration('D2LExport_236812_201752517.zip');
