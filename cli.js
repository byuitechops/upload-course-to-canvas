/*eslint-env node*/
/*eslint no-console:0*/

'use-strict';

const https = require('https'),
    queryString = require('query-string'),
    auth = require('./auth.js');


function createMigration() {

    var post_body = queryString.stringify({
            file_name: 'D2LExport_236812_201752517.zip',
            size: 'size=34930210',
            content_type: 'folder/zip'
        }),
        postOptions = {
            method: 'POST',
            path: '/api/v1/courses/' + auth.courseID + '/content_migrations',
            hostname: 'https://byui.instructure.com',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(post_body)
            }
        },
        request = https.request(postOptions, function (response, err) {
            console.log(response.statusCode);
        });
    request.on('error', function (err) {
        console.error(err);
    });

}


createMigration();
