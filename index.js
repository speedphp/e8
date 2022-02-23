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
            res.end("Oops! No proxy matched.");
        }else{
            proxy.web(req, res, {
                target: jumpTo
            });
        }
    }
}).listen(switchService.getPort());


