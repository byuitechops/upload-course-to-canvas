/*eslint-env node*/
/*eslint no-console:0*/

'use-strict';

const https = require('https'),
    chalk = require('chalk'),
    queryString = require('query-string'),
    auth = require('./auth.js'),
    chalk = require('chalk');


function uploadZip(uploadParams) {
    console.log('uploadParams', uploadParams);

    var postBody = queryString.stringify({}),
        postOptions = {

        },
        request = https.request(postOptions, function (response, err) {

        });
    request.on('error', function (err) {
        console.log(chalk.red(err));
    })

}

function createMigration() {

    var postBody = queryString.stringify({
            migration_type: 'zip_file_importer',
            'pre_attachment[name]': 'D2LExport_236812_201752517.zip',
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
                console.error(err);
            });


            console.log(response.statusCode);

            var data = '';
            response.on('data', function (d) {
                data += d;
            });
            response.on('end', function () {
                data = JSON.parse(data);

                //error handling here
                uploadZip(data.pre_attachment.upload_params);

            });

        });
    request.end(postBody);
    request.on('error', function (err) {
        console.error(err);
    });

}

createMigration();
