const client = global.client;

/**
 * @param {Invite} invite
 * @returns {Promise<void>}
 */

client.on("inviteCreate", async (invite) => {
  const invites = await invite.guild.invites.fetch();

  const codeUses = new Map();
  invites.each(inv => codeUses.set(inv.code, inv.uses));

  client.invites.set(invite.guild.id, codeUses);
});
