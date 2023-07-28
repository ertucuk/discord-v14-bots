const client = global.client;


/**
 * @param {Invite} invite
 * @returns {Promise<void>}
 */

 client.on("inviteDelete", async (invite) => {
  const invites = await invite.guild.invites.fetch();

  if(!invites) return;

  invites.delete(invite.code);
  client.invites.delete(invite.guild.id, invites);
});
