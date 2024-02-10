const { bgBlue, black, green, bgGreenBright, bgWhiteBright } = require("chalk");

module.exports = class Logger {
  static log(content, type = "log", name) {
    const date = `[${tarihsel(Date.now())}]`;
    switch (type) {
      case "botReady": {
        return console.log(`${date} ${green("✓")} ${content}`); 
      }
      case "log": {
        return console.log(`${date} ${bgBlue(type.toUpperCase())} ${content}`);
      }
      case "warn": {
        return console.log(`${date} ${black.bgHex('#D9A384')(type.toUpperCase())} ${content}`);
      }
      case "error": {
        return console.log(`${date} ${black.bgHex('#FF0000')(type.toUpperCase())} ${content}`);
      }
      case "debug": {
        return console.log(`${date} ${green(type.toUpperCase())} ${content}`);
      }
      case "cmd": {
        return console.log(`${date} ${black.bgHex('#8dbe85')(type.toUpperCase())} ${content}`);
      }
      case "ready": {
        return console.log(`${date} ${black.bgHex('#48D09B')(type.toUpperCase())} ${content}`);
      }
      case "mongodb": {
        return console.log(`${date} ${black.bgHex('#F9D342')(type.toUpperCase())} ${content}`);
      }
      case "interface": {
        return console.log(`${date} ${black.bgHex('#F9D342')(type.toUpperCase())} ${content}`);
      }
      case "reconnecting": {
        return console.log(`${date} ${black.bgHex('#133729')(type.toUpperCase())} ${content}`);
      }
      case "disconnecting": {
        return console.log(`${date} ${black.bgHex('#782020')(type.toUpperCase())} ${content}`);
      }
      case "load": {
        return console.log(`${date} ${black.bgHex('#00D6FF')(type.toUpperCase())} ${content}`);
      }
      case "varn": {
        return console.log(`${date} ${black.bgHex('#EEA2AD')(type.toUpperCase())} ${content}`);
      }
      case "caution": {
        return console.log(`${date} ${black.bgHex('#FF0000')(type.toUpperCase())} ${content}`);
      }
      case "event": {
        return console.log(`${date} ${black.bgHex('#C509D8')(type.toUpperCase())} ${content}`);
      }
      case "ups": {
        return console.log(`${date} ${black.bgHex('#CAB62F')(type.toUpperCase())} ${content}`);
      }
      case "stat": {
        return console.log(`${date} ${black.bgHex('#3DA6FF')(type.toUpperCase())} ${content}`);
      }
      case "category": {
        return console.log(`${date} ${black.bgHex('#E8D4A9')(type.toUpperCase())} ${content}`);
      }
      case "backup": {
        return console.log(`${date} ${black.bgHex('#00FF3B')(type.toUpperCase())} ${content}`)
      }
      case "dist": {
        return console.log(`${date} ${black.bgHex('#DFEB4B')(type.toUpperCase())} ${content}`)
      }
      default: throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.");
    }
  }
};