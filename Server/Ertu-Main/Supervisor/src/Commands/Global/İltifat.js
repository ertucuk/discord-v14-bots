const { ApplicationCommandOptionType,ActionRowBuilder,ButtonBuilder,ButtonStyle ,PermissionsBitField} = require("discord.js");
const kanal = require("../../../../../../Global/Settings/AyarName");

module.exports = {
    name: "iltifat",
    description: "Kullanıcıya iltifat edersiniz.",
    category: "USER",
    cooldown: 0,
    command: {
      enabled: true,
      aliases: [],
      usage: ".iltifat",
    },
  

    onLoad: function (client) { },

    onCommand: async function (client, message, args) {

let kanallar = kanal.KomutKullanımKanalİsim;
if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 

let iltifatlar = [
    "Mucizelerden bahsediyordum. Tam o sırada gözlerin geldi aklıma.",
    "Benim için mutluluğun tanımı, seninle birlikteyken geçirdiğim vakittir.",
    "Mavi gözlerin, gökyüzü oldu dünyamın.",
    "Seni gören kelebekler, narinliğin karşısında mest olur.",
    "Parlayan gözlerin ile karanlık gecelerime ay gibi doğuyorsun.",
    "Sabah olmuş. Sen mi uyandın yoksa gönlüme güneş mi doğdu.",
    "Huzur kokuyor geçtiğin her yer.",
    "En güzel manzaramsın benim, seyretmeye doyamadığım.",
    "Sen benim düşlerimin surete bürünmüş halisin.",
    "Bir sahil kasabasının huzuru birikmiş yüzüne.",
    "Gülüşünde nice ilaçlar var yarama merhem olan.",
    "Gece nasıl sabahı bekliyorsa aydınlanmak için ben de seni öyle bekliyorum.",
    "Işığınla gecemi aydınlatıyorsun.",
    "Yağmurdan sonra açan gök kuşağı gibisin, öyle güzel ve özel!",
    "Öyle bir duru güzelliğin var ki, seni gören şairler bile adına günlerce şiir yazardı.",
    "Gözlerinin hareketi bile yeter  benim aklımı başımdan almaya.",
    "Seni kelimeler ile anlatmak çok zor. Muhteşem desem yine eksik kalıyor anlamın.",
    "Güller bile kıskanır seni gördükleri zaman kendi güzelliklerini.",
    "Hiç yazılmamış bir şiirsin sen, daha önce eşi benzeri olmayan.",
    "Bu kadar muhteşem olamaz bir insan. Bu kadar kusursuz bu kadar mükemmel.. Kirpiklerinin dizilişi bile sırayla senin.",
    "Adım şaire çıktı civarda. Kimse senin şiir olduğunun farkında değil henüz.",
    "Senin güzelliğini anlatmaya dünyalar değil, lisanlar bile yetmez.",
    "Etkili gülüş kavramını ben senden öğrendim.",
    "Seni yanlışlıkla cennetten düşürmüşler. Dünyada yaşayan bir meleksin sen.",
    "Seni anlatmaya kelimeler bulamıyorum. Nasıl anlatacağımı bilemediğim için seni kimselere anlatamıyorum.",
    "Gözlerinin gördüğü her yer benimdir. Bakışına şahit olan her toprak benim de vatanımdır.",
    "Gözlerinle baharı getirdin garip gönlüme.",
    "Bir gülüşün ile çiçek açıyor bahçemdeki her bir çiçek.",
    "Yuva kokuyor kucağın. Sarılınca seninle yuva kurası geliyor insanın.",
    "Seni de bu dünyada görünce yaşama sebebimi anladım. Meğer senmişsin beni dünyada yaşamaya zorlayan.",
    "Sen bu  dünyadaki bütün şarkıların tek sahibisin. Sana yazılıyor bütün şarkılar ve şiirler. Adın geçiyor bütün namelerde.",
    "Sen benim yanımda olduğun sürece benim nerde olduğum hiç önemli değil .Kokunu aldığım her yer cennet bana.",
    "Seni yüreğimde taşıyorum ben, sırtımda taşımak ne kelime. Ömrüm boyunca çekmeye hazırım her anlamda senin yükünü.",
    "Hayatıma gelerek hayatımdaki bütün önemli şeylerin önemsiz olmasını sağladın. Artık sensin tek önem verdiğim şu hayatta.",
    "Sen benim bu hayattaki en büyük duamsın.  Gözlerin adeta bir ay parçası. Işık oluyorsun karanlık gecelerime.",
    "Aynı zaman diliminde yaşamak benim için büyük ödüldür.",
    "Seninle aşkı yaşamak çok güzel bir şey ama sensiz kalma korkusunu düşünmek korkutuyor beni.",
    "Seni severek meslek sahibi oldum ben. Seni sevmeye başladıkça şair oldum.",
    "Gülüşün güzelliğine anlam katıyor. Gamzelerin ise bambaşka diyarların kapılarını açıyor.",
    "Senin gülüşünü gördüğüm günden beri ağlamalarımı unuttum.",
    "Kimse konuşmasın yalnız sen konuş bana. Yalnız sen bak gözlerimin içine. Kimse olmasın yalnızca sen ol benim hayatımda.",
    "Ben seninle birlikte yaşayabilmek için ikinci kere geldim hayata.",
    "Senin attığın adımlarda seni korumak için geçtiğin yol olmak isterdim. Seni emniyete alan ve sonsuz bir yolculuğa çıkaran bir yol.",
    "Aklıma sevmek geldiğinde, gözlerimin önüne sen geliyorsun. Günün her saati canım sevmek istiyor ve seni düşünüyor kalbim",
  ];
const member = await message.mentions.members.first() ||await message.guild.members.cache.get(args[0]) || await message.member
if(member){
   await message.delete()
message.channel.send({content:`${member}, ${iltifatlar[Math.floor(Math.random() * iltifatlar.length)]}`})
}



     },

  };