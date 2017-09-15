/*eslint-env node*/
/*eslint no-console:0*/
'use-strict';

var request = require('request'),
    auth = require('./auth.json');

function throwError(err, message) {
    console.error(err);
    if (mesage != undefined) {
        console.log(message);
    }
}


function getIssues(migrationId, courseId) {
    var url = "https://byui.instructure.com/api/v1/courses/" + courseId + "/content_migrations/" + migrationId + "/migration_issues";

    request.get(url, function (err, response, body) {
        if (err) {
            throwError(err, response.statusCode);
            return;
        }

        body = JSON.parse(body);

        //console.log("statusCode:", response.statusCode);

        console.log(JSON.stringify(body, null, 3));

    }).auth(null, null, true, auth.token);
}



function getMigrations() {
    var courseId = "92",
        url = "https://byui.instructure.com/api/v1/courses/92/content_migrations";
    request.get(url, function (err, response, body) {
        if (err) {
            throwError(err);
            return;
        }

        body = JSON.parse(body);

        console.log('migrations found:', body.length);

        /*body.forEach(function (migration) {
            console.log(JSON.stringify(migration, null, 3));
        })*/

        getIssues(body[0].id, courseId);
    }).auth(null, null, true, auth.token);
}


getMigrations();
