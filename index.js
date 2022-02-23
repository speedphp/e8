var http = require('http'), httpProxy = require('http-proxy');
var cookie = require('cookie');
var proxy = httpProxy.createProxyServer();
var switchService = require("./switch.js");

http.createServer(function (req, res) {
    var match = switchService.matchSwitch(req.url);
    if(match){
        switchService.displaySwitch(req.url, res);
    }else{
        var cookies = cookie.parse(req.headers.cookie || '');
        var jumpTo = switchService.switchJumpTo(cookies.jumpTo);
        if(jumpTo === null) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write("Oops! No proxy matched. Please go to <a href='/switch'>switch panel</a>.");
            res.end();
        }else{
            proxy.web(req, res, {
                target: jumpTo
            });
        }
    }
}).listen(switchService.getPort());


