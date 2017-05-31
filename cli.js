/*eslint-env node*/
/*eslint no-console:0*/

'use-strict';

const https = require('https'),
    chalk = require('chalk'),
    queryString = require('query-string'),
    auth = require('./auth.js');


//begins the upload
function uploadZip(preAttachment, fileName) {
    //    console.log('preAttachment', preAttachment);

    preAttachment.upload_params.file = fileName;

    console.log('DA STRTING', preAttachment.upload_params)

    var url = preAttachment.upload_url.replace(/https?:\/\//, ''),
        postOptions = {
            hostname: url,
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        },
        request = https.request(postOptions, function (response, err) {
            response.on('error', function (err) {
                console.log(chalk.red(err));
            });

            console.log(response.statusCode);

            var data = '';
            response.on('data', function (d) {
                data += d;
            });
            response.on('end', function () {
                //data = JSON.parse(data);

                //error handling here
                console.log('second response', data);
            });

        });
    request.on('error', function (err) {
        console.log(chalk.red(err));
    });
    request.end(JSON.stringify(preAttachment.upload_params));

}

//creates the migration request within canvas
function createMigration(fileName) {

    var postBody = queryString.stringify({
            migration_type: 'd2l_exporter',
            'pre_attachment[name]': fileName,
            'pre_attachment[size]': '34930210',
            'pre_attachment[content_type]': 'folder/zip',
            'settings[folder_id]': auth.parentFolderId

        }),
        postOptions = {
            hostname: 'byui.instructure.com',
            path: '/api/v1/courses/' + auth.courseId + '/content_migrations',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Bearer ' + auth.token
            }
        },
        request = https.request(postOptions, function (response, err) {
            response.on('error', function (err) {
                console.log(chalk.red(err));
            });

            console.log(response.statusCode);

            var data = '';
            response.on('data', function (d) {
                data += d;
            });
            response.on('end', function () {
                data = JSON.parse(data);

                //error handling here
                uploadZip(data.pre_attachment, fileName);
            });
        });
    request.on('error', function (err) {
        console.log(chalk.red(err));
    });
    request.end(postBody);

}

createMigration('D2LExport_236812_201752517.zip');
