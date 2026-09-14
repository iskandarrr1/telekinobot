const { LANGS, t } = require('./languages');
const db = require('./database');
const { ADMIN_ID, MOVIE_PER_PAGE } = require('./config');

// Foydalanuvchi holatini saqlash (FSM)
// userId -> { awaiting: 'search'|'title'|'file'|'broadcast', title, listType, query, page }
const userState = new Map();

function isAdmin(userId) {
  return Number(userId) === Number(ADMIN_ID);
}

function stateOf(userId) {
  if (!userState.has(userId)) userState.set(userId, { awaiting: null, title: '', listType: null, query: '', page: 0 });
  return userState.get(userId);
}

// ---------- Klaviatura (tugmalar) ----------
const langKeyboard = {
  inline_keyboard: [
    [{ text: '🇺🇿 O\'zbekcha', callback_data: 'lang:uz' },
     { text: '🇷🇺 Русский', callback_data: 'lang:ru' },
     { text: '🇬🇧 English', callback_data: 'lang:en' }],
  ],
};

function menuKeyboard(lang) {
  return {
    inline_keyboard: [
      [{ text: t(lang, 'search'), callback_data: 'menu:search' },
       { text: t(lang, 'latest'), callback_data: 'menu:latest' }],
      [{ text: t(lang, 'cod_btn'), callback_data: 'menu:code' },
       { text: t(lang, 'help'), callback_data: 'menu:help' }],
      [{ text: t(lang, 'choose_lang'), callback_data: 'menu:lang' }],
    ],
  };
}

function makeLabel(m) {
  let label = m.title;
  if (m.year) label += ` (${m.year})`;
  if (m.rating) label += ` ⭐${m.rating}`;
  return label;
}

function moviesKeyboard(lang, list, page) {
  const kb = [];
  const start = page * MOVIE_PER_PAGE;
  const end = start + MOVIE_PER_PAGE;
  for (const m of list.slice(start, end)) {
    kb.push([{ text: makeLabel(m), callback_data: `movie:${m.id}` }]);
  }
  const nav = [];
  if (start > 0) nav.push({ text: '⬅️', callback_data: 'page:prev' });
  if (end < list.length) nav.push({ text: '➡️', callback_data: 'page:next' });
  if (nav.length) kb.push(nav);
  kb.push([{ text: t(lang, 'back'), callback_data: 'menu:main' }]);
  return { inline_keyboard: kb };
}

function movieActionsKeyboard(lang, movieId) {
  return {
    inline_keyboard: [
      [{ text: t(lang, 'watch'), callback_data: `send:${movieId}` },
       { text: t(lang, 'download'), callback_data: `dload:${movieId}` }],
      [{ text: t(lang, 'back'), callback_data: 'menu:main' }],
    ],
  };
}

function adminKeyboard(lang) {
  return {
    inline_keyboard: [
      [{ text: '➕ Add Movie', callback_data: 'admin:add' }],
      [{ text: '📃 List Movies', callback_data: 'admin:list' }],
      [{ text: '📊 Stats', callback_data: 'admin:stats' }],
      [{ text: '📣 Broadcast', callback_data: 'admin:broadcast' }],
      [{ text: t(lang, 'back'), callback_data: 'menu:main' }],
    ],
  };
}

function movieInfo(lang, m) {
  return t(lang, 'movie_info', {
    title: m.title,
    year: m.year || '-',
    genre: m.genre || '-',
    rating: m.rating || '-',
  });
}

// ---------- Yordamchi ----------
async function sendMenu(bot, chatId, userId) {
  const lang = await db.getLang(userId);
  await bot.sendMessage(chatId, t(lang, 'main_menu'), { reply_markup: menuKeyboard(lang) });
}

function detectQuality(video) {
  const fn = (video || {}).file_name || '';
  if (fn.includes('1080')) return '1080p';
  if (fn.includes('720')) return '720p';
  if (fn.includes('480')) return '480p';
  if (fn.includes('360')) return '360p';
  return '';
}

function parseYear(text) {
  const m = String(text || '').match(/\b(19|20)\d{2}\b/);
  return m ? Number(m[0]) : null;
}

// Caption'dan kino kodini olish: "Kod: ABC123", "Code-ABC123", "#ABC123", "Код: ABC123"
function parseCode(text) {
  const s = String(text || '');
  let m = s.match(/(?:kod|kód|code|код)\s*[:=\-]?\s*([a-z0-9][a-z0-9-]{1,})/i);
  if (!m) m = s.match(/#([a-z0-9][a-z0-9-]{1,})/i);
  return m ? m[1].toUpperCase() : null;
}

// ---------- Registratsiya ----------
function registerHandlers(bot) {
  // /start
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const u = msg.from;
    if (msg.chat.type !== 'private') {
      await bot.sendMessage(chatId, t('uz', 'private_warning', { username: (await bot.getMe()).username }), { reply_to_message_id: msg.message_id });
      return;
    }
    await db.addUser(u.id, u.username, `${u.first_name || ''} ${u.last_name || ''}`.trim());
    const lang = await db.getLang(u.id);
    await bot.sendMessage(chatId, t(lang, 'start', { name: u.first_name || '' }), {
      reply_markup: langKeyboard,
    });
  });

  // /help
  bot.onText(/\/help/, async (msg) => {
    if (msg.chat.type !== 'private') return;
    const lang = await db.getLang(msg.from.id);
    await bot.sendMessage(msg.chat.id, t(lang, 'help_text'), { parse_mode: 'HTML' });
  });

  // /admin
  bot.onText(/\/admin/, async (msg) => {
    if (!isAdmin(msg.from.id)) return;
    const lang = await db.getLang(msg.from.id);
    await bot.sendMessage(msg.chat.id, t(lang, 'admin_help'), { reply_markup: adminKeyboard(lang) });
  });

  // /addmovie
  bot.onText(/\/addmovie/, async (msg) => {
    if (!isAdmin(msg.from.id)) return;
    const st = stateOf(msg.from.id);
    st.awaiting = 'title';
    await bot.sendMessage(msg.chat.id, t('uz', 'send_movie_name'));
  });

  // /listmovies
  bot.onText(/\/listmovies/, async (msg) => {
    if (!isAdmin(msg.from.id)) return;
    const list = db.getAllMovies();
    if (!list.length) return bot.sendMessage(msg.chat.id, t('uz', 'no_movies'));
    const text = list.map((m) => `${m.id}. ${m.title}${m.year ? ` (${m.year})` : ''}`).join('\n');
    await bot.sendMessage(msg.chat.id, `📃\n${text}`);
  });

  // /stats
  bot.onText(/\/stats/, async (msg) => {
    if (!isAdmin(msg.from.id)) return;
    const stats = {
      users: db.countUsers(),
      movies: db.countMovies(),
      searches: db.countSearches(),
    };
    const lang = await db.getLang(msg.from.id);
    await bot.sendMessage(msg.chat.id, t(lang, 'stats', stats), { reply_markup: adminKeyboard(lang) });
  });

  // /broadcast
  bot.onText(/\/broadcast/, async (msg) => {
    if (!isAdmin(msg.from.id)) return;
    const st = stateOf(msg.from.id);
    st.awaiting = 'broadcast';
    await bot.sendMessage(msg.chat.id, t('uz', 'send_broadcast'));
  });

  // ---------- Inline tugmalar ----------
  bot.on('callback_query', async (cb) => {
    const data = cb.data || '';
    const userId = cb.from.id;
    const chatId = cb.message ? cb.message.chat.id : userId;
    const lang = await db.getLang(userId);

    try { await bot.answerCallbackQuery(cb.id); } catch (_) {}

    const [prefix, value] = data.split(':');

    // Til tanlash
    if (prefix === 'lang') {
      const code = value;
      if (LANGS[code]) {
        await db.setLang(userId, code);
        const l2 = await db.getLang(userId);
        await bot.editMessageText(t(l2, 'lang_saved', { name: LANGS[code].name }), {
          chat_id: chatId,
          message_id: cb.message.message_id,
          reply_markup: menuKeyboard(l2),
        });
      }
      return;
    }

    // Menyu
    if (prefix === 'menu') {
      if (value === 'main') {
        await bot.editMessageText(t(lang, 'main_menu'), {
          chat_id: chatId, message_id: cb.message.message_id, reply_markup: menuKeyboard(lang),
        });
      } else if (value === 'search') {
        const st = stateOf(userId);
        st.awaiting = 'search';
        await bot.editMessageText(t(lang, 'enter_query'), { chat_id: chatId, message_id: cb.message.message_id });
      } else if (value === 'code') {
        const st = stateOf(userId);
        st.awaiting = 'code';
        await bot.editMessageText(t(lang, 'enter_code'), { chat_id: chatId, message_id: cb.message.message_id });
      } else if (value === 'latest') {
        const list = db.getLatestMovies(50);
        const st = stateOf(userId);
        st.listType = 'latest'; st.query = ''; st.page = 0;
        if (!list.length) {
          await bot.editMessageText(t(lang, 'no_movies'), { chat_id: chatId, message_id: cb.message.message_id, reply_markup: menuKeyboard(lang) });
        } else {
          await bot.editMessageText(t(lang, 'found', { query: '⭐', count: list.length }), {
            chat_id: chatId, message_id: cb.message.message_id, reply_markup: moviesKeyboard(lang, list, 0),
          });
        }
      } else if (value === 'help') {
        await bot.editMessageText(t(lang, 'help_text'), { chat_id: chatId, message_id: cb.message.message_id, parse_mode: 'HTML' });
      } else if (value === 'lang') {
        await bot.editMessageText(t(lang, 'choose_lang'), { chat_id: chatId, message_id: cb.message.message_id, reply_markup: langKeyboard });
      }
      return;
    }

    // Sahifalash
    if (prefix === 'page') {
      const st = stateOf(userId);
      if (value === 'next') st.page += 1;
      else if (value === 'prev') st.page = Math.max(0, st.page - 1);
      const list = st.listType === 'latest' ? db.getLatestMovies(50) : db.searchMovies(st.query);
      await bot.editMessageText(t(lang, 'found', { query: st.listType === 'latest' ? '⭐' : st.query, count: list.length }), {
        chat_id: chatId, message_id: cb.message.message_id, reply_markup: moviesKeyboard(lang, list, st.page),
      });
      return;
    }

    // Kino haqida
    if (prefix === 'movie') {
      const movie = db.getMovie(value);
      if (!movie) {
        await bot.editMessageText(t(lang, 'not_found'), { chat_id: chatId, message_id: cb.message.message_id });
        return;
      }
      await bot.editMessageText(movieInfo(lang, movie), {
        chat_id: chatId, message_id: cb.message.message_id, reply_markup: movieActionsKeyboard(lang, movie.id),
      });
      return;
    }

    // Ko'rish
    if (prefix === 'send') {
      const movie = db.getMovie(value);
      if (!movie) return;
      await bot.sendMessage(chatId, t(lang, 'sending'));
      try {
        await bot.sendVideo(chatId, movie.fileId, { caption: movie.caption || t(lang, 'movie_title', { title: movie.title }) });
        await bot.sendMessage(chatId, t(lang, 'film_sent'));
      } catch (e) {
        console.error('sendVideo xatolik:', e.message);
        await bot.sendMessage(chatId, t(lang, 'send_error'));
      }
      return;
    }

    // Yuklab olish
    if (prefix === 'dload') {
      const movie = db.getMovie(value);
      if (!movie) return;
      await bot.sendMessage(chatId, t(lang, 'sending'));
      try {
        await bot.sendDocument(chatId, movie.fileId, { filename: `${movie.title}.mp4`, caption: movie.title });
        await bot.sendMessage(chatId, t(lang, 'film_sent'));
      } catch (e) {
        console.error('sendDocument xatolik:', e.message);
        await bot.sendMessage(chatId, t(lang, 'send_error'));
      }
      return;
    }

    // Admin panel
    if (prefix === 'admin') {
      if (!isAdmin(userId)) {
        await bot.sendMessage(chatId, t(lang, 'admin_only'));
        return;
      }
      if (value === 'add') {
        const st = stateOf(userId);
        st.awaiting = 'title';
        await bot.editMessageText(t(lang, 'send_movie_name'), { chat_id: chatId, message_id: cb.message.message_id });
      } else if (value === 'list') {
        const list = db.getAllMovies();
        if (!list.length) {
          await bot.sendMessage(chatId, t(lang, 'no_movies'));
        } else {
          await bot.sendMessage(chatId, '📃\n' + list.map((m) => `${m.id}. ${m.title}${m.year ? ` (${m.year})` : ''}`).join('\n'));
        }
      } else if (value === 'stats') {
        await bot.editMessageText(t(lang, 'stats', {
          users: db.countUsers(), movies: db.countMovies(), searches: db.countSearches(),
        }), { chat_id: chatId, message_id: cb.message.message_id, reply_markup: adminKeyboard(lang) });
      } else if (value === 'broadcast') {
        const st = stateOf(userId);
        st.awaiting = 'broadcast';
        await bot.editMessageText(t(lang, 'send_broadcast'), { chat_id: chatId, message_id: cb.message.message_id });
      }
      return;
    }
  });

  // ---------- Matnli xabarlar ----------
  bot.on('message', async (msg) => {
    if (msg.chat.type !== 'private') return;
    const userId = msg.from.id;
    const chatId = msg.chat.id;
    const lang = await db.getLang(userId);
    const st = stateOf(userId);

    // Video fayl kelganda
    if (msg.video) {
      if (st.awaiting === 'file' && isAdmin(userId)) {
        const video = msg.video;
        const title = st.title || (msg.caption || '').split('\n')[0] || `Kino ${Date.now()}`;
        const caption = msg.caption || t('uz', 'movie_title', { title });
        db.addMovie({
          title,
          year: parseYear(msg.caption || video.file_name || ''),
          genre: '',
          rating: null,
          quality: detectQuality(video),
          fileId: video.file_id,
          caption,
          code: parseCode(msg.caption || ''),
        });
        st.awaiting = null;
        st.title = '';
        await bot.sendMessage(chatId, t(lang, 'movie_added', { title }), { reply_markup: menuKeyboard(lang) });
        return;
      }
      if (isAdmin(userId)) {
        await bot.sendMessage(chatId, '❓ Kino qo\'shish uchun: /addmovie ni bosing, title kiriting, keyin faylni yuboring.');
      }
      return;
    }

    const text = (msg.text || '').trim();
    if (!text || text.startsWith('/')) return;

    // Kino qidiruv
    if (st.awaiting === 'search') {
      st.awaiting = null;
      st.listType = 'search';
      st.query = text;
      st.page = 0;
      db.logSearch();
      const list = db.searchMovies(text);
      if (!list.length) return bot.sendMessage(chatId, t(lang, 'not_found'));
      await bot.sendMessage(chatId, t(lang, 'found', { query: text, count: list.length }), {
        reply_markup: moviesKeyboard(lang, list, 0),
      });
      return;
    }

    // Kod bilan kino topish
    if (st.awaiting === 'code') {
      st.awaiting = null;
      const movie = db.getMovieByCode(text);
      if (!movie) return bot.sendMessage(chatId, t(lang, 'code_not_found'));
      await bot.sendMessage(chatId, movieInfo(lang, movie), {
        reply_markup: movieActionsKeyboard(lang, movie.id),
      });
      return;
    }

    // Kino nomi (admin add flow)
    if (st.awaiting === 'title' && isAdmin(userId)) {
      st.title = text;
      st.awaiting = 'file';
      await bot.sendMessage(chatId, t(lang, 'send_movie_file'));
      return;
    }

    // Broadcast
    if (st.awaiting === 'broadcast' && isAdmin(userId)) {
      st.awaiting = null;
      const ids = db.allUserIds();
      let count = 0;
      for (const uid of ids) {
        try {
          await bot.sendMessage(uid, text, { parse_mode: 'HTML' });
          count += 1;
        } catch (_) {}
      }
      await bot.sendMessage(chatId, t(lang, 'broadcast_sent', { count }));
      return;
    }

    // Oddiy matn: avval kod bo'lsa tekshiramiz, keyin qidiruv
    const byCode = db.getMovieByCode(text);
    if (byCode) {
      await bot.sendMessage(chatId, movieInfo(lang, byCode), {
        reply_markup: movieActionsKeyboard(lang, byCode.id),
      });
      return;
    }
    db.logSearch();
    st.listType = 'search';
    st.query = text;
    st.page = 0;
    const list = db.searchMovies(text);
    if (!list.length) return bot.sendMessage(chatId, t(lang, 'not_found'));
    await bot.sendMessage(chatId, t(lang, 'found', { query: text, count: list.length }), {
      reply_markup: moviesKeyboard(lang, list, 0),
    });
  });

  // ---------- Kanal posti: kanalga video tushsa, avtomatik qo'shish ----------
  const { CHANNEL_ID } = require('./config');
  bot.on('channel_post', async (post) => {
    if (!CHANNEL_ID || Number(post.chat.id) !== Number(CHANNEL_ID)) return;
    if (!post.video) return;
    const caption = post.caption || '';
    const lines = caption.split('\n').map((l) => l.trim()).filter(Boolean);
    const title = lines.find((l) => !/kod|kód|code|код/i.test(l)) || lines[0] || `Kino ${Date.now()}`;
    const code = parseCode(caption);
    db.addMovie({
      title,
      year: parseYear(caption),
      genre: '',
      rating: null,
      quality: detectQuality(post.video),
      fileId: post.video.file_id,
      caption,
      code,
    });
    const codePart = code ? ` 🎫 ${code}` : '';
    try {
      await bot.sendMessage(CHANNEL_ID, `✅ Kino bazaga qo'shildi: ${title}${codePart}`);
    } catch (e) {
      console.error('Kanal xabari xatolik:', e.message);
    }
  });
}

module.exports = { registerHandlers, isAdmin, userState, stateOf };