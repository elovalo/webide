// node-dev serve.js -> localhost:8080/dev.html
var connect = require('connect');
console.log('Running dev server');
console.log('Surf to localhost:8080/dev.html now');

connect.createServer(
    connect.static(__dirname + '/src')
).listen(8080);
