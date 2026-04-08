require('dotenv').config();
const { Telegraf, session } = require('telegraf');
const express = require('express');

// ===== DEBUG LOG =====
console.log("🚀 STARTING APP...");
console.log("TOKEN:", process.env.BOT_TOKEN ? "ADA" : "TIDAK ADA");

// ===== PROTECT TOKEN =====
if (!process.env.BOT_TOKEN) {
  console.error("❌ BOT_TOKEN tidak ditemukan! Bot tidak dijalankan.");
}

// ===== EXPRESS SERVER (WAJIB KOYEB) =====
const app = express();
const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send('Bot is running 🚀');
});

app.listen(PORT, () => {
  console.log('🌐 Server aktif di port ' + PORT);
});

// ===== INIT BOT =====
let bot;

if (process.env.BOT_TOKEN) {
  bot = new Telegraf(process.env.BOT_TOKEN);
  bot.use(session());

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
      { text: 'WA', url: `https://wa.me/?text=Coba%20https://t.me/${botUsername}` }
    ]
  ];

  const collapsedButton = {
    inline_keyboard: [
      [{ text: '📂 Panel Kun Alfa — Neon Mode', callback_data: 'open_panel' }]
    ]
  };

  // ===== CALLBACK =====
  bot.on('callback_query', async (ctx) => {
    const data = ctx.callbackQuery.data;

    if (data === 'open_panel') {
      await ctx.answerCbQuery();
      return ctx.reply('⚡ Cyber-Neon Panel Kun Alfa ⚡\nPilih menu:', {
        reply_markup: { inline_keyboard: cyberPanel }
      });
    }

    if (data === 'about') {
      await ctx.answerCbQuery();
      return ctx.reply(
        '⚡ Kun Alfa Bot\nAlfa Media Productions\nAkses semua link dari panel 🙌'
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
        'Selamat datang kembali ⚡\nKlik panel di bawah:',
        { reply_markup: collapsedButton }
      );
    } else {
      ctx.session.lastSeen = now;

      await ctx.reply(
        '⚡ Gunakan tombol panel untuk akses semua link ya 🔥',
        { reply_markup: collapsedButton }
      );
    }
  });

  // ===== START BOT (DELAY BIAR KOYEB STABIL) =====
  setTimeout(() => {
    bot.launch()
      .then(() => console.log('🤖 Bot aktif (stable)'))
      .catch(err => console.error('❌ Bot error:', err));
  }, 3000);

  // ===== SAFE EXIT =====
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

// ===== GLOBAL ERROR HANDLER =====
process.on('uncaughtException', (err) => {
  console.error('🔥 Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('🔥 Unhandled Rejection:', err);
});
