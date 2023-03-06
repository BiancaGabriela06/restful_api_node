const http = require('http');
const app = require('./app');

const port = process.env.PORT || 2255;

const server = http.createServer(app);

server.listen(port, () => {
    console.log('Connected to port 2255');
});