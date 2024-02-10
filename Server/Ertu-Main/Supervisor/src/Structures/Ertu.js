const { Client, Partials, Collection, ApplicationCommandType, Options, ButtonStyle,GatewayIntentBits } = require('discord.js');
const { recursiveReadDirSync } = require('../../../../../Global/Helpers/Utils');
const { initializeMongoose } = require("../DataBase/Mongoose");
const path = require("path");

class Ertu extends Client {
    constructor(options) {
        super({
          intents: [ 3276799, GatewayIntentBits.GuildPresences ],
          partials: [
            Partials.User, 
            Partials.Channel, 
            Partials.GuildMember,
            Partials.Message,
            Partials.Reaction,
            Partials.GuildScheduledEvent,
            Partials.ThreadMember
          ],
        });

        this.commands = new Collection();
        this.slashcommands = new Collection();
        this.contextcommands = new Collection();
        this.aliases = new Collection();
        this.invites = new Collection(); 

        this.ertucumharikasin = options.Directory;
        this.token = options.token;

        require("../../../../../Global/Helpers/Dates");
        require("../../../../../Global/Helpers/Numbers");

        this.config = global.config = require("../../../../../Global/Settings/Setup.json");
        this.sistem = global.system = require("../../../../../Global/Settings/System");
        this.logger = global.logger = require("../../../../../Global/Helpers/Logger");
        this.replys = global.replys = require("../../../../../Global/Helpers/Replys");

        this.on("unhandledRejection", async (err) => { this.logger.error(`${this.ertucumharikasin}  ERROR => ` + err) })

        this.on("guildUnavailable", async (guild) => { this.logger.error(`[UNAVAIBLE GUILD]: ${guild.name}`) });
        this.on("disconnect", async () => { this.logger.error(`Bot is disconnecting...`, this.ertucumharikasin) })
        this.on("reconnecting", async () => { this.logger.error(`Bot reconnecting...`, this.ertucumharikasin) })
        this.on("error", async (e) => { this.logger.error(` => Error`, e)})
        this.on("warn", async (info) => { this.logger.error(` => Warn`, info) })
        this.on("unhandledRejection", async (err) => { this.logger.error(` => Caution`, err) })
        this.on("warning", async (warn) => { this.logger.error(` => Warn`, warn) })
        this.on("beforeExit", async () => { this.logger.error("The system is shutting down...", this.ertucumharikasin) })
        this.on("uncaughtException", async (err) => {
          const hata = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
          this.logger.error(` => Unexpected Error`, hata) 
        })
    }

    loadClient(options) {
        this.logger.log(`Komutlar, Eventler ve Veri Tabanı Yükleniyor...`);
        if(options.Events) {
            let success = 0;
            let failed = 0;

            const Events = recursiveReadDirSync("src/events");
            for (const file of Events) {
            try {
               const event = require(file);
               //this.on(event.config.Event, event.bind([object], this));
               delete require.cache[require.resolve(file)];
               success += 1;
            } catch (ex) { failed += 1; this.logger.error(`${file} HATA-EVENT => ${ex.message}`); }
      }
            this.logger.debug(`${success + failed} event yüklendi. Başarılı (${success}) Başarısız (${failed})`);
        }

        if(options.Commands) {
            const files = recursiveReadDirSync("src/Commands");
            for (const file of files) {
                try {
                    const cmd = require(file);
                    if(cmd.onLoad != undefined && typeof cmd.onLoad == "function") cmd.onLoad(this);
                    if (cmd.command.enabled) {
                        this.commands.set(cmd.name, cmd);
                        if (cmd.command.aliases) cmd.command.aliases.forEach(alias => this.aliases.set(alias, cmd));
                    } else { this.logger.debug(`${cmd.name} komutu atlanıyor. Devre dışı!`); }
                } catch (ex) { this.logger.error(`${file} yüklenemedi Neden: ${ex.message}`); }
            }

            this.logger.debug(`Toplamda ${this.commands.size} komut yüklendi`);
        }
    }
    async registerInteractions(guildId) {
        const toRegister = [];
        
        // Register GLobally
        if (!guildId) { await this.application.commands.set(toRegister); }
    
        else if (guildId && typeof guildId === "string") {
          const guild = this.guilds.cache.get(guildId);
          if (!guild) { this.logger.error(`${guildId} sunucusundaki etkileşimler kaydedilemedi`, new Error("Eşleşen lonca yok")); return; }
          await guild.commands.set(toRegister);
        }
    
        else { throw new Error("Etkileşimleri kaydetmek için geçerli bir lonca kimliği sağladınız mı?"); }
    
        this.logger.debug(`Başarıyla ${guildId ? "sunucuya etkileşimler" : " sunuculara etkileşimler"} kaydedildi`);
    }
      
    async connect() {
        if(!this.token) {
            this.logger.error(`${this.ertucumharikasin} => Tokeni girilmediğinden dolayı bot kapanıyor...`);
            process.exit()
            return;
        }

        await this.login(this.token).then(Lethh => { 
            this.on("ready", async () => {
                let guild = this.guilds.cache.get(this.sistem.ServerID);
                if(!guild) {
                    return process.exit();
                }
            })
        }).catch(err => { 
            this.logger.log(`${this.ertucumharikasin} => Botun tokeni doğrulanamadı. 5 Saniye sonra tekrardan denenecektir...`)
            setTimeout(() => {
                this.login(this.token).catch(Lethh => {
                    this.logger.error(`${this.ertucumharikasin} => Bot tokeni tamamiyle doğrulanamadı.. Bot kapanıyor...`)
                    process.exit()
                })
            }, 5000 )
        }) 
    };
}
module.exports = { Ertu }
