const http = require('http'), httpProxy = require('http-proxy');
const cookie = require('cookie');
const proxy = httpProxy.createProxyServer({changeOrigin:true});
const log = require("./log")
exports = module.exports = (configPath) => {
    const webConfig = require(configPath).cookie
    const proxyServer = http.createServer(function (req, res) {
        if(matchSwitch(webConfig.path, req.url)){
            log("Enter to select Cookie Proxy.")
            displaySwitch(req.url, res, webConfig);
        }else{
            const cookies = cookie.parse(req.headers.cookie || '');
            const jumpTo = switchJumpTo(cookies.jumpTo, webConfig);
            if(jumpTo === null) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write("Oops! No proxy matched. Please go to <a href='" + webConfig. path + "'>switch panel</a>.");
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
    proxyServer.listen(webConfig.port, () => {
        log("Cookie web proxy started.")
    });
}

function matchSwitch(switchPath, url) {
    if(url === switchPath){
        return true;
    }else if(url.substring(0, switchPath.length + 1) === switchPath + "/"){
        return true;
    }
    return false;
}

function displaySwitch(url, res, config) {
    let listHtml = "";
    let needJump = false;
    for(u in config.mapper) {
        const subUrl = config.path + "/" + u + ".html";
        listHtml += "<li><a href='" + subUrl + "'>" + u + "</a></li>";
        if(subUrl === url){
            res.setHeader('Set-Cookie', cookie.serialize('jumpTo', String(u), {
                path:"/",
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 7 // 1 week
            }));
            needJump = true;
            log("Already selected " + u + " proxy.")
        }
    }
    if(needJump) {
        res.write("<html><head><meta http-equiv='refresh' content='0;url=/'></head><body></body></html>");
    }else{
        res.write("<!DOCTYPE html><html><head><meta charset='utf-8'><title>Switch To ...</title>" +
            "</head><body><h2>Switch To: </h2><ul>" + listHtml + "</ul></body></html>");
    }
    res.statusCode = 202;
    res.end();
}

function switchJumpTo(jumpTo, config) {
    for(u in config.mapper) {
        if(u === jumpTo) {
            return config.mapper[u];
        }
    }
    return null;
}



//cookieWeb("./config.json");

// test
// http.createServer(function (req, res) {
//     res.writeHead(200, { 'Content-Type': 'text/plain' });
//     res.write('This is 9001 server, proxied to: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2));
//     res.end();
// }).listen(9001);

// http.createServer(function (req, res) {
//     res.writeHead(200, { 'Content-Type': 'text/plain' });
//     res.write('This is 9002 server, proxied to: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2));
//     res.end();
// }).listen(9002);

// http.createServer(function (req, res) {
//     res.writeHead(200, { 'Content-Type': 'text/plain' });
//     res.write('This is 9003 server, proxied to: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2));
//     res.end();
// }).listen(9003);