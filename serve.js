#!/usr/bin/env node
// ./serve.js -> localhost:8080/dev.html
var connect = require('connect');
console.log('Running dev server');
console.log('Surf to localhost:8080/dev.html now');

module.exports = connect.createServer(
    connect['static'](__dirname + '/src')
);
