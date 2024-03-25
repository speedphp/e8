var fs = require('fs'), ini = require('ini');
var cookie = require('cookie');
var config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));
exports = module.exports = {
    getPort : function(){
        return config.port;
    },
    matchSwitch: function (url) {
        var switchPath = config.path;
        if(url === switchPath){
            return true;
        }else if(url.substring(0, switchPath.length + 1) === switchPath + "/"){
            return true;
        }
        return false;
    },

    switchJumpTo:function(jumpTo) {
        for(u in config.mapper) {
            if(u === jumpTo) {
                return config.mapper[u];
            }
        }
        return null;
    },

    displaySwitch: function (url, res) {
        var listHtml = "";
        var needJump = false;
        for(u in config.mapper) {
            var subUrl = config.path + "/" + u + ".html";
            listHtml += "<li><a href='" + subUrl + "'>" + u + "</a></li>";
            if(subUrl === url){
                res.setHeader('Set-Cookie', cookie.serialize('jumpTo', String(u), {
                    path:"/",
                    httpOnly: true,
                    maxAge: 60 * 60 * 24 * 7 // 1 week
                }));
                needJump = true;
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
}

