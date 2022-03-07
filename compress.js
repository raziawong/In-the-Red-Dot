const minify = require('@node-minify/core');
const uglifyes = require('@node-minify/uglify-es');
const cleanCSS = require('@node-minify/clean-css');
const cmprImg = require('compress-images');

const imgSrcDir = 'assets/src/img/*.{jpg,JPG,jpeg,JPEG,png}';
const imgDestDir = 'assets/media/img/';

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

minify({
    compressor: cleanCSS,
    input: 'assets/libs/*/*.css',
    output: 'assets/dist/libs.min.css',
    callback: function(err, min) {
        console.log('Minified libs CSS', err);
    }
});


cmprImg(imgSrcDir, imgDestDir, {
        compress_force: false,
        statistic: true,
        autoupdate: true
    },
    false, {
        jpg: { engine: "mozjpeg", command: ["-quality", "60"] }
    }, {
        png: { engine: "pngquant", command: ["--quality=20-50", "-o"] }
    }, {
        svg: { engine: false, command: false }
    }, {
        gif: { engine: false, command: false }
    },
    function(error, completed, statistic) {
        console.log("------ Compress Images -------");
        console.log(error);
        console.log(completed);
        console.log(statistic);
        console.log("-------------");
    }
);