module.exports = {
    Server: "", //sunucu ismi
    ServerID: "", // sunucu id
    ServerURL: "", // sunucu özel url
    SubTitle: "", // embed alt başlık
    BotVoiceChannel: "", // botlarin gireceği ses
    MongoURL: "", // mongo url
    WebhookURL: "", // belirttiğiniz webhook kanala hatalari gönderir 
    BackGround: "https://cdn.discordapp.com/attachments/1121409922328956928/1121778487355772998/576388f3bdfea3f99ef4282c518f316b.png", // burayi silme
    BotsOwners: ["587564522009788426","136619876407050240","797096076330795018"], // bot ownerlar

    Presence: {
        Status: "online", // durumu idle -dnd - online 
        Type: "STREAMING", // PLAYING - WATCHING - STREAMING
        Message: ["Ertu was here ❤️", "Ertu ❤️ V14 "],  // DURUMDAKİ MESAJ
    },

    Mainframe: {
    Moderation: "", // süpervisor token
    Statistics:  "", // stat botu token
    Registery: "", // register bot token

    EmojiNumbers: false,
    GlobalInteractions: true,
    dmMessages: true,
  
    messageDolar: 1,
    voiceDolar: 1,
  
    messageCount: 1,
    messageCoin: 2,
    voiceCount: 1,
    voiceCoin: 4,
    publicCoin: 4,
    inviteCount: 1,
    inviteCoin: 15,
    taggedCoin: 25,
    toplamsCoin: 5.5,
    yetkiCoin: 30,
  
    banlimit: 3,
    jaillimit: 3,
    warnlimit: 3,
    chatmutelimit: 3,
    voicemutelimit: 3,

        Prefixs: [
            ".",
            "+",
            "!",
            "/",
            "-",
            "?",
            "="
        ],
    },

    Security: {
        Guard_I: "", //guard 1 token
        Guard_II: "", // guard 2 token
        Guard_III: "", //guard 3 token
        SelfBotToken: "31", // self token giriniz girmicem diosaniz sayi kalsin
        Prefix: ".",

        Database: [
            "", // dağıtıci bot token 1 tane giriniz
        ],
    },

    Welcome: {
        Tokens: [ 
            "", // welcome bot tokenleri
            "",
            "",
            ""
      
          ],

        Channels: [ 
          "", 
          "", 
          "", 
          ""
      
          ],

          Staff: "", // kayit yetkilisi id
    }
} 
