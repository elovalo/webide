/*global module:false*/
module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            reload: {
                files: ['*.js', '_templates/*.hbs',
                    'public/js/*.js',
                    'public/**/*.css'],
                tasks: 'tinylr-reload'
            }
        }
    });

    grunt.registerTask('default', 'tinylr-start serve watch');

    grunt.registerTask('serve', 'Start server', function() {
        var app = require('./app')();
        var http = require('http');

        http.createServer(app).listen(app.get('port'), function(){
            console.log("Starting Elovalo Webide " + app.get('port'));
        });
    });

    ['tiny-lr'].forEach(grunt.loadNpmTasks);
};
