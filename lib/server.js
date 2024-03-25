const net = require("net")
const log = require("./log")
const addr = require("./addr")

exports = module.exports = (configPath) => {
  const serverConfig = require(configPath).server

  for(let s in serverConfig) {

    const keyConfig = addr(s)
    const valConfig = addr(serverConfig[s])

    let to;
    net.createServer(socket => {
      to = socket
      log("The service for client listening has been started.")
    }).listen(valConfig)

    net.createServer(from => {
      log("The remote server received a message.")
      from.pipe(to)
      to.pipe(from)
    }).listen(keyConfig)
  }
}