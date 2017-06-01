/*eslint-env node*/
/*eslint no-console:0*/

'use-strict';

const https = require('https'),
    chalk = require('chalk'),
    queryString = require('query-string'),
    auth = require('./auth.js'),
    fs = require('fs'),
    request = require('request');


function confirmUpload(redirectUrl) {
    request.post({
        url: redirectUrl
    }, function (err, response, body) {
        if (err) {
            console.log(chalk.red(err));
        } else {
            console.log(chalk.green('Working!'));
            console.log('\nbody\n', body);
        }
    }).auth(null, null, true, auth.token);
}


//begins the upload?
function uploadZip(preAttachment) {

    // form/multipart POST
    request.post({
        url: preAttachment.upload_url,
        formData: preAttachment.upload_params
    }, function (err, response, body) {
        if (err) {
            console.log(chalk.red(err));
        } else {
            var redirectUrl = response.headers.location;
            console.log(chalk.green(redirectUrl));

            confirmUpload(redirectUrl);
        }
    });
}

//creates the migration req within canvas
function createMigration(fileName) {

    var postBody = {
        migration_type: 'd2l_exporter',
        'pre_attachment[name]': fileName,
        'pre_attachment[size]': '34930210',
        'pre_attachment[content_type]': 'folder/zip',
        'settings[folder_id]': auth.parentFolderId
    };

    request.post({
        url: 'https://byui.instructure.com/api/v1/courses/' + auth.courseId + '/content_migrations',
        form: postBody
    }, function (err, respoonse, body) {
        if (err) {
            console.error(chalk.red(err));
        } else {
            //console.log('\nbody\n', JSON.parse(body));
            var preAttachment = JSON.parse(body).pre_attachment;
            preAttachment.upload_params.file = fileName;
            uploadZip(preAttachment);
        }
    }).auth(null, null, true, auth.token);
}

//confirmUpload('https://byui.instructure.com/api/v1/files/36766/create_success?uuid=yzjiJk19CcAu97qFaqesmMqnwREhqpQ29WGdfq8f&bucket=instructure-uploads&key=account_107060000000000001%2Fattachments%2F36766%2FD2LExport_236812_201752517.zip&etag=%223f39406c197596b9b2c8309fe1029839%22');

//createMigration('D2LExport_236812_201752517.zip');
