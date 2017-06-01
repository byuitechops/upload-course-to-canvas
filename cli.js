/*eslint-env node*/
/*eslint no-console:0*/

'use-strict';

const https = require('https'),
    chalk = require('chalk'),
    queryString = require('query-string'),
    auth = require('./auth.js'),
    fs = require('fs'),
    request = require('request');


//begins the upload
function uploadZip(preAttachment) {

    // add filename to the body
    //    preAttachment.upload_params.file = fileName;

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
        }
    });
}

/*function saveData(preAttachment, filename) {
    preAttachment.fileName = filename;
    preAttachment = JSON.stringify(preAttachment, null, 3);
    fs.writeFile('.data.txt', preAttachment, function (err) {
        if (err) {
            console.log(chalk.red(err));
        } else {
            console.log(chalk.green('The file was saved'));
        }
    });
}*/

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


createMigration('D2LExport_236812_201752517.zip');
