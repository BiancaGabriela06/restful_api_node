const http = require('http');
const app = require('./app');
var fs = require('fs');

var configPath = './config.json'
var parsed = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));

const port = process.env.PORT || parsed.port;

const server = http.createServer(app);

server.listen(port, () => {
    console.log('Connected to port ' + parsed.port);
});