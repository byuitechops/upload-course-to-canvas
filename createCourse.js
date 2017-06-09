/*eslint-env node*/
/*eslint no-console:0*/

function getIDFromNewCourse() {
    var request = require('request');

    var courseID = "";

    request.post({
        url: "https://byui.instructure.com/api/v1/accounts/1/courses",
        form: {
            'course[name]': "TEST",
            'course[course_code]': "101",
            'course[license]': "public_domain",
            'course[is_public_to_auth_users]': true
        }}, function (err, response, body) {
        if (err) {
            console.log(err);
        } else {
            body = JSON.parse(body);
            console.log('\nbody\n', body.id);
            courseID = body.id;
        }
    }).auth(null, null, true, "10706~S65aDY8wtLsfCvLWvyLhQTJ1YX14AwXan58udOoc0rjQyY8K2iBF8m568nRSR8RN");
    return courseID;
}
