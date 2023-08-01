const { ApplicationCommandOptionType,ChannelType,PermissionsBitField, EmbedBuilder,UserSelectMenuBuilder, ActionRowBuilder, StringSelectMenuBuilder, Events ,ButtonBuilder,ButtonStyle,ModalBuilder,TextInputBuilder, TextInputStyle} = require("discord.js");
const SpecialRoom = require("../../../../../../Global/Schemas/specialRoom");
const System = require("../../../../../../Global/Settings/System");
const { CronJob } = require("cron");
const ertum = require("../../../../../../Global/Settings/Setup.json");

module.exports = {
  name: "ozel-oda-panel",
  description: "Özel Oda Paneli",
  category: "OWNER",
  cooldown: 0,
  command: {
    enabled: true,
    aliases: ["ozelodapanel","secretroom","ozeloda","özelodapanel","özeloda"],
    usage: ".secretroom",
  },

   
    onLoad: function (client) {
      client.on(Events.ClientReady,async ()=>{
        const guild = await client.guilds.cache.get(System.ServerID)
        const dailySpecialRoomControl = new CronJob("0 0 * * *",async () => {
          const SpecialRoomsData = await SpecialRoom.find({guildID:System.ServerID})
          for (let i = 0; i < SpecialRoomsData.length; i++) {
            const SpecialRoomData = SpecialRoomsData[i];
            if((SpecialRoomData.lastEntry + 1000 * 60 * 5) > Date.now()){
              var channel = await guild.channels.cache.get(SpecialRoomData.channelID)
              if(channel) channel.delete();
              var roomHolder = await guild.members.cache.get(SpecialRoomData.userID)
              if(roomHolder) roomHolder.send({content:`Özel odanı **__5 Dakika__** boyunca kullanmadığın için silindi!`})
              await SpecialRoom.findOneAndDelete({guildID:guild.id,channelID:channel.id},{upsert:true})
            }
          }
        }, null, true, "Europe/Istanbul");
        await dailySpecialRoomControl.start();
      })
      client.on(Events.ChannelDelete,async (channel)=>{
       const channelData = await SpecialRoom.findOne({guildID:channel.guild.id,channelID:channel.id});
       if(channelData){
      await SpecialRoom.findOneAndDelete({guildID:channel.guild.id,channelID:channel.id},{upsert:true})
      const member = await client.users.cache.get(channelData.userID)
      if(member){
        await member.send({content:`Özel odan silindi!`}).catch(x=>undefined);
      }
       }
      })
      client.on(Events.VoiceStateUpdate, async (oldState,newState)=>{
        const memberData = await SpecialRoom.findOne({guildID:newState.guild.id,userID:newState.member.id});

        const emojiBul = (emojiName) => {
          if(!emojiName) return console.error(`[HATA]: Emoji Belirtiniz`);
          const emoji = client.emojis.cache.find(x => x.name.includes(emojiName));
          console.log(emoji ? emoji.id : "bulunamadı");
          return emoji ? emoji.id : "1102692516626710708";
        } 
      

      if(!oldState.member.voice.channelId == "1120250113227501688"){
        const memberData = await SpecialRoom.findOne({guildID:newState.guild.id,userID:newState.member.id});
        if(memberData){
          await newState.member.voice.setChannel(memberData.channelID);
        } else {
          newState.guild.channels.create( {
            name:newState.member.user.username,
            parent: ertum.SecretRoomsCategory[0],
            type: ChannelType.GuildVoice,
            permissionOverwrites: [
              {
                id: newState.guild.roles.everyone,
                allow: [PermissionsBitField.Flags.Speak],
                deny:[PermissionsBitField.Flags.Connect,PermissionsBitField.Flags.SendMessages,PermissionsBitField.Flags.SendVoiceMessages]
              },
              {
                id: newState.member.user.id,
                allow: [PermissionsBitField.Flags.MuteMembers, PermissionsBitField.Flags.DeafenMembers,PermissionsBitField.Flags.Stream],
              },
            ],
          }).then(async channel=>{
            await newState.member.voice.setChannel(channel.id);
          channel.send({
            content:`${newState.member}`,
           embeds:[
             new EmbedBuilder()
             .setAuthor({name:newState.member.user.username,iconURL:newState.member.user.avatarURL()})
             .setDescription(`${channel}, kanalının ayarlarını aşağıda ki butonlar ile değiştirebilirsiniz.`)
             .setImage("https://cdn.discordapp.com/attachments/1089646025192517733/1117358565355692093/voicePanel.png")
           ],
           components:[
            new ActionRowBuilder()
            .setComponents(
              new ButtonBuilder().setCustomId("edit").setEmoji(await emojiBul("appEmoji_duzenle")).setStyle(ButtonStyle.Secondary),
              new ButtonBuilder().setCustomId("lock").setEmoji(await emojiBul("appEmoji_kilitkapat")).setStyle(ButtonStyle.Secondary),
              new ButtonBuilder().setCustomId("unlock").setEmoji(await emojiBul("appEmoji_kilidac")).setStyle(ButtonStyle.Secondary),
              new ButtonBuilder().setCustomId("invisible").setEmoji(await emojiBul("appEmoji_gorunmez")).setStyle(ButtonStyle.Secondary),
           ),
            new ActionRowBuilder()
            .setComponents(
              new ButtonBuilder().setCustomId("visible").setEmoji(await emojiBul("appEmoji_gorunur")).setStyle(ButtonStyle.Secondary),
              new ButtonBuilder().setCustomId("add_user").setEmoji(await emojiBul("appEmoji_ekle")).setStyle(ButtonStyle.Secondary),
              new ButtonBuilder().setCustomId("remove_user").setEmoji(await emojiBul("appEmoji_cikar")).setStyle(ButtonStyle.Secondary),
              new ButtonBuilder().setCustomId("channel_delete").setEmoji(await emojiBul("appEmoji_cop")).setStyle(ButtonStyle.Secondary),
            )
           ]
          }).then(async x=> {
          await SpecialRoom.findOneAndUpdate({guildID:newState.guild.id,userID:newState.member.id},{$set:{only:true,channelID:channel.id,date:Date.now()}},{upsert:true})
          })    
  })
        }

      }
      if((memberData && memberData.channelID) && (newState.member.voice.channel.id === memberData.channelID)){
        await SpecialRoom.findOneAndUpdate({guildID:newState.guild.id,userID:newState.member.id},{$set:{lastEntry:Date.now()}},{upsert:true})
      }
      })
      client.on(Events.InteractionCreate, async i =>{
        const emojiBul2 = (emojiName) => {
          if(!emojiName) return console.error(`[HATA]: Emoji Belirtiniz`);
          const emoji = client.emojis.cache.find(x => x.name.includes(emojiName));
          console.log(emoji ? emoji.id : "bulunamadı");
          return emoji ? emoji.id : "1102692516626710708";
        } 
      
        let ChannelData = await SpecialRoom.findOne({guildID:i.guild.id,userID:i.member.id})
      switch (i.customId) {
        case "edit":
          if(!ChannelData) return i.reply({content:"Özel kanalınız bulunmadığı için bu özelliği kullanamazsınız.",ephemeral:true})
          var channel = i.guild.channels.cache.get(ChannelData.channelID)
          try {
              let modal = await new ModalBuilder().setTitle(`${channel.name} Voice Penal`).setCustomId("voicePanelChannelEdit")
              .setComponents(
                new ActionRowBuilder().setComponents(new TextInputBuilder().setCustomId("channelName").setLabel("Yeni adı giriniz.").setPlaceholder(`${channel.name}`).setStyle(TextInputStyle.Short).setValue(`${channel.name}`)),
                new ActionRowBuilder().setComponents(new TextInputBuilder().setCustomId("channelLimit").setLabel("Yeni limiti giriniz.").setPlaceholder(`${channel.userLimit}`) .setStyle(TextInputStyle.Short).setValue(`${channel.userLimit}`)),
                new ActionRowBuilder().setComponents(new TextInputBuilder().setCustomId("channelBitrate").setLabel("Yeni Bit Hızını Giriniz.").setPlaceholder(`8 ve katlarını giriniz`).setStyle(TextInputStyle.Short).setValue(`${channel.bitrate/1000}`)),
              )
            await i.showModal(modal);
            } catch (error) {
              console.log(error)
            }

          
          break;
          case "lock":
            if(!ChannelData) return i.reply({content:"Özel kanalınız bulunmadığı için bu özelliği kullanamazsınız.",ephemeral:true})
            var channel = i.guild.channels.cache.get(ChannelData.channelID)
            await  channel.permissionOverwrites.create(i.guild.roles.everyone, {1048576: false})
          .then(x=> i.reply({content:`Ses Kanalını Başarıyla Kitledin!`, ephemeral: true}))
          .catch(x=> i.reply({content:`Ses Kanalı Kitleme İşlemi Başarısız!`, ephemeral: true}))
          break;
          case "unlock":
            if(!ChannelData) return i.reply({content:"Özel kanalınız bulunmadığı için bu özelliği kullanamazsınız.",ephemeral:true})
            var channel = i.guild.channels.cache.get(ChannelData.channelID)
          await  channel.permissionOverwrites.create(i.guild.roles.everyone, {1048576: true})
          .then(x=> i.reply({content:`Ses Kanalının Kilidini Başarıyla Açtın!`, ephemeral: true}))
          .catch(x=> i.reply({content:`Ses Kanalının Kilit Açma İşlemi Başarısız!`, ephemeral: true}))
          break;
          case "visible":
            if(!ChannelData) return i.reply({content:"Özel kanalınız bulunmadığı için bu özelliği kullanamazsınız.",ephemeral:true})
            var channel = i.guild.channels.cache.get(ChannelData.channelID)
            await channel.permissionOverwrites.create(i.guild.roles.everyone, {1024: true})
          .then(x=> i.reply({content:`Ses Kanalının Gizliliği Kaldırma İşlemi Başarılı!`, ephemeral: true}))
          .catch(x=> i.reply({content:`Ses Kanalının Gizliliği Kaldırma İşlemi Başarısız!`, ephemeral: true}))
          break;
          case "invisible":
            if(!ChannelData) return i.reply({content:"Özel kanalınız bulunmadığı için bu özelliği kullanamazsınız.",ephemeral:true})
            var channel = i.guild.channels.cache.get(ChannelData.channelID)
           await channel.permissionOverwrites.create(i.guild.roles.everyone, {1024: false})
          .then(x=> i.reply({content:`Ses Kanalının Gizleme İşlemi Başarılı!`, ephemeral: true}))
          .catch(x=> i.reply({content:`Ses Kanalının Gizleme İşlemi Başarısız!`, ephemeral: true}))
          break;
          case "add_user":
            if(!ChannelData) return i.reply({content:"Özel kanalınız bulunmadığı için bu özelliği kullanamazsınız.",ephemeral:true})
            var channel = i.guild.channels.cache.get(ChannelData.channelID)
            i.reply({components:[
            new ActionRowBuilder()
            .addComponents( new UserSelectMenuBuilder().setCustomId('VoiceChannelPanelAddUSER').setPlaceholder('Kullanıcı ara.').setMinValues(1).setMaxValues(20))],ephemeral:true})
          break;
          case "remove_user":
            if(!ChannelData) return i.reply({content:"Özel kanalınız bulunmadığı için bu özelliği kullanamazsınız.",ephemeral:true})
            var channel = i.guild.channels.cache.get(ChannelData.channelID)
            let menuOptions = channel.permissionOverwrites.cache.filter(x=> i.guild.members.cache.get(x.id)).map(x=> ({label:i.guild.members.cache.get(x.id).user.username,description:undefined,value:x.id,emoji:{id:"1089511613352120320"}}))
          i.reply({components:[
          new ActionRowBuilder()
          .addComponents( new StringSelectMenuBuilder().setCustomId('VoiceChannelPanelRemoveUSER').setPlaceholder('Kullanıcı çıkarmak için tıkla.').setOptions(menuOptions.slice(0,25)))], ephemeral: true})
          break;
          case "channel_delete":
            if(!ChannelData) return i.reply({content:"Özel kanalınız bulunmadığı için bu özelliği kullanamazsınız.",ephemeral:true})
            var channel = i.guild.channels.cache.get(ChannelData.channelID)
            await i.deferUpdate();
            await SpecialRoom.findOneAndDelete({guildID:i.guild.id,channelID:channel.id},{upsert:true})
            channel.delete();
            break;
          case "created":
          if(ChannelData) return i.reply({content:`Özel odan zaten bulunuyor??`, ephemeral:true})
          i.guild.channels.create( {
            name:i.member.user.username,
            type: ChannelType.GuildVoice,
            parent: ertum.SecretRoomsCategory[0],
            permissionOverwrites: [
              {
                id: i.guild.roles.everyone,
                allow: [PermissionsBitField.Flags.Speak],
                deny:[PermissionsBitField.Flags.Connect,PermissionsBitField.Flags.SendMessages,PermissionsBitField.Flags.SendVoiceMessages]
              },
              {
                id: i.member.user.id, 
                allow: [PermissionsBitField.Flags.MuteMembers, PermissionsBitField.Flags.DeafenMembers,PermissionsBitField.Flags.Stream,PermissionsBitField.Flags.Connect],
              },
            ],
          }).then(async channel=>{
          channel.send({
            content:`${i.member}`,
           embeds:[
             new EmbedBuilder()
             .setAuthor({name:i.member.user.username,iconURL:i.member.user.avatarURL()})
             .setDescription(`${channel}, kanalının ayarlarını aşağıda ki butonlar ile değiştirebilirsiniz.`)
             .setImage("https://cdn.discordapp.com/attachments/1089646025192517733/1117358565355692093/voicePanel.png")
           ],
           components:[
            new ActionRowBuilder()
            .setComponents(
               new ButtonBuilder().setCustomId("edit").setEmoji(await emojiBul2("appEmoji_duzenle")).setStyle(ButtonStyle.Secondary),
               new ButtonBuilder().setCustomId("lock").setEmoji(await emojiBul2("appEmoji_kilitkapat")).setStyle(ButtonStyle.Secondary),
               new ButtonBuilder().setCustomId("unlock").setEmoji(await emojiBul2("appEmoji_kilidac")).setStyle(ButtonStyle.Secondary),
               new ButtonBuilder().setCustomId("invisible").setEmoji(await emojiBul2("appEmoji_gorunmez")).setStyle(ButtonStyle.Secondary),
            ),
             new ActionRowBuilder()
             .setComponents(
               new ButtonBuilder().setCustomId("visible").setEmoji(await emojiBul2("appEmoji_gorunur")).setStyle(ButtonStyle.Secondary),
               new ButtonBuilder().setCustomId("add_user").setEmoji(await emojiBul2("appEmoji_ekle")).setStyle(ButtonStyle.Secondary),
               new ButtonBuilder().setCustomId("remove_user").setEmoji(await emojiBul2("appEmoji_cikar")).setStyle(ButtonStyle.Secondary),
               new ButtonBuilder().setCustomId("channel_delete").setEmoji(await emojiBul2("appEmoji_cop")).setStyle(ButtonStyle.Secondary),
             )
           ]
          }).then(async x=> {
          i.reply({content:`**${channel.name}** isimli kanalın oluşturuldu. sana özel panel için ${x.url}`,ephemeral:true})
          await SpecialRoom.findOneAndUpdate({guildID:i.guild.id,userID:i.member.id},{$set:{only:true,channelID:channel.id,date:Date.now()}},{upsert:true})
          })    
  })
          break;
            default: 
          break;
      }            
      })  
      client.on(Events.InteractionCreate, async interaction =>{
        if (interaction.customId === 'VoiceChannelPanelAddUSER') {
          await interaction.deferUpdate()
          let ChannelData = await SpecialRoom.findOne({guildID:interaction.guild.id,userID:interaction.member.id})
          if(!ChannelData) return i.editReply({content:"Özel kanalınız bulunmadığı için bu özelliği kullanamazsınız.",components:[],ephemeral:true})
          let channel = interaction.guild.channels.cache.get(ChannelData.channelID)
          const selectedUsers = interaction.values;
          const selectedUserNames = selectedUsers.map(userId => {
            const user = interaction.guild.members.cache.get(userId)?.user;
            return user ? user.username : 'Bilinmeyen Kullanıcı';
          });
          selectedUsers.forEach(async x => {
            const user = interaction.guild.members.cache.get(x)?.user;
            await channel.permissionOverwrites.create(user, {4194304: true,8388608:true,512:true})
          });
          const replyMessage = `Aşağıda ki kullanıcıların kanala girişlerine izin verildi!\n${selectedUserNames.join(', ')}`;
          interaction.editReply({content:replyMessage,components:[],ephemeral:true});
        }
        if (interaction.customId === 'VoiceChannelPanelRemoveUSER') {
          await interaction.deferUpdate()
          let ChannelData = await SpecialRoom.findOne({guildID:interaction.guild.id,userID:interaction.member.id})
          if(!ChannelData) return i.editReply({content:"Özel kanalınız bulunmadığı için bu özelliği kullanamazsınız.",components:[],ephemeral:true})
          let channel = interaction.guild.channels.cache.get(ChannelData.channelID)
          const selectedUsers = interaction.values;
          const selectedUserNames = selectedUsers.map(userId => {
            const user = interaction.guild.members.cache.get(userId)?.user;
            return user ? user.username : 'Bilinmeyen Kullanıcı';
          });
        selectedUsers.forEach(async x => {
          const user = interaction.guild.members.cache.get(x)?.user;
          await channel.permissionOverwrites.delete(user)
        });
        const replyMessage = `Aşağıda ki kullanıcının kanala giriş izni başarıyla kaldırıldı!\n${selectedUserNames.join(', ')}`;
        interaction.editReply({content:replyMessage,components:[],ephemeral:true});
        }


      })
      client.on(Events.InteractionCreate, async m => {
        if(m.type !== 5) return;
        let ChannelData = await SpecialRoom.findOne({guildID:m.guild.id,userID:m.member.id})
        if(!ChannelData) return m.reply({content:"Özel kanalınız bulunmadığı için bu özelliği kullanamazsınız.",ephemeral:true})
        let channel = m.guild.channels.cache.get(ChannelData.channelID)
        if (m.customId === 'voicePanelChannelEdit') {
          const channelName = m.fields.getTextInputValue('channelName');
          const channelLimit = m.fields.getTextInputValue('channelLimit');
          const channelBitrate = m.fields.getTextInputValue('channelBitrate');
          var data = {
            name:channelName,
            bitrate:(channelBitrate*1000),
            userLimit:channelLimit
          }
          m.guild.channels.edit(channel.id,data).then(x=>{m.reply({content:`Kanal Ayarları Güncellendi!`,ephemeral:true})})
          .catch(x=>{ console.log(x), m.reply({content:`Kanal Ayarları Güncellenemedi!`,ephemeral:true}) })

        }
      })
    },
    onCommand: async function (client, message, args) {

       message.channel.send({
         content:`**Merhaba!** Özel Oda Oluşturma Sistemine Hoş Geldiniz!

Bu kısımdan kendin belirleyeceğin isimde ve senin yöneteceğin bir kanal oluşturabilirsin.
Ayrıca bu kanala istediklerin girebilir, istemediklerini odaya almayabilirsin.
         
Belki odanı gizli yaparak devlet sırlarını konuşabilir,
Ya da herkese açık yaparak halka seslenebilirsin.
         
Aşağıda bulunan "Özel Oda Oluştur" düğmesine basarak oluşturabilirsiniz, iyi sohbetler dilerim.`
         ,
         components:[
          new ActionRowBuilder()
          .setComponents(
            new ButtonBuilder().setCustomId("created").setLabel("Özel Oda Oluştur").setStyle(ButtonStyle.Success),
          ),
         ]
        }) 


   },

  };

  async function emojiFind(name){
const guild = await client.guilds.cache.get(System.ServerID);
const emoji = await guild.emojis.cache.find(x=> x.name === name);
if(emoji) return emoji.id
else console.log(name+ "İsimli emoji Bulunamadı!")
  }




