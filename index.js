require('dotenv').config();
const { Telegraf, session } = require('telegraf');
const OpenAI = require('openai');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session());

let openai;
try {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
} catch (err) {
  console.warn('⚡ OpenAI API tidak aktif / key hilang.');
}

const botUsername = process.env.BOT_USERNAME || 'kunalfabot';
const SIX_HOURS = 6 * 60 * 60 * 1000;

// Link resmi Kun Alfa dan akun lain bisa ditambahkan di sini
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

// Cyber-Neon Panel
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

// Tombol collapse
const collapsedButton = {
  inline_keyboard: [
    [{ text: '📂 Panel Kun Alfa — Neon Mode', callback_data: 'open_panel' }]
  ]
};

// Handler AI aman (catch error jika API offline)
async function handleAI(ctx) {
  if (!openai) {
    return ctx.reply(
      '⚡ AI lagi offline.\nKlik panel untuk akses semua link ya 🔥',
      { reply_markup: collapsedButton }
    );
  }

  const userMessage = ctx.message.text;

  try {
    const response = await openai.chat.completions.create({
      model: process.env.MODEL || 'gpt-5-mini',
      messages: [
        { role: 'system', content: `Kamu adalah asisten admin / Qodam Kun Alfa.` },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 300
    });

    let botReply = response.choices[0].message.content;
    botReply += `\n\n⚡ Panel lengkap ada di tombol "📂 Panel Kun Alfa — Neon Mode"`;

    await ctx.reply(botReply, { reply_markup: collapsedButton });
  } catch (e) {
    console.error('OpenAI error:', e);
    await ctx.reply(
      '⚡ AI tidak dapat merespons.\nGunakan tombol panel untuk akses semua link 🔥',
      { reply_markup: collapsedButton }
    );
  }
}

// Callback Panel
bot.on('callback_query', async (ctx) => {
  const data = ctx.callbackQuery.data;

  if (data === 'open_panel') {
    await ctx.answerCbQuery();
    return ctx.reply('⚡ **Cyber-Neon Panel Kun Alfa** ⚡\nPilih menu:', {
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: cyberPanel }
    });
  }

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

// Launch
bot.launch();
console.log('⚡ Cyber-Neon Kun Alfa Bot aktif! (AI optional)');
