const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "eval",
    description: "Bot Owner komududur",
    category: "OWNER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: [],
      usage: ".eval [code]",
    },

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {
        if (!args[0]) return;
        let code = args.join(" ");
    
        try {
          var result = clean(await eval(code));
          if (result.includes(client.token))
            return message.channel.send({ content: "https://tenor.com/view/kocaman-bir-nah-nah-el-hareketi-dance-lick-hands-gif-17894624"});
            message.channel.send({ content: `\`\`\`js\n${result}\n\`\`\``});
        } catch (e) {
                return message.channel.send({ content: `\`\`\`js\n${e}\n\`\`\`` });
            }
      },
      
  };

  function clean(text) {
    if (typeof text !== "string")
      text = require("util").inspect(text, { depth: 0 });
    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));
    return text;
  }