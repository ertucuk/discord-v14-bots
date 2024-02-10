const { ApplicationCommandOptionType,EmbedBuilder, codeBlock  } = require("discord.js");
const client = global.bot;
const children = require("child_process");
const { log } = require("console");

module.exports = {
    name: "pm2",
    description: "",
    category: "OWNER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: [],
      usage: ".pm2", 
    },

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {

        if(!args) return message.reply({content:".pm2 <restart/stop/start/list> (Proc ID)"})
        const ls = children.exec(`pm2 ${args.join(' ')}`);
        ls.stdout.on('data', async function (content) {
            if (content.length > 2000) {
                const chunks = splitMessage(content, 2000);
                for (const chunk of chunks) {
                await message.channel.send({content:codeBlock(chunk)});
                }
            } else {
                await message.channel.send({content:codeBlock(content)});
            }  
        });

        function clean(string) {
            if (typeof text === "string") {
                return string.replace(/`/g, "`" + String.fromCharCode(8203))
                    .replace(/@/g, "@" + String.fromCharCode(8203))
            } else {
                return string;
            }
        }
        
        function splitMessage(content, limit) {
            const chunks = [];
            while (content.length) {
                if (content.length <= limit) {
                    chunks.push(content);
                    break;
                }
                let chunk = content.slice(0, limit);
                const lastSpaceIndex = chunk.lastIndexOf(' ');
                if (lastSpaceIndex !== -1) {
                    chunk = chunk.slice(0, lastSpaceIndex);
                }
                chunks.push(chunk);
                content = content.slice(chunk.length);
            }
            return chunks;

        }

  },

  };


  