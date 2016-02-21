// simple timestampled logger

module.exports = function log() {
  var args = Array.prototype.slice.call(arguments, 0);
  var dateString = (new Date()).toISOString();
  args[0] = `[${dateString}] ${args[0]}`;
  console.log.apply(console, args);
};
