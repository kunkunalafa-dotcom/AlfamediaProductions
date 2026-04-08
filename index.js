require('dotenv').config();
const { Telegraf } = require('telegraf');
const express = require('express');

// ===== EXPRESS =====
const app = express();
const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send('Bot is running 🚀');
});

app.listen(PORT, () => {
  console.log('Server jalan di port ' + PORT);
});

// ===== BOT =====
const bot = new Telegraf(process.env.BOT_TOKEN);

// ===== START =====
bot.start((ctx) => {
  ctx.reply('Selamat datang! Klik tombol:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'YouTube', url: 'https://youtube.com' }]
      ]
    }
  });
});

// ===== TEXT =====
bot.on('text', (ctx) => {
  ctx.reply('⚡ Gunakan tombol menu ya!');
});

// ===== LAUNCH =====
setTimeout(() => {
  bot.launch()
    .then(() => console.log('Bot aktif'))
    .catch(err => console.error(err));
}, 3000);

// ===== SAFE EXIT =====
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
