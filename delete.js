/*eslint-env node*/
/*eslint no-console:0*/

'use-strict';

/* HTTP REQUEST ALL */
const https = require('https'),
    auth = require('./auth.js'),
    chalk = require('chalk'),
    request = require('request');

var url = "https://byui.instructure.com/api/v1/courses/" + auth.courseId + "/content_migrations/114"; //?access_token=" + auth.token;


request.delete(url, function (err, response, body) {
    if (err) {
        console.error(chalk.red(err));
    } else {
        console.log(body);
    }
}).auth(null, null, true, auth.token);
