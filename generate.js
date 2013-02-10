#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var Handlebars = require('handlebars');
var filewalker = require('filewalker');

main();

function main() {
    generateExamples();
    generateFunkit();
}

function generateExamples() {
    var categories = {};

    // 1. get root file(s) -> basic category
    // 2. get files in dirs -> dir name -> category, contents -> items
    filewalker('./src/examples').on('file', function(p) {
        var parts = p.split('/');
        var category, item;

        if(parts.length > 1) {
            category = parts[0];
            item = parts[1];
        }
        else {
            category = 'none';
            item = parts[0];
        }

        item = item.split('.')[0];

        if(!(category in categories)) categories[category] = [];

        categories[category].push(item);
    }).on('done', function() {
        var outputPath = path.join(__dirname, 'src/js/examples.js');
        var templatePath = path.join(__dirname, '_templates/examples.hbs');

        writeTemplate(categories, outputPath, templatePath);
    }).walk();
}

function generateFunkit() {
    var funkit = {};

    filewalker('./src/components/funkit/lib').on('file', function(p) {
        var parts = p.split('.');

        if(p.indexOf('.') === 0) return;

        funkit[parts[0]] = 'components/funkit/lib/' + p;
    }).on('done', function() {
        var outputPath = path.join(__dirname, 'src/js/funkit.js');
        var templatePath = path.join(__dirname, '_templates/funkit.hbs');

        writeTemplate(funkit, outputPath, templatePath);
    }).walk();
}

function writeTemplate(data, outputPath, templatePath, out) {
    out = out || function() {};

    compile(templatePath, function(err, tpl) {
        fs.writeFile(outputPath, tpl(toObject(data)), out(outputPath));
    });
}

function toObject(data) {
    var ret = {
        examples: Object.keys(data).map(function(v) {
            return {
                category: v,
                items: data[v]
            };
        })
    };
    console.log(ret);
    return ret;
}

function compile(path, cb) {
    fs.readFile(path, function(err, f) {
        cb(err, Handlebars.compile(f.toString()));
    });
}

Handlebars.registerHelper('array', function(items, options) {
    return items.map(function(val) {
        return options.fn({item: val});
    });
});

Handlebars.registerHelper('list', function(items, options) {
    return items.map(function(val) {
        return options.fn(val);
    }).join(',\n    ');
});
