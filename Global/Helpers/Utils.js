const { readdirSync, lstatSync } = require("fs");
const { join, extname } = require("path");
module.exports = class Utils {
    static recursiveReadDirSync(dir, allowedExtensions = [".js"]) {
        const filePaths = [];
        const readCommands = (dir) => {
          const files = readdirSync(join(process.cwd(), dir));
          files.forEach((file) => {
            const stat = lstatSync(join(process.cwd(), dir, file));
            if (stat.isDirectory()) {
              readCommands(join(dir, file));
            } else {
              const extension = extname(file);
              if (!allowedExtensions.includes(extension)) return;
              const filePath = join(process.cwd(), dir, file);
              filePaths.push(filePath);
            }
          });
        };
        readCommands(dir);
        return filePaths;
      }

      static timeformat(timeInSeconds) {
        const days = Math.floor((timeInSeconds % 31536000) / 86400);
        const hours = Math.floor((timeInSeconds % 86400) / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = Math.round(timeInSeconds % 60);
        return (
          (days > 0 ? `${days} güm, ` : "") +
          (hours > 0 ? `${hours} saat, ` : "") +
          (minutes > 0 ? `${minutes} dakika, ` : "") +
          (seconds > 0 ? `${seconds} saniye` : "")
        );
      }
};