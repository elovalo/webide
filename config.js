var config;

try {
    config = require('./config.json');
}
catch(e) {
    config = {
        cookieSecret: 'developersecret'
    };
}

if(!config.repoPath) config.repoPath = '../webidefx';

module.exports = config;
