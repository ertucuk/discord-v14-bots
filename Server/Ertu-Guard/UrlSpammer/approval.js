const fetch = require('node-fetch');
const { Client } = require('discord.js-selfbot-v13');
const Guild = require("../../../Global/Settings/System.js")
const client = new Client({ checkUpdate: false });
const {exec} = require("child_process");
const { EmbedBuilder } = require('discord.js');
const Guard = require('.././Schemas/Guard');
const mongoose = require('mongoose');

mongoose.connect(Guild.MongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
let token = Guild.Security.SelfBotToken
let code = Guild.ServerURL
client.login(token).then(a=>{
    const log = client.channels.cache.get(Guild.Security.UrlSpammer)
client.on('ready', async () => {
    console.log("URL-Spammer İs Ready");
    const guild = client.guilds.cache.get(Guild.ServerID);
    let status = 0,
 lastrate = 0;
    const url = setInterval(async () => {
if (status !== 0) return;
 
const urlControl = await check(Guild.ServerID, Guild.Security.SelfBotToken);
if (urlControl.code === code) {
log.send({content:`\`[${time()}]\` İstenilen URL olan \`${code}\` ile şu anda sunucuda bulunan URL aynı. Bot durduruluyor.`});
await Guard.findOneAndUpdate({guildID:guild.id},{$set:{UrlSpammer:false}},{upsert:true})

   exec('pm2 stop ../UrlSpammer/approval.js', (error, stdout, stderr) => {});
}
 
if (!urlControl.error) {
const changeControl = await change(Guild.Guild.ID, Guild.Guild.vanityURL, Guild.Guild.Bots.selfToken);
if (!changeControl.error) {
  log.send({content:`\`[${time()}]\` Başarı: URL başarılı bir şekilde ${code} olarak değiştirildi.
  
Detaylar:
- Değiştirilen URL: ${code}
- Durum: Değiştirildi
- İşlem: Bot durduruluyor`});
await Guard.findOneAndUpdate({guildID:guild.id},{$set:{UrlSpammer:false}},{upsert:true})

exec('pm2 stop ../UrlSpammer/approval.js', (error, stdout, stderr) => {});
} else {
if (changeControl.reason === 0) {
log.send({content:`\`[${time()}]\` Hata: URL denerken rate limite yakalandık, bekliyoruz.
  
Detaylar:
- Retry Süresi: ${changeControl.retry.toFixed(0)} saniye
- Durum: Beklemede
- İşlem: Rate limit süresi dolana kadar bekleniyor`});
status = 1;
lastrate = changeControl.retry;
setTimeout(() => { status = 0 }, lastrate > 200 ? (1000 * lastrate) / 5 : 1000 * lastrate);
}
 
if (changeControl.reason === 1) {
log.send({content:`\`[${time()}]\` Hata: ${code} adlı URL müsait değil. Tekrar denenecek.
  
Detaylar:
- URL: ${code}
- Durum: Müsait değil
- İşlem: Tekrar denenecek`});
  }
   }
 } else {
log.send({content:`\`[${time()}]\` Hata: ${code} adlı URL müsait, ancak değiştirilemedi. Bot durduruluyor.
Lütfen manuel olarak kontrol yapın veya URL'yi değiştirin.

Detaylar:
- URL: ${code}
- Durum: Müsait
- İşlem: Değiştirilemedi
- Aksiyon: Manuel kontrol veya değiştirme gerekiyor`});
await Guard.findOneAndUpdate({guildID:guild.id},{$set:{UrlSpammer:false}},{upsert:true})

   exec('pm2 stop ../UrlSpammer/approval.js', (error, stdout, stderr) => {});
 
   }
    }, 1000 * 15);
});

    client.on('messageCreate', async (message) => {  
   const guild = client.guilds.cache.get(Guild.ServerID);
    if([...Guild.BotsOwners, guild.ownerId].some(z=> z != message.author.id)) return;
    console.log(message)

   if (message.content === '.urldurum') {
const url = message.content.slice(10).trim();
if (!url) return;
 
try {
  const result = await checkUrlStatus(url);
  const embed = createUrlStatusEmbed(url, result);
  message.channel.send({ embeds: [embed] });
} catch (error) {
  console.error(error);
  message.channel.send(`Hata oluştu: ${error.message}`);
}
   }
 });

})
    
async function change(id, url, token) {
    const config = {
 url: `https://discord.com/api/v9/guilds/${id}/vanity-url`,
 body: {
   code: `${url}`
 },
 method: 'PATCH',
 headers: {
   "Accept": "*/*",
   "Content-Type": "application/json",
   "Authorization": `${token}`
 }
    };
  
    try {
 const req = await fetch(config.url, { method: config.method, headers: config.headers, body: JSON.stringify(config.body) });
 const data = await req.json();
  
 if (data.message.includes("rate")) return { error: true, reason: 0, retry: data.retry_after }; // reason 0: rate limit
 if (data.message.includes("taken") || data.code === 50020) return { error: true, reason: 1 }; // reason 1: taken
 return true;
    } catch (err) {
 return { error: 1, msg: err.message, stack: err };
    }
  }
  async function check(id, token) {
    const config = {
 url: `https://discord.com/api/v9/guilds/${id}/vanity-url`,
 method: 'GET',
 headers: {
   "Accept": "*/*",
   "Content-Type": "application/json",
   "Authorization": `${token}`
 }
    };
  
    try {
 const req = await fetch(config.url, { method: config.method, headers: config.headers });
 const data = await req.json();
  
 return data;
    } catch (err) {
 return { error: 1, msg: err.message, stack: err };
    }
  }
  

  function time() {
    const date = new Date();
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');
  
    return `${hour}:${minute}:${second}`;
  }

  
  async function checkUrlStatus(url) {
    const guild = client.guilds.cache.get(Guild.Guild.ID);
    const vanityURL = await guild.fetchVanityData();
  
    if (!vanityURL) {
 throw new Error('Sunucunun vanity URL bilgileri alınamadı.');
    }
  
    if (vanityURL.code !== url) {
 throw new Error('Belirtilen URL, sunucunun mevcut vanity URL\'si ile uyuşmuyor.');
    }
  
    const config = {
 url: `https://discord.com/api/v9/guilds/${guild.id}/vanity-url`,
 method: 'GET',
 headers: {
   'Accept': 'application/json',
   'Authorization': `Bot ${token}`
 }
    };
  
    const response = await fetch(config.url, { method: config.method, headers: config.headers });
    const data = await response.json();
  
    if (response.ok) {
 return {
   rateLimited: false,
   message: 'URL\'nin durumu başarıyla kontrol edildi.',
   data: data
 };
    } else {
 throw new Error(`URL'nin durumu kontrol edilemedi. Hata kodu: ${response.status}, Hata mesajı: ${data.message}`);
    }
  }
  
  function createUrlStatusEmbed(url, result) {
    const embed = new EmbedBuilder()
 .setTitle('URL Durumu')
 .setColor(result.rateLimited ? 'Red' : 'Geen')
 .setDescription(`**URL:** ${url}`)
 .setFields(
{name:'Durum', value: result.rateLimited ? 'Rate Limit' : 'Aktif'},
{name:'Mesaj', value:result.message},
 )
  
    if (result.rateLimited) {
 const retryAfter = result.data.retry_after || 'Bilinmiyor';
 embed.addFields({name:'Rate Limit Süresi', value:`${retryAfter} saniye`});
    }
  
    return embed;
  }
  