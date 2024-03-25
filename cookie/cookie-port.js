var http = require('http'), httpProxy = require('http-proxy');
var cookie = require('cookie');
var proxy = httpProxy.createProxyServer({changeOrigin:true});
var switchService = require("./switch.js");

var proxyServer = http.createServer(function (req, res) {
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
});
proxyServer.on('upgrade', function (req, socket, head) {
    proxy.ws(req, socket, head);
});
proxyServer.listen(switchService.getPort());