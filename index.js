require('dotenv').config();
const { Telegraf } = require('telegraf');
const OpenAI = require('openai');

const bot = new Telegraf(process.env.BOT_TOKEN);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: userMessage }]
  });

  ctx.reply(response.choices[0].message.content);
});

bot.launch();
console.log('Bot Telegram Basic siap jalan!');
