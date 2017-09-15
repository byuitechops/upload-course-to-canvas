/*eslint-env node*/
/*eslint no-console:0*/

'use-strict';

var uploadCourse = require('./uploadCourse.js');
//exports.courseId = courseId;

/*******************************
 * 
 *********************************/
function createCourse(fileName, courseSettings) {
    var request = require('request'),
        auth = require('./auth.json'),
        chalk = require('chalk'),
        courseId = "";

    request.post({
        url: "https://byui.instructure.com/api/v1/accounts/1/courses",
        form: {
            'course[name]': courseSettings.name, //"FDSCI"
            'course[course_code]': courseSettings.code, //"101"
            'course[license]': courseSettings.license, //"public_domain"
            'course[is_public_to_auth_users]': courseSettings.publicToAuthUsers //true
        }
    }, function (err, response, body) {
        if (err) {
            console.log(err);
        } else {
            console.log(chalk.green(courseSettings.name + "Successfully created"));
            body = JSON.parse(body);
            console.log('\nCourse Number: ', body.id);
            exports.courseId = body.id;
            //return courseId;
            //uploadCourse(fileName, courseId);
            exports = courseId;
        }
    }).auth(null, null, true, auth.token);
}

module.exports = createCourse;
