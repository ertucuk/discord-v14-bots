const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const Util = require("./Util");
const path = require('path');
/**
 * @typedef {object} Spotify
 * @see {Spotify}
 * @example 
 * @type {Class}
 */
module.exports = class ertuSpotify {
  constructor(options) {
    this.font = { name: options?.font?.name ?? "Manrope", path: options?.font?.path };
    this.album = null;
    this.artist = null;
    this.border = null;
    this._bar_width = 1400;
    this.end = null;
    this.overlay_opacity = null;
    this.image = null;
    this.blur = 3;
    this.title = null;
    this.start = null;
    this.spotifyLogo = true;
    this.randomColors = ["#0c0c0c","#121212","#282828","#1c1c1c","#244c66"];
  }

  /**
   * .setAlbum
   * @param {string} name Album Name
   * @returns {Spotify}
   * @example setAlbum("Alan Walker Album")
   */
  setAlbum(name) {
    if (!name || typeof name !== "string") throw new Error("The argument of the setAlbum method must be a string.");
    this.album = name;
    return this;
  }

  /**
   * .setAuthor
   * @param {string} name Artist Name
   * @returns {Spotify}
   * @example setAuthor("Alan Walker, Ava Max")
   */
  setAuthor(name) {
    if (!name || typeof name !== "string") throw new Error("The argument of the setAuthor method must be a string.");
    this.artist = name;
    return this;
  }


  /**
     * .setBorder
     * @param {string} color "hexcolor"
     * @returns {Spotify}
     * @example setBorder("#fff")
     */
  setBorder(color) {
    if (color) {
      if (/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(color)) {
        this.border = color;
        return this;
      } else {
        throw new Error("Invalid color for the argument in the setBorder method. You must give a hexadecimal color.")
      }
    } else {
      throw new Error("You must give a hexadecimal color as the argument of setBorder method.");
    }
  }


   /**
     * .setOverlayOpacity
     * @param {number} opacity must be between 0 and 1
     * @returns {Spotify}
     * @example setOverlayOpacity(0.7)
     */
   setOverlayOpacity(opacity = 0) {
    if (opacity) {
      if (opacity >= 0 && opacity <= 1) {
        this.overlay_opacity = opacity;
        return this;
      } else {
        throw new Error("The value of the opacity of setOverlayOpacity method must be between 0 and 1 (0 and 1 included).");
      }
    }
  }

  /**
     * .setBlur
     * @param {number} blur setImage blur effect px
     * @default blur 3
     * @returns {Spotify}
     * @example setBlur(5) - Max 15px
     */
  setBlur(blur = 3) {
    if (blur) {
      if (blur >= 0 && blur <= 15) {
        this.blur = blur;
        return this;
      } else {
        throw new Error("The value of the opacity of setBlur method must be between 0 and 15 (0 and 15 included).");
      }
    }
  }

  /**
   * .setImage
   * @param {string|Buffer|Image} image Album Or Song Image
   * @returns {Spotify}
   * @example setImage("https://someone-image.png")
   */
  setImage(image) {
    if (!image) throw new Error("The argument of the setImage method must be a string or a Buffer or a Canvas.Image.");
    this.image = image;
    return this;
  }

  /**
   * .setTitle
   * @param {string} title Title To Set
   * @returns {Spotify}
   * @example setTitle("Alone, Pt II")
   */
  setTitle(title) {
    if (!title || typeof title !== "string") throw new Error("The argument of the setTitle method must be a string.");
    this.title = title;
    return this;
  }


  /**
     * .setSpotifyLogo
     * @param {boolean} bool must be "true" or "false"
     * @returns {Spotify}
     * @default bool true
     * @example setSpotifyLogo(true)
     */
 setSpotifyLogo(bool){
  if(typeof bool !== "boolean") {
      throw new Error("You must give a abbreviate number true or false argument.");
    }
 this.spotifyLogo = bool;
 return this;
}

  /**
   * .setTimestamp
   * @param {number} start Start Timestamp
   * @param {number} end End Timestamp
   * @returns {Spotify}
   * @example setTimestamp(40000,179000)
   */
  setTimestamp(start, end) {
    if (!start || typeof start !== "number") throw new Error("The first argument of the setTimestamp method must be a number.");
    if (!end || typeof end !== "number") throw new Error("The first argument of the setTimestamp method must be a number.");
    this.start = start;
    this.end = end;
    return this;
  }

  /**
   * @private
   */
  _calcule_progress(current, total) {
    const progress = (current / total) * this._bar_width;
    if (isNaN(progress) || current < 0) {
      return 0;
    } else if (progress > this._bar_width) {
      return this._bar_width;
    } else {
      return progress;
    }
  }

  async build() {
    if (!this.title) throw new Error("Missing 'title' parameter.");
    if (!this.artist) throw new Error("Missing 'artist' parameter.");
    if (!this.start) throw new Error("Missing 'start' parameter.");
    if (!this.end) throw new Error("Missing 'end' parameter.");

    if (this.font.path) GlobalFonts.registerFromPath(this.font.path, this.font.name);

    const start_format = Util.format_time(this.start > this.end ? this.end : this.start);
    const end_format = Util.format_time(this.end);

    const canvas = createCanvas(2000, 585);
    const ctx = canvas.getContext("2d");


   
    if (this.border) {
      ctx.beginPath();
      ctx.lineWidth = 8;
      ctx.strokeStyle = this.border;
      ctx.moveTo(55, 15);
      ctx.lineTo(canvas.width - 55, 15);
      ctx.quadraticCurveTo(canvas.width - 20, 20, canvas.width - 15, 55);
      ctx.lineTo(canvas.width - 15, canvas.height - 55);
      ctx.quadraticCurveTo(canvas.width - 20, canvas.height - 20, canvas.width - 55, canvas.height - 15);
      ctx.lineTo(55, canvas.height - 15);
      ctx.quadraticCurveTo(20, canvas.height - 20, 15, canvas.height - 55);
      ctx.lineTo(15, 55);
      ctx.quadraticCurveTo(20, 20, 55, 15);
      ctx.lineTo(56, 15);
      ctx.stroke();
      ctx.closePath();
    }

    ctx.beginPath();
    ctx.moveTo(65, 25);
    ctx.lineTo(canvas.width - 65, 25);
    ctx.quadraticCurveTo(canvas.width - 25, 25, canvas.width - 25, 65);
    ctx.lineTo(canvas.width - 25, canvas.height - 65);
    ctx.quadraticCurveTo(canvas.width - 25, canvas.height - 25, canvas.width - 65, canvas.height - 25);
    ctx.lineTo(65, canvas.height - 25);
    ctx.quadraticCurveTo(25, canvas.height - 25, 25, canvas.height - 65);
    ctx.lineTo(25, 65);
    ctx.quadraticCurveTo(25, 25, 65, 25);
    ctx.lineTo(66, 25);
    ctx.closePath();
    ctx.clip();

    ctx.globalAlpha = 1;

    if (!this.image || this.image == null) {
      ctx.beginPath();
      ctx.fillStyle = `${this.randomColors[Math.floor(Math.random()*this.randomColors.length)]}`;
      ctx.fillRect(10, 10, canvas.width, canvas.height)
    } else if (this.image) {
      try {
      ctx.filter = `blur(${this.blur}px)`;
      ctx.drawImage(await loadImage(this.image), 0, -500, canvas.width, 2000);
      } catch {
        throw new Error("The image given in the parameter of the setImage method is not valid or you are not connected to the internet.");
      }
    }


    ctx.filter = "none";

    if(this.overlay_opacity){
    ctx.beginPath();
    ctx.globalAlpha = this.overlay_opacity;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    }

    ctx.globalAlpha = 1;

  
    const progressBar = (ctx, x, y, width, height) => {
      ctx.fillStyle = "#6a625e";
      roundRect(ctx, x, y, width, height, 8, true, false);
      ctx.fillStyle = "#fff";
      roundRect(ctx, x, y, this._calcule_progress(this.start, this.end), height, 8, true, false);
      ctx.beginPath();
      ctx.arc(x + this._calcule_progress(this.start, this.end), y + height / 2, height * 1.25, 0, 360);
      ctx.fill();
      ctx.closePath();
    };


    progressBar(ctx, 300, 400, this._bar_width, 8)
    
    if(this.spotifyLogo){
    try {
      ctx.drawImage(await loadImage(`${__dirname}/../../Images/Spotify.png`), 950, 60, 100, 100);
    } catch {
      throw new Error("The image given in the parameter of the Spotify method is not valid or you are not connected to the internet.");
    }
  }
   

    ctx.fillStyle = "#fff";
    ctx.font = `bold 50px ${this.font.name}`;
    ctx.textAlign = "center";
    ctx.fillText(this.title.length >= 40 ? this.title.slice(0, 40)+"...": this.title, 1000, 285);

    ctx.fillStyle = "#94a3b8";
    ctx.font = `bold 28px ${this.font.name}`;
    ctx.textAlign = "center";
    ctx.fillText(`${this.artist.length >= 40 ? this.artist.slice(0, 40)+"...":this.artist}`, 1000, 215);

    if (this.album && typeof this.album === "string") {
      ctx.fillStyle = "#94a3b8";
      ctx.font = `regular 30px ${this.font.name}`;
      ctx.fillText(`${this.album.length >= 40 ? this.album.slice(0, 40)+"...":this.album}`, 1000, 350);
    }

    ctx.fillStyle = "#cbd5e1";
    ctx.font = `"regular 20px ${this.font.name}`
    ctx.fillText(end_format, 1782, 412);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = `regular 20px ${this.font.name}`;
    ctx.fillText(start_format, 230, 412);


    return canvas.toBuffer('image/png');
  }
}

function roundRect(ctx, x, y, width, height, radius = 5, fill = true, stroke = false) {
  if (typeof radius === "number") {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  }
  else {
    let defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
    for (let side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }
};