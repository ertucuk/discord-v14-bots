const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
dayjs().format();
dayjs.extend(duration);

module.exports = class Util {
  constructor() {
  }

  /**
   * Formats time
   * @param {number} time
   * @returns {string}
   */
  static format_time(time) {
    if (!time) return "00:00";
    const format = dayjs.duration(time).format("DD:HH:mm:ss");
    const chunks = format.split(":").filter(c => c !== "00");

    if (chunks.length < 2) chunks.unshift("00");

    return chunks.join(":");
  }


  static rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }


  static captchaKey(length = 8){
  if(length < 6){
    length = 6
    console.error("[Ertu] captcha key length must be at least 5, length set to 5.")}
    else if(length > 20){
      length = 20
      console.error("[Ertu] captcha key length must be at bigger 20, length set to 20.")}
  let result = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let count = 0;
  while (count < length) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
    count += 1;
  }
  return result;
  }

}

function componentToHex(c){
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}