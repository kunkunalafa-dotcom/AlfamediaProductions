require('dotenv').config();
const { Telegraf, session } = require('telegraf');
const OpenAI = require('openai');
const express = require('express');

// ===== INIT =====
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session());

let openai;
try {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
} catch (err) {
  console.warn('⚡ OpenAI tidak aktif');
}

const botUsername = process.env.BOT_USERNAME || 'kunalfabot';
const SIX_HOURS = 6 * 60 * 60 * 1000;

// ===== LINK =====
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

// ===== PANEL =====
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

const collapsedButton = {
  inline_keyboard: [
    [{ text: '📂 Panel Kun Alfa — Neon Mode', callback_data: 'open_panel' }]
  ]
};

// ===== AI HANDLER =====
async function handleAI(ctx) {
  if (!openai) {
    return ctx.reply(
      '⚡ AI offline.\nKlik panel untuk akses link 🔥',
      { reply_markup: collapsedButton }
    );
  }

  try {
    const response = await openai.chat.completions.create({
      model: process.env.MODEL || 'gpt-5-mini',
      messages: [
        { role: 'system', content: 'Kamu asisten Kun Alfa.' },
        { role: 'user', content: ctx.message.text }
      ],
      max_tokens: 200
    });

    let reply = response.choices[0].message.content;
    reply += '\n\n⚡ Gunakan tombol panel untuk akses semua link';

    await ctx.reply(reply, { reply_markup: collapsedButton });

  } catch (err) {
    console.error('AI error:', err);
    await ctx.reply(
      '⚡ AI tidak tersedia.\nGunakan tombol panel ya 🔥',
      { reply_markup: collapsedButton }
    );
  }
}

// ===== CALLBACK =====
bot.on('callback_query', async (ctx) => {
  const data = ctx.callbackQuery.data;

  if (data === 'open_panel') {
    await ctx.answerCbQuery();
    return ctx.reply('⚡ Cyber-Neon Panel Kun Alfa ⚡', {
      reply_markup: { inline_keyboard: cyberPanel }
    });
  }

  if (data === 'about') {
    await ctx.answerCbQuery();
    return ctx.reply(
      'Bot resmi Kun Alfa ⚡\nAman & ringan.\nAlfa Media Productions'
    );
  }
});

// ===== START =====
bot.start((ctx) => {
  ctx.reply(
    'Selamat datang ⚡\nKlik tombol untuk buka panel:',
    { reply_markup: collapsedButton }
  );
});

// ===== TEXT =====
bot.on('text', async (ctx) => {
  if (!ctx.session) ctx.session = {};
  const now = Date.now();
  const lastSeen = ctx.session.lastSeen || 0;

  if (!ctx.session.started || now - lastSeen > SIX_HOURS) {
    ctx.session.started = true;
    ctx.session.lastSeen = now;

    await ctx.reply(
      'Selamat datang kembali ⚡\nKlik panel:',
      { reply_markup: collapsedButton }
    );
  } else {
    ctx.session.lastSeen = now;
    await handleAI(ctx);
  }
});

// ===== WEB SERVER (WAJIB UNTUK KOYEB) =====
const app = express();

app.get('/', (req, res) => {
  res.send('Bot is running');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log('Web server aktif di port ' + PORT);
});

// ===== LAUNCH =====
bot.launch();
console.log('⚡ Bot aktif & stabil!');
