module.exports = class CanvasFunction {
    constructor(ctx) {
        this.ctx = ctx;
    };

    /**
     * roundedImage()
     * @property {ctx} ctx Canvas ctx
     * @param {object} ctx Canvas ctx 
     * @param {number|bigint} x Number
     * @param {number|bigint} y Number
     * @param {number|bigint} width Number
     * @param {number|bigint} height Number
     * @param {number|boolean} radius Number Or Boolean
     * @returns {roundedImage}
     * @example roundedImage(ctx,50,50,500,300,10)
     * @example roundedImage(ctx,50,50,500,300,true)
     */
    roundedImage(x, y, width, height, radius) {
        if (radius === true) radius = 5;
        if (!radius || typeof radius !== "number") radius = 0;

        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
        this.ctx.fill();

        return this.ctx;
    }


    cropCircleImage(x, y, ratio) {
        if (ratio === true) ratio = 20;
        if (!ratio || typeof ratio !== "number") ratio = 20;

        tmpCtx.save();
        tmpCtx.beginPath();
        tmpCtx.arc(x, y, ratio, 0, Math.PI * 2, true);
        tmpCtx.closePath();
        tmpCtx.clip();

        return this.ctx;
    }



    drawCircle(x, y, size, color, full) {
        if (!color || color && !color.startsWith("#")) color = "#000";
        if (typeof size !== "number") throw new Error("[canvas-function] drawCircle size type must be a number.");
        if (typeof full !== "boolean") throw new Error("[canvas-function] drawCircle full type must be a boolean.");
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, 2 * Math.PI);
        if (full == true) {
            this.ctx.fillStyle = color;
            this.ctx.fill();
        } else {
            this.ctx.strokeStyle = color;
            this.ctx.stroke();
        }
        return this.ctx;
    }


    drawSquare(x, y, width, height, color, full) {
        if (!color || color && !color.startsWith("#")) color = "#000";
        if (typeof size !== "number") throw new Error("[canvas-function] drawSquare size type must be a number.");
        if (typeof full !== "boolean") throw new Error("[canvas-function] drawSquare full type must be a boolean.");
        this.ctx.beginPath();
        this.ctx.rect(x, y, width, height);
        if (full == true) {
            this.ctx.fillStyle = color;
            this.ctx.fill();
        } else {
            this.ctx.strokeStyle = color;
            this.ctx.stroke();
        }
        return this.ctx;
    }



    opacity(value) {
        if (!value || typeof value !== "number") { value = 1; console.error("[canvas-function] Default Value Defined Because 'opacity' Data Is Not Entered Correctly") }
        this.ctx.globalAlpha = value;
        return this.ctx;
    }


    font(value) {
        if (!value || typeof value !== "string") { value = "15px"; console.error("[canvas-function] Default Value Defined Because 'font' Data Is Not Entered Correctly") }
        this.ctx.font = value;
        return this.ctx;
    }

    align(value) {
        if (!value || typeof value !== "string" || !["center", "left", "right", "end", "start"].some(x => value == x)) { value = "right"; console.error("[canvas-function] Default Value Defined Because 'align' Data Is Not Entered Correctly") }
        this.ctx.textAlign = value;
        return this.ctx;
    }


    /**
     * 
     * @param {string} value color
     * @property {value} "stroke" 
     * @property {value} "fill" 
     * @alias "stroke"
     * @alias "fill"
     * @returns 
     */

    color(value) {
    this.ctx.fillStyle = value;
    return this.ctx;
    }

}