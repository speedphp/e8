const net = require("net")
const log = require("./log")
const addr = require("./addr")

exports = module.exports = (configPath) => {
  const clientConfig = require(configPath).client

  for(let c in clientConfig) {
    const keyConfig = addr(c)
    const valConfig = addr(clientConfig[c])
    makeConnection(keyConfig, valConfig)
  }
}

function makeConnection(key, val) {
  const remote = net.createConnection(key, () => {
    log("Connected to the remote listening server.")
  })

  remote.once("data", (d) => {
    const local = net.createConnection(val, () => {
      local.write(d)
      remote.pipe(local)
      local.pipe(remote)
    })
  })

  remote.once("close", () => {
    log("The remote listening server closed the connection.")
    setTimeout(() => {
      makeConnection(key, val)
    }, 1000)
  })
}