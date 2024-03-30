const { MessageStat, MessageUserChannel, VoiceStat, VoiceUserChannel, StreamerStat, StreamerUserChannel, CameraStat, CameraUserChannel } = require("../../../../../Global/Models")

class GetTools {
    /**
     *
     * @param {string} userID 
     * @returns {Promise<number|undefined>} 
     * @throws {Error} 
     */
    static async GetDataAge(guildID, userID) {
        if (!userID) {
            console.log("Eksik veya geçersiz parametreler. - FirstDayGet()");
            return;
        }
        try {
            const userData = await MessageStat.findOne({ guildID: guildID, userID: userID } );

            if (userData && userData.date) {
                const firstDate = userData.date; 
                const today = new Date(); 
                const timeDifferenceMs = today - firstDate;
                const daysDifference = Math.floor(timeDifferenceMs / (1000 * 60 * 60 * 24));
                const hoursDifference = Math.floor(timeDifferenceMs / (1000 * 60 * 60));
                const minutesDifference = Math.floor(timeDifferenceMs / (1000 * 60));

                if (daysDifference === 0) {
                    if (hoursDifference === 0) {
                        return minutesDifference + " dakikalık veri";
                    } else {
                        return hoursDifference + " saatlik veri";
                    }
                } else {
                    return daysDifference + " gün " + (hoursDifference % 24) + " saatlik veri";
                }
            } else {
                return undefined;
            }
        } catch (error) {
            throw new Error("Veritabanı işlemi hatası: " + error.message);
        }
    }
}
module.exports = { GetTools }