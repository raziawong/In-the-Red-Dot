const minify = require('@node-minify/core');
const uglifyes = require('@node-minify/uglify-es');
const cleanCSS = require('@node-minify/clean-css');

minify({
    compressor: uglifyes,
    input: ['assets/src/scripts/const.js', 'assets/src/scripts/util.js', 'assets/src/scripts/data.js', 'assets/src/scripts/chart.js', 'assets/src/scripts/map.js', 'assets/src/scripts/main.js'],
    output: 'assets/dist/all.min.js',
    callback: function(err, min) {
        console.log('Minified custom JS', err);
    }
});

minify({
    compressor: uglifyes,
    input: 'assets/libs/*/*.js',
    output: 'assets/dist/libs.min.js',
    callback: function(err, min) {
        console.log('Minified libs JS', err);
    }
});

minify({
    compressor: cleanCSS,
    input: 'assets/src/styles/custom.css',
    output: 'assets/dist/all.min.css',
    callback: function(err, min) {
        console.log('Minified custom CSS', err);
    }
});