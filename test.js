var http = require('http');

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('This is 9001 server, proxied to: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2));
    res.end();
}).listen(9001);

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('This is 9002 server, proxied to: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2));
    res.end();
}).listen(9002);

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('This is 9003 server, proxied to: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2));
    res.end();
}).listen(9003);