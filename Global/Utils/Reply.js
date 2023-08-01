class MsgReply {
    static replyFetch() {       
         const cevaplar = global.cevaplar = {
            noyt:          "**Hata : **`Bu komutunu kullanabilmek için yeterli yetkilere sahip değilsin.`",
            üye:           "Hata: `Üye belirtilmedi` Lütfen bir üye etiketleyin veya ID giriniz! __Örn:__",
            süre:          "Hata: `Süre belirtilmedi` Lütfen bir süre belirleyin!  __Örn:__ ",
            bot:           `Hata: Belirtilen kullanıcı bot olduğu için işlem iptal edildi.`,
            sebep:         "Hata: `Sebep belirtilmedi` Sebep yazmalısın veya geçerli bir sebep girmelisin!",
            yetkiust:      "Hata: `Yetki Üstünlüğü` İşlem yapmaya çalıştığın üye senle aynı yetkide veya senden üstün!",
            dokunulmaz:    "Hata: `Yönetim/Erişim` Yetersiz bot yetkisi nedeniyle iptal edildi.",
            kayıtlı:       "Hata: `Kayıtlı Üye` Belirlediğiniz üye sunucuda zaten kayıtlı ne için tekrardan kayıt ediyorsun?",
            kayıtsız:      "Hata: `Kayıtsız Üye` Belirlediğiniz üye sunucuda zaten kayıtsız ne için tekrardan kayıtsıza atmaya çalışıyorsun?",
            kendi:         "Hata: `Aynı Üye` Lütfen Kendi üzerine işlem uygulamaya çalışma!",
            bulunamadi:    "Hata: `ID bulunamadı` Lütfen bir üye __ID__ numarası giriniz!",
            üyeyok:        "Hata: `Üye bulunamadı` Lütfen bir üye etiketleyin veya ID giriniz!",
            yenihesap:     "Hata: `Yeni Hesap` Belirtilen üyeye kayıt işlemi yapılamadı.",
            cezaliuye:     "Hata: Belirttiğin üye `Cezalı` olarak işaretlendiği için kayıt işlemi yapılamadı.",
            yetersizyaş:   `Hata: \`Yaş Sınırı (${global.ayarlar.minYaş})\` Belirtilen üyenin yaşı, yaş sınırının altında olduğu için isim işlemi yapılamadı.`,
            argümandoldur: "Hata: `Argüman doldurulmadı` Lütfen tüm argümanları doldurunuz!  __Örn:__",
            taglıalım:     `Hata: \`Taglı Alım\` Belirtilen üyenin isminde \`${global.ayarlar.tag}\` bulunmadığından dolayı kayıt işlemi yapılamadı.`,
            isimapi:       `Hata: \`İsim Hatası (32 Karakter)\` İsim karakteri fazla olduğundan dolayı işlem yapılamadı.`,
            cezavar:       `Hata: \`Aktif Ceza\` zaten bu kişinin aktif cezalandırması var.`,
            cezayok:       "Hata: `Aktif Ceza` bu kişinin aktif cezalandırması bulunamadı.",
            yetkilinoban:  "Hata: `Yetkili` Bu kişi yetkili olduğu için yasaklayamazsın.",
            yasaklamayok:  `Hata: \`Yasaklama Yok\` Sunucu da hiç yasaklama bulunamadı.`,
            notSetup:      `Hata: Lütfen kullanılan \`Komut\` ayarlarını tamamlayın.`,
            bokyolu:       `Hata: \`Limit Doldu\` Kullanım hakkınız dolduğu için işleminiz iptal edildi.` //wc lafügüsex hatırası
        }
    }
}
module.exports = MsgReply;