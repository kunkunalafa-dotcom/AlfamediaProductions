require('dotenv').config();
const { Telegraf, session } = require('telegraf');
const OpenAI = require('openai');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const botUsername = process.env.BOT_USERNAME;
const SIX_HOURS = 6 * 60 * 60 * 1000;

// Semua link resmi Kun Alfa
const links = {
  musicOfficial: 'https://www.youtube.com/@Kun-Alfa',
  kunAlfaTopic: 'https://www.youtube.com/channel/UCfDi1Tm4C3L8R9BfvqiSnLg',
  spotify: 'https://open.spotify.com/playlist/...',
  tasawufBudaya: 'https://www.youtube.com/@kunalfa',
  syariatIslam: 'https://www.youtube.com/@IslamAswaja',
  tiktok: 'https://www.tiktok.com/@kun.alfa',
  instagram: 'https://www.instagram.com/kunalfa8/',
  facebook: 'https://www.facebook.com/people/Kun-Alfa/61583494059856/',
  donasi: 'https://lynk.id/gudangragam/7w2wzxynopv4/checkout',
  komunitasTG: 'https://t.me/Music_positif'
};

// Panel Cyber-Neon (ketika tombol utama ditekan)
const cyberPanel = [
  [
    { text: 'Music', url: links.musicOfficial },
    { text: 'Topic', url: links.kunAlfaTopic },
    { text: 'Spotify', url: links.spotify }
  ],
  [
    { text: 'Sufi', url: links.tasawufBudaya },
    { text: 'Aswaja', url: links.syariatIslam },
    { text: 'FB', url: links.facebook }
  ],
  [
    { text: 'TikTok', url: links.tiktok },
    { text: 'IG', url: links.instagram },
    { text: 'Komunitas TG', url: links.komunitasTG }
  ],
  [
    { text: 'Donasi', url: links.donasi },
    { text: 'About', callback_data: 'about' }
  ],
  [
    { text: 'Share TG', url: `https://t.me/share/url?url=https://t.me/${botUsername}` },
    { text: 'WA', url: `https://wa.me/?text=Coba%20https://t.me/${botUsername}` },
    { text: 'FB', url: `https://www.facebook.com/sharer/sharer.php?u=https://t.me/${botUsername}` }
  ],
  [
    { text: 'X/Twitter', url: `https://twitter.com/intent/tweet?text=Coba%20bot%20ini%20https://t.me/${botUsername}` }
  ]
];

// Tombol collapse (Cyber-Neon Mode)
const collapsedButton = {
  inline_keyboard: [
    [{ text: '📂 Panel Kun Alfa — Neon Mode', callback_data: 'open_panel' }]
  ]
};

// Handler AI
async function handleAI(ctx) {
  const userMessage = ctx.message.text;

  try {
    const response = await openai.chat.completions.create({
      model: process.env.MODEL,
      messages: [
        { role: 'system', content: `
Kamu adalah asisten admin / Qodam Kun Alfa.
Bahasa gaul, humoris, sopan, kekinian.
Jawaban maksimal 300 token.
Fokus promosi channel, musik, tasawuf, motivasi.
Jika tidak ada link resmi: arahkan ke panel tombol.
        `},
        { role: 'user', content: userMessage }
      ],
      max_tokens: 300
    });

    let botReply = response.choices[0].message.content;
    botReply += `\n\n⚡ Panel lengkap ada di tombol "📂 Panel Kun Alfa — Neon Mode"`;

    await ctx.reply(botReply, { reply_markup: collapsedButton });
  } catch (e) {
    console.error(e);
    await ctx.reply(
      '⚡ AI lagi offline.\nKlik panel untuk akses semua link ya 🔥',
      { reply_markup: collapsedButton }
    );
  }
}

// Callback Panel
bot.on('callback_query', async (ctx) => {
  const data = ctx.callbackQuery.data;

  // buka panel
  if (data === 'open_panel') {
    await ctx.answerCbQuery();
    return ctx.reply('⚡ **Cyber-Neon Panel Kun Alfa** ⚡\nPilih menu:', {
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: cyberPanel }
    });
  }

  // About
  if (data === 'about') {
    await ctx.answerCbQuery();
    return ctx.reply(
      `Bot resmi Kun Alfa ⚡\n` +
      `Aman, ringan, server hemat.\n` +
      `Gunakan dengan bijak 🙏`
    );
  }
});

// Start
bot.start(async (ctx) => {
  await ctx.reply(
    'Selamat datang ⚡\nKlik tombol untuk membuka panel neon:',
    { reply_markup: collapsedButton }
  );
});

// Event pesan
bot.on('text', async (ctx) => {
  if (!ctx.session) ctx.session = {};
  const now = Date.now();
  const lastSeen = ctx.session.lastSeen || 0;

  if (!ctx.session.started || now - lastSeen > SIX_HOURS) {
    ctx.session.started = true;
    ctx.session.lastSeen = now;

    await ctx.reply(
      'Selamat datang kembali ⚡\nKlik tombol panel di bawah:',
      { reply_markup: collapsedButton }
    );
  } else {
    ctx.session.lastSeen = now;
    await handleAI(ctx);
  }
});

bot.launch();
console.log('Cyber-Neon Kun Alfa Bot aktif!');

const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => res.send('Cyber-Neon kunalfa_bot aktif ⚡'));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
