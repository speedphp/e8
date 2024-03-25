
exports = module.exports = (addr) => {
  if(typeof addr == 'number') {
    return addr
  }
  const spilt = addr.split(":")
  if(spilt.length > 1) {
    return {
      host: spilt[0],
      port: spilt[1]
    }
  }
  return addr;
}
