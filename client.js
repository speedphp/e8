const net = require("net")
const log = require("./log")

const remote = net.createConnection({
  host: "127.0.0.1",
  port: 7001
}, () => {
  log("Connected to remote.")
})


remote.on("data", () => {
  log("Received msg.")
  
})



