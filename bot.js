require('dotenv').config();
const http = require('http');
const TelegramBot = require('node-telegram-bot-api');
const { BOT_TOKEN, CHANNEL_ID } = require('./config');
const db = require('./database');
const { registerHandlers } = require('./handlers');

// Bepul hosting (Render/Koyeb va hokazo) botning "tirikligini" HTTP port orqali
// tekshiradi. Bu kichik server shu tekshiruvga javob beradi — bot xato deb
// qayta ishga tushirilmaydi. Mahalliy (PC) ishga tushirishga ta'sir qilmaydi.
const PORT = process.env.PORT || 8080;
http
  .createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
  })
  .listen(PORT, () => {
    console.log(`💚 Health server: http://0.0.0.0:${PORT}`);
  });

(async () => {
  if (!BOT_TOKEN || BOT_TOKEN.includes('your_token_here')) {
    console.error('❌ BOT_TOKEN noto\'g\'ri! .env faylida o\'z tokeningizni yozing.');
    process.exit(1);
  }

  db.load();

  const bot = new TelegramBot(BOT_TOKEN, { polling: true });

  // Komandalar ro'yxatini o'rnatish
  try {
    await bot.setMyCommands([
      { command: 'start', description: 'Botni boshlash / language' },
      { command: 'help', description: 'Yordam / Help' },
      { command: 'admin', description: 'Admin panel (faqat admin)' },
      { command: 'stats', description: 'Statistika (faqat admin)' },
    ]);
  } catch (_) {}

  registerHandlers(bot);

  const me = await bot.getMe();
  console.log(`✅ Bot ishga tushdi: @${me.username}`);

  if (CHANNEL_ID) {
    try {
      const chat = await bot.getChat(CHANNEL_ID);
      console.log(`📢 Kanal ulangan: ${chat.title} (id=${CHANNEL_ID})`);
    } catch (e) {
      console.warn(`⚠️ Kanaldan ma'lumot olishda xatolik: ${e.message}`);
      console.warn('   Ishga tushirishdan oldin botni kanalga ADMIN qilib qo\'shing (pastdan: Channels > Add > {bot}).');
      console.warn('   Kanal id sini @userinfobot dan bilib olishingiz mumkin.');
    }
  }

  process.on('SIGINT', () => {
    console.log('\n🛑 Bot to\'xtatildi');
    process.exit(0);
  });
})();