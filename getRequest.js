/*eslint-env node*/
/*eslint no-console:0*/

'use-strict';

/* HTTP REQUEST ALL */
const https = require('https'),
    auth = require('./auth.js');

// :user_id == enter your own user ID there

var url = "https://byui.instructure.com/api/v1/courses/" + auth.courseId + "/content_migrations/migrators?access_token=" + auth.token;

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
});
