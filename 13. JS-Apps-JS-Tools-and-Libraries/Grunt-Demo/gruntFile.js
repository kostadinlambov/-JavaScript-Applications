module.exports = (grunt) => {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            build: {
                src: [ './js/module.js', './js/app.js'],
                dest: 'build/bundle.js',
            },
        },
        uglify: {
            build: {
                src: ['build/bundle.js'],
                dest: 'build/bundle.min.js'
            }
        },
        eslint: {
            options: {
                configFile: './.eslintrc.json',
            },
            target: [ './js/module.js', './js/app.js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-eslint');

    grunt.registerTask('default', [ 'concat', 'uglify']);
    // grunt.registerTask('default', ['eslint', 'concat', 'uglify']);
};
