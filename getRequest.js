/*eslint-env node*/
/*eslint no-console:0*/

'use-strict';

/* HTTP REQUEST ALL */
const https = require('https'),
    auth = require('./auth.js'),
    chalk = require('chalk'),
    request = require('request');


//var url = "https://byui.instructure.com/api/v1/courses/" + auth.courseId + "/content_migrations/migrators"; //?access_token=" + auth.token;
var url = "https://byui.instructure.com/api/v1/courses/" + auth.courseId + "/content_migrations"; //?access_token=" + auth.token;


request.get(url, function (err, response, body) {
    if (err) {
        console.error(chalk.red(err));
    } else {
        console.log(JSON.parse(body));
    }
}).auth(null, null, true, auth.token);

/*
https.get(url, function (response) {
    var data = '';
    response.on('data', function (input) {
        data += input;
    });
    response.on('end', function () {
        console.log(response.statusCode);
        data = JSON.parse(data);
        console.log(data);
    });
}).on('error', (err) => {
    console.log(chalk.red(err));
});*/
