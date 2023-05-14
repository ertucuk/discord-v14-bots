const { Client, Partials, Collection, ApplicationCommandType, Options, } = require('discord.js');
const { recursiveReadDirSync } = require('../Helpers/Utils');
const { initializeMongoose } = require("../DataBase/Mongoose");
const path = require("path");
const client = global.bot;
const penals = require("../schemas/penals");

class Lethh extends Client {
    constructor(options) {
        super({
          intents: [ 3276799 ],
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

        this.kaanxsrd = options.Directory;
        this.token = options.token;

        require("../Helpers/Dates");
        require("../Helpers/Numbers");

 

        this.sistem = global.system = require("../Settings/System");
        this.logger = global.logger = require("../Helpers/Logger");
        this.replys = global.replys = require("../Helpers/Replys");

        this.on("unhandledRejection", async (err) => { this.logger.error(`${this.kaanxsrd}  ERROR => ` + err) })

        this.on("guildUnavailable", async (guild) => { this.logger.error(`[UNAVAIBLE GUILD]: ${guild.name}`) });
        this.on("disconnect", async () => { this.logger.error(`Bot is disconnecting...`, this.kaanxsrd) })
        this.on("reconnecting", async () => { this.logger.error(`Bot reconnecting...`, this.kaanxsrd) })
        this.on("error", async (e) => { this.logger.error(` => Error`, e)})
        this.on("warn", async (info) => { this.logger.error(` => Warn`, info) })
        this.on("unhandledRejection", async (err) => { this.logger.error(` => Caution`, err) })
        this.on("warning", async (warn) => { this.logger.error(` => Warn`, warn) })
        this.on("beforeExit", async () => { this.logger.error("The system is shutting down...", this.kaanxsrd) })
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
            const files = recursiveReadDirSync("src/commands");
            for (const file of files) {
                try {
                    const cmd = require(file);
                    if(cmd.onLoad != undefined && typeof cmd.onLoad == "function") cmd.onLoad(this);
                    if (cmd.command.enabled) {
                        this.commands.set(cmd.name, cmd);
                        if (cmd.command.aliases) cmd.command.aliases.forEach(alias => this.aliases.set(alias, cmd));
                    } else { this.logger.debug(`${cmd.name} komutu atlanıyor. Devre dışı!`); }

                    if (cmd.slashCommand?.enabled) {
                        this.slashcommands.set(cmd.name, cmd);
                    } else { this.logger.debug(`${cmd.name} Slash komutu atlanıyor. devre dışı!`); }
                } catch (ex) { this.logger.error(`${file} yüklenemedi Neden: ${ex.message}`); }
            }

            this.logger.debug(`Toplamda ${this.commands.size} komut yüklendi`);
            this.logger.debug(`Toplamda ${this.slashcommands.size} Slash komut yüklendi`);
            if (this.slashcommands.size > 100) throw new Error("En fazla 100 eğik çizgi komutu etkinleştirilebilir");
        }

        if(options.Contexts) {
          const files = recursiveReadDirSync("src/contexts");
          for (const file of files) {
            try {
              const ctx = require(file);
              if (typeof ctx !== "object") continue;
              if (!ctx.enabled) return this.logger.debug(`${ctx.name} adlı context menü atlanıyor. devre dışı!`);
              if (this.contextcommands.has(ctx.name)) throw new Error(`bu ada sahip context menü zaten var`);
              this.contextcommands.set(ctx.name, ctx);
            } catch (ex) {
              this.logger.error(`${file} yüklenemedi Neden: ${ex.message}`);
            }
          }
        }

        if(options.Database) { initializeMongoose() }

        this.on("ready", async () => {
          if (options.Slashes || options.Contexts) {
            if (!this.sistem.Moderation.GlobalInteractions) await this.registerInteractions();
            else await this.registerInteractions(this.sistem.ServerID);
          }
          
          await this.logger.botReady(`${this.user.tag}`);
        })
    }

    async registerInteractions(guildId) {
        const toRegister = [];
        
        this.slashcommands.map((cmd) => ({
            name: cmd.name,
            description: cmd.description,
            type: ApplicationCommandType.ChatInput,
            options: cmd.slashCommand.options,
        })).forEach((s) => toRegister.push(s));

        this.contextcommands.map((ctx) => ({
            name: ctx.name,
            type: ctx.type,
        })).forEach((c) => toRegister.push(c));
    
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
      
    async getEmojiId(guildId, emojiName) {
        if(!guildId) return new Error("Bir sunucu ID'si belirtmelisin!");
        if(!emojiName) return new Error("Bir emoji belirtilmeli!");
        const emoji = this.guilds.cache.get(guildId).emojis.cache
        .find(emoji => emoji.name === emojiName);

        return emoji ? emoji.id : null;
    }


    async connect() {
        if(!this.token) {
            this.logger.error(`${this.kaanxsrd} => Tokeni girilmediğinden dolayı bot kapanıyor...`);
            process.exit()
            return;
        }

        await this.login(this.token).then(Lethh => { 
            this.on("ready", async () => {
                let guild = this.guilds.cache.get(this.sistem.ServerID);
                if(!guild) {
                    console.log(`https://discord.com/api/oauth2/authorize?client_id=${this.user.id}&permissions=0&scope=bot%20applications.commands`)
                    return process.exit();
                }
            })
        }).catch(err => { 
            this.logger.log(`${this.kaanxsrd} => Botun tokeni doğrulanamadı. 5 Saniye sonra tekrardan denenecektir...`)
            setTimeout(() => {
                this.login(this.token).catch(Lethh => {
                    this.logger.error(`${this.kaanxsrd} => Bot tokeni tamamiyle doğrulanamadı.. Bot kapanıyor...`)
                    process.exit()
                })
            }, 5000 )
        }) 
    };
}
module.exports = { Lethh }
