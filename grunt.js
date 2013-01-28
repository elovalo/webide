/*global module:false*/
module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            reload: {
                files: ['src/*', 'grunt.js'],
                tasks: 'tinylr-reload'
            }
        }
    });

    grunt.registerTask('default', 'tinylr-start serve watch');
    grunt.registerTask('serve', 'Start server', function() {
        grunt.log.writeln('Surf to :8080/dev.html now!');
        require('./serve').listen(8080);
    });

    ['tiny-lr'].forEach(grunt.loadNpmTasks);
};