/*eslint-env node*/
'use-strict';

const chalk = require('chalk'),
    request = require('request'),
    auth = require('./auth');



request.put({
    url: 'https://byui.instructure.com/api/v1/courses/' + auth.courseId + '/content_migrations/151/migration_issues/14405',
    form: {
        workflow_state: 'resolved'
    }
}, (err, response, body) => {
    if (err) {
        console.error(chalk.red(err));
    } else {
        console.log(body);
    }
}).auth(null, null, true, auth.token);
