require('dotenv').config();
const { Telegraf } = require('telegraf');
const OpenAI = require('openai');
const express = require('express');

// ===== EXPRESS (BIAR KOYEB TIDAK UNHEALTHY) =====
const app = express();
const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send('Bot is running 🚀');
});

app.listen(PORT, () => {
  console.log('Server jalan di port ' + PORT);
});

// ===== BOT =====


// ===== START =====
bot.start((ctx) => {
  ctx.reply('Selamat datang! Pilih channel YouTube favoritmu:', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Channel A', url: 'https://youtube.com/channelA' },
          { text: 'Channel B', url: 'https://youtube.com/channelB' }
        ],
        [{ text: 'Channel C', url: 'https://youtube.com/channelC' }]
      ]
    }
  });
});

// ===== AI CHAT =====
bot.on('text', async (ctx) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: ctx.message.text }]
    });

    ctx.reply(response.choices[0].message.content);
  } catch (err) {
    console.error(err);
    ctx.reply('Error, coba lagi nanti');
  }
});

// ===== START BOT (DELAY BIAR STABIL) =====
setTimeout(() => {
  bot.launch()
    .then(() => console.log('Bot aktif'))
    .catch(err => console.error(err));
}, 3000);
