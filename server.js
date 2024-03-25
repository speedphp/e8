const net = require("net")
const log = require("./log")

let proxySocket;

const proxy = net.createServer(socket => {
  proxySocket = socket
}).listen(7001)

const web = net.createServer(socket => {
  socket.on("data", d => {
    log("Remote web received a data.")
    socket.pipe(proxySocket)
    proxySocket.pipe(socket)
  })
}).listen(7002)
