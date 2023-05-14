const { timeformat } = require("../../Helpers/Utils");
const cooldownCache = new Map();
const client = global.client;
const { Events } = require("discord.js")


client.on("interactionCreate", async (interaction) => {
  
  if (!interaction.guild) {
    return interaction.reply({ content: "Komut yalnızca bir discord sunucusunda yürütülebilir", ephemeral: true }).catch(() => {});
}


if (interaction.isChatInputCommand()) {
  const slash = client.slashcommands.get(interaction.commandName);

  if(slash) {

    if (slash.cooldown) {
      const remaining = getRemainingCooldown(interaction.user.id, slash);
      if (remaining > 0) {
        return interaction.reply({ content: `Bekleme süresindesin. komutunu tekrar \`${timeformat(remaining)}\` sonra kullanabilirsiniz.`, ephemeral: true });
      }
    }

    if (slash.category === "OWNER" && !system.BotOwner.includes(interaction.user.id)) {
      return interaction.reply({ content: `Bu komuta yalnızca bot sahipleri erişebilir`, ephemeral: true });
    }

    try {
      await interaction.deferReply();
      await slash.onSlash(client, interaction);
      if (slash.cooldown > 0) applyCooldown(interaction.user.id, slash);
    } catch (ex) {
      await interaction.followUp("Hata! Komut çalıştırılırken bir hata oluştu");
      interaction.client.logger.error("interactionRun: " + ex);
    } 
  }
}

else if (interaction.isContextMenuCommand()) {
const context = client.contextcommands.get(interaction.commandName);
if (context) {
    if (context.cooldown) {
        const remaining = getRemainingCooldown(interaction.user.id, context);
        if (remaining > 0) {
          return interaction.reply({ content: `Bekleme süresindesin. komutunu tekrar \`${timeformat(remaining)}\` sonra kullanabilirsiniz.`, ephemeral: true });
        }
    }

    try {
        await context.onRequest(interaction.client, interaction);
        applyCooldown(interaction.user.id, context);
    } catch (ex) {
        interaction.reply({ content: `Hata! Komut çalıştırılırken bir hata oluştu`, ephemeral: true });
        interaction.client.logger.error("Context-Run: " + ex);
      }
}
else return interaction.reply({ content: "bir hata oluştu", ephemeral: true }).catch(() => {});
}

function applyCooldown(memberId, context) {
  const key = context.name + "|" + memberId;
  cooldownCache.set(key, Date.now());
  }
  
  function getRemainingCooldown(memberId, context) {
  const key = context.name + "|" + memberId;
  if (cooldownCache.has(key)) {
    const remaining = (Date.now() - cooldownCache.get(key)) * 0.001;
    if (remaining > context.cooldown) {
      cooldownCache.delete(key);
      return 0;
    }
    return context.cooldown - remaining;
  }
  return 0;
  }
})