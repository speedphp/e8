exports = module.exports = (...msg) => {
  require('tracer').console({
    format: "[E8] {{timestamp}} {{file}}:{{line}} ({{method}}) {{message}}",
    dateformat: "yyyy-mm-dd HH:MM:ss",
    stackIndex: 1,
    preprocess: function (data) {
        data.title = data.title.toUpperCase();
    }
  }).log(...msg)
}