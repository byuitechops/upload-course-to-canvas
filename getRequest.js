/*eslint-env node*/
/*eslint no-console:0*/

'use-strict';

/* HTTP REQUEST ALL */
const https = require('https'),
    auth = require('./auth.js'),
    chalk = require('chalk'),
    request = require('request');


//var url = "https://byui.instructure.com/api/v1/courses/" + auth.courseId + "/content_migrations/migrators"; //?access_token=" + auth.token;
//var url = "https://byui.instructure.com/api/v1/courses/" + auth.courseId + "/content_migrations"; //?access_token=" + auth.token;
var url = "https://byui.instructure.com/api/v1/courses/" + auth.courseId + "/content_migrations/151/migration_issues"; //?access_token=" + auth.token;


request.get(url, function (err, response, body) {
    if (err) {
        console.error(chalk.red(err));
    } else {
        console.log(JSON.parse(body));
    }
}).auth(null, null, true, auth.token);
