#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var Handlebars = require('handlebars');
var filewalker = require('filewalker');

main();

function main() {
    generateExamples();
}

function generateExamples() {
    var files = [];

    filewalker('./src/examples').on('file', function(p) {
        files.push(p);
    }).on('done', function() {
        var outputPath = path.join(__dirname, 'src/js/examples.js');
        var templatePath = path.join(__dirname, '_templates/examples.hbs');

        writeTemplate(files, outputPath, templatePath);
    }).walk();
}

function writeTemplate(data, outputPath, templatePath, out) {
    out = out || function() {};

    compile(templatePath, function(err, tpl) {
        fs.writeFile(outputPath, tpl(toObject(data)), out(outputPath));
    });
}

function toObject(data) {
    return {
        modules: data.map(function(d) {
            return {
                name: d.split('.')[0]
            };
        })
    };
}

function compile(path, cb) {
    fs.readFile(path, function(err, f) {
        cb(err, Handlebars.compile(f.toString()));
    });
}

Handlebars.registerHelper('list', function(items, options) {
    return items.map(function(val) {
            return options.fn(val);
        }).join(',\n    ');
});
