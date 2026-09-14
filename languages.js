const LANGS = {
  uz: {
    code: 'uz',
    name: "O'zbekcha",
    flag: '🇺🇿',
    start: '👋 Salom, {name}! Kinobotga xush kelibsiz!\n\n🎬 Bu bot orqali siz kinolarni izlashingiz, ko\'rishingiz va yuklab olishingiz mumkin.\n\nTilni tanlang:',
    menu: '🏠 Bosh menyu',
    search: '🔍 Kino izlash',
    latest: '🎥 Eng so\'nggi kinolar',
    admin_panel: '🛠 Admin panel',
    help: '❓ Yordam',
    choose_lang: '🌐 Tilni tanlang:',
    lang_saved: '✅ Til sozlandi: {name}',
    enter_query: '🔍 Kino nomini kiriting:',
    searching: '⏳ Qidirilmoqda...',
    not_found: '😔 Hech narsa topilmadi. Boshqa nom bilan urinib ko\'ring.',
    found: '🔍 «{query}» bo\'yicha {count} ta natija topildi:',
    choose_movie: '👇 Kino tanlang:',
    sending: '⏳ Kino yuklanmoqda, biroz kuting...',
    send_error: '❌ Kinoni yuborishda xatolik yuz berdi. Keyinroq urinib ko\'ring.',
    download: '📥 Yuklab olish',
    watch: '▶️ Ko\'rish',
    back: '⬅️ Orqaga',
    main_menu: '🔙 Bosh menyu',
    no_movies: '📭 Hozircha kinolar yo\'q.',
    movie_title: '🎬 {title}',
    movie_info: '{title}\n\n📅 Yil: {year}\n🌍 Janr: {genre}\n⭐ Reyting: {rating}\n\n👇 Qaysi variantni tanlaysiz?',
    year: '📅 Yil: {year}',
    genre: '🌍 Janr: {genre}',
    rating: '⭐ Reyting: {rating}',
    quality: '💿 Sifat: {quality}',
    film_sent: '📥 Kino yuborildi! O\'ynatish yoki yuklab olish mumkin. ✅',
    help_text:
      '📚 <b>Foydalanish yo\'riqnomasi:</b>\n\n' +
      '🔍 <b>Kino izlash</b> — kino nomini yozing, bot topib beradi\n' +
      '🎥 <b>Eng so\'nggi kinolar</b> — yangi kinolarni ko\'ring\n' +
      '📥 <b>Yuklab olish</b> — kinoni to\'g\'ridan-to\'g\'ri yuklab oling\n\n' +
      'Barcha kinolar maxsus kanaldan olinadi. Savollar bo\'lsa admin bilan bog\'laning.',
    stats: '📊 Statistika:\n👥 Foydalanuvchilar: {users}\n🎬 Kinolar: {movies}\n🔍 Qidiruvlar: {searches}',
    admin_help:
      '🛠 Admin panel buyruqlari:\n\n' +
      '/addmovie — Kino qo\'shish\n' +
      '/listmovies — Kinolar ro\'yxati\n' +
      '/stats — Statistika\n' +
      '/broadcast — Reklama yuborish',
    send_movie_name: '🎬 Kinoning nomini yozing:',
    send_movie_file: '🎬 Endi kinoni yuboring (video fayl):',
    movie_added: '✅ Kino qo\'shildi: {title}',
    cancel: '❌ Bekor qilish',
    send_broadcast: '📣 Yubormoqchi bo\'lgan xabaringizni yozing:',
    broadcast_sent: '✅ Xabar {count} ta foydalanuvchiga yuborildi',
    private_warning: '❗ Botdan foydalanish uchun shaxsiy chatdan yozing: @{username}',
    add_channel_info: '📢 Kino kanali ma\'lumoti:',
    admin_only: '🚫 Bu bo\'lim faqat admin uchun.',
    choose_watch_download: '👇 Variantni tanlang:',
    cod_btn: '🎫 Kod orqali',
    enter_code: '🎫 Kodni kiriting (masalan: ABC123):',
    code_not_found: '😔 Bunday kodli kino topilmadi. Kodni tekshirib qaytadan yozing.',
    movie_code: '🎫 Kodi: {code}',
  },

  ru: {
    code: 'ru',
    name: 'Русский',
    flag: '🇷🇺',
    start: '👋 Привет, {name}! Добро пожаловать в Kinobot!\n\n🎬 Этот бот позволяет искать, смотреть и скачивать фильмы.\n\nВыберите язык:',
    menu: '🏠 Главное меню',
    search: '🔍 Поиск фильма',
    latest: '🎥 Последние фильмы',
    admin_panel: '🛠 Админ панель',
    help: '❓ Помощь',
    choose_lang: '🌐 Выберите язык:',
    lang_saved: '✅ Язык установлен: {name}',
    enter_query: '🔍 Введите название фильма:',
    searching: '⏳ Поиск...',
    not_found: '😔 Ничего не найдено. Попробуйте другое название.',
    found: '🔍 По запросу «{query}» найдено {count} результатов:',
    choose_movie: '👇 Выберите фильм:',
    sending: '⏳ Фильм загружается, подождите...',
    send_error: '❌ Ошибка при отправке фильма. Попробуйте позже.',
    download: '📥 Скачать',
    watch: '▶️ Смотреть',
    back: '⬅️ Назад',
    main_menu: '🔙 Главное меню',
    no_movies: '📭 Фильмов пока нет.',
    movie_title: '🎬 {title}',
    movie_info: '{title}\n\n📅 Год: {year}\n🌍 Жанр: {genre}\n⭐ Рейтинг: {rating}\n\n👇 Выберите вариант:',
    year: '📅 Год: {year}',
    genre: '🌍 Жанр: {genre}',
    rating: '⭐ Рейтинг: {rating}',
    quality: '💿 Качество: {quality}',
    film_sent: '📥 Фильм отправлен! Можно смотреть или скачать. ✅',
    help_text:
      '📚 <b>Инструкция по использованию:</b>\n\n' +
      '🔍 <b>Поиск фильмов</b> — напишите название фильма\n' +
      '🎥 <b>Последние фильмы</b> — смотрите новые фильмы\n' +
      '📥 <b>Скачивание</b> — скачивайте фильмы напрямую\n\n' +
      'Все фильмы берутся со специального канала. По вопросам обращайтесь к админу.',
    stats: '📊 Статистика:\n👥 Пользователи: {users}\n🎬 Фильмы: {movies}\n🔍 Поисков: {searches}',
    admin_help:
      '🛠 Команды админ панели:\n\n' +
      '/addmovie — Добавить фильм\n' +
      '/listmovies — Список фильмов\n' +
      '/stats — Статистика\n' +
      '/broadcast — Рассылка',
    send_movie_name: '🎬 Введите название фильма:',
    send_movie_file: '🎬 Теперь отправьте фильм (видеофайл):',
    movie_added: '✅ Фильм добавлен: {title}',
    cancel: '❌ Отмена',
    send_broadcast: '📣 Напишите сообщение для рассылки:',
    broadcast_sent: '✅ Сообщение отправлено {count} пользователям',
    private_warning: '❗ Для использования бота напишите в личные сообщения: @{username}',
    add_channel_info: '📢 Информация о канале фильмов:',
    admin_only: '🚫 Этот раздел доступен только админу.',
    choose_watch_download: '👇 Выберите вариант:',
    cod_btn: '🎫 По коду',
    enter_code: '🎫 Введите код (например: ABC123):',
    code_not_found: '😔 Фильм с таким кодом не найден. Проверьте код и попробуйте снова.',
    movie_code: '🎫 Код: {code}',
  },

  en: {
    code: 'en',
    name: 'English',
    flag: '🇬🇧',
    start: '👋 Hello, {name}! Welcome to Kinobot!\n\n🎬 This bot allows you to search, watch and download movies.\n\nChoose your language:',
    menu: '🏠 Main menu',
    search: '🔍 Search movie',
    latest: '🎥 Latest movies',
    admin_panel: '🛠 Admin panel',
    help: '❓ Help',
    choose_lang: '🌐 Choose a language:',
    lang_saved: '✅ Language set: {name}',
    enter_query: '🔍 Enter the movie title:',
    searching: '⏳ Searching...',
    not_found: '😔 Nothing found. Try another title.',
    found: '🔍 Found {count} results for «{query}»:',
    choose_movie: '👇 Choose a movie:',
    sending: '⏳ Movie is loading, please wait...',
    send_error: '❌ Error sending the movie. Try again later.',
    download: '📥 Download',
    watch: '▶️ Watch',
    back: '⬅️ Back',
    main_menu: '🔙 Main menu',
    no_movies: '📭 No movies available yet.',
    movie_title: '🎬 {title}',
    movie_info: '{title}\n\n📅 Year: {year}\n🌍 Genre: {genre}\n⭐ Rating: {rating}\n\n👇 Choose an option:',
    year: '📅 Year: {year}',
    genre: '🌍 Genre: {genre}',
    rating: '⭐ Rating: {rating}',
    quality: '💿 Quality: {quality}',
    film_sent: '📥 Movie sent! You can watch or download. ✅',
    help_text:
      '📚 <b>Usage guide:</b>\n\n' +
      '🔍 <b>Search movies</b> — type the movie title\n' +
      '🎥 <b>Latest movies</b> — browse new movies\n' +
      '📥 <b>Download</b> — download movies directly\n\n' +
      'All movies come from a special channel. Contact admin with questions.',
    stats: '📊 Statistics:\n👥 Users: {users}\n🎬 Movies: {movies}\n🔍 Searches: {searches}',
    admin_help:
      '🛠 Admin panel commands:\n\n' +
      '/addmovie — Add movie\n' +
      '/listmovies — Movie list\n' +
      '/stats — Statistics\n' +
      '/broadcast — Broadcast',
    send_movie_name: '🎬 Enter the movie title:',
    send_movie_file: '🎬 Now send the movie (video file):',
    movie_added: '✅ Movie added: {title}',
    cancel: '❌ Cancel',
    send_broadcast: '📣 Write your broadcast message:',
    broadcast_sent: '✅ Message sent to {count} users',
    private_warning: '❗ To use the bot, message it in private chat: @{username}',
    add_channel_info: '📢 Channel info:',
    admin_only: '🚫 This section is for admin only.',
    choose_watch_download: '👇 Choose an option:',
    cod_btn: '🎫 By code',
    enter_code: '🎫 Enter the code (e.g. ABC123):',
    code_not_found: '😔 No movie found with this code. Check the code and try again.',
    movie_code: '🎫 Code: {code}',
  },
};

function t(lang, key, vars = {}) {
  const table = LANGS[lang] || LANGS.uz;
  let s = table[key] !== undefined ? table[key] : key;
  for (const [k, v] of Object.entries(vars)) {
    s = s.split('{' + k + '}').join(v);
  }
  return s;
}

module.exports = { LANGS, t };