# AquaRunnel: Akıllı Tarım ve Ödül Platformu

![AquaRunnel Logo](https://your-logo-link.com/logo.png)

---

## 🚀 Proje Hakkında

**AquaRunnel**, sürdürülebilir tarım uygulamalarını teşvik eden ve çiftçileri ödüllendiren bir Web3 tabanlı platformdur. Kullanıcılar;
- Gerçek zamanlı hava durumu verisiyle **akıllı tarım** aksiyonlarını planlar,
- Doğru zamanda ekim/gübreleme/sulama yaparak **AquaToken** kazanır,
- Cüzdanlarını bağlayıp ödüllerini dijital olarak alır,
- İsterlerse tokenlarını başka bir çiftçiye “destek ol” seçeneğiyle transfer edebilir.

## 🎯 Amacımız

- Tarımda verimlilik ve bilinçli hareketi teşvik etmek,
- Çiftçilerin blockchain teknolojisine erişimini kolaylaştırmak,
- Topluluk içi destek ve dayanışmayı artırmak.

---

## 🛠️ Teknolojiler

- **Frontend**: Next.js (TypeScript), Tailwind CSS, Shadcn/UI, Lucide Icons
- **Backend**: Node.js (Express)
- **Web3**: Stellar + Soroban akıllı kontrat
- **Cüzdan**: Freighter eklentisi ile bağlantı
- **Gerçek zamanlı veri**: OpenWeatherMap API (hava durumu)
- **Diğer**: GitHub Actions, Docker (isteğe bağlı)

---

## 📂 Proje Dosya Yapısı


rustdevelop/
├── backend/               # ExpressJS - API ve blockchain entegrasyonu
│   ├── index.js
│   ├── mint-soroban.js
│   └── …
├── frontend/              # Next.js - Kullanıcı arayüzü
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── …
├── stellar-contract/      # Soroban akıllı kontrat kaynak kodları (opsiyonel)
│   └── …
└── README.md




---

## 🚦 Kurulum & Çalıştırma

### 1. **Repo’yu Klonla**

```bash
git clone https://github.com/suarksoft/rustdevelop.git
cd rustdevelop




## Backend’i Başlat

cd backend
npm install
cp .env.example .env      # Gerekirse .env ayarlarını yap
node index.js             # veya: nodemon start




##   .env dosyan için örnek:

ADMIN_SECRET=...
CONTRACT_ID=...
SOROBAN_RPC_URL=https://soroban-testnet.stellar.org:443
SOROBAN_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
ADMIN_ALIAS=admin

## Frontend’i Başlat
cd ../frontend
npm install
npm run dev
	•	Uygulama varsayılan olarak http://localhost:3000 adresinde çalışır.

🌦️ API Anahtarı ve Gerçek/Hayali (Mock) Veri Kullanımı

Gerçek Hava Durumu Verisiyle Çalışmak İçin
	1.	OpenWeatherMap sitesinden ücretsiz bir API anahtarı alın.
	2.	Proje kök dizininde (frontend klasöründe) .env.local dosyası oluşturun (veya var ise güncelleyin).
	3.	İçine şu satırı ekleyin:    NEXT_PUBLIC_OPENWEATHER_API_KEY=a94...(Not: Kendi OpenWeather API anahtarınızı kullanmanız önerilir.)

Mock (Test) Veri Kullanmak İçin

Gerçek API kullanmak istemiyorsanız veya test için hazır veriyle çalışmak istiyorsanız:
	1.	frontend/src/lib/config.js dosyasını açın.
	2.	Aşağıdaki satırı bulun:
export const USE_MOCK = false
	3.	false değerini true yapın:
export const USE_MOCK = true
Böylece sistem, dışarıdan veri çekmeden demo/test ortamında çalışacaktır.




 




 Kullanıcı Akışı
	1.	Cüzdanını Bağla: Sağ üstten “Cüzdan Bağla”ya tıkla (Freighter cüzdanı ile).
	2.	Şehir Seç, Hava Durumunu İncele: Ana ekranda şehir ve hava verisi.
	3.	Tarım Aksiyonu Seç: (Gübreleme, Sulama, Ekim, Hasat) — doğru zamanda uygula!
	4.	Token Kazan: Eğer önerilen koşullarda aksiyon aldıysan, otomatik cüzdanına AquaToken aktarılır.
	5.	Çiftçiye Destek Ol: Token’larını başka bir çiftçiye transfer edebilirsin.
	6.	Geçmiş Aksiyonlar ve Token Bakiyeni Takip Et.






🧑‍💻 Geliştiriciler İçin Notlar
	•	Akıllı kontrat Stellar/Soroban tabanlıdır. CLI ile mint/transfer yapılır.
	•	Cüzdan bağlantısı için Freighter Chrome/Brave eklentisi gereklidir.
	•	Hava durumu Open-Meteo’dan çekilir, offline çalışmaz.
	•	Demo cüzdan adresleri ve test tokenları için docs klasöründe örnekler var (ekleyebilirsiniz).




👥 Ekip ve Katkıda Bulunanlar
	•	Ahmet Buğra Kurnaz (Full Stack Developer)



## 📞 İletişim & Destek

Her türlü öneri ve destek için:

- [LinkedIn](https://www.linkedin.com/in/bu%C4%9Fra-kurnaz-692918301/)
- [E-posta](mailto:dev.bugrakurnaz@gmail.com)



