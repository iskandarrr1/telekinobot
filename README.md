# 🎬 TeleKinobot — Telegram kino boti (UZ 🇺🇿 / RU 🇷🇺 / EN 🇬🇧)

Telegram foydalanuvchilariga kinolarni izlash, ko'rish va yuklab olish imkoniyatini beruvchi Node.js bot.

Kolob: **Kino fayllari** maxsus Telegram kanalga yuklangan bo'ladi. Bot kanalga ulanib, kino `file_id` larini bazada saqlaydi va foydalanuvchilarga yuboradi. Kanalga yangi video tushganda bot uni **avtomatik** bazaga qo'shadi.

---

## 🚀 Ishga tushirish

1. **Node.js** o'rnatilgan bo'lishi kerak (v16+):
   ```bash
   node -v
   ```

2. Kutubxonalarni o'rnatish:
   ```bash
   npm install
   ```

3. `.env` faylini to'ldirish:
   ```env
   BOT_TOKEN=1234567890:ABC...          # @BotFather dan
   CHANNEL_ID=-1001234567890            # Kino kanali id si
   ADMIN_ID=123456789                   # Sizning user id
   ```

4. Botni ishga tushirish:
   ```bash
   npm start
   ```

---

## ⚙️ Tayyorlash (muhim!)

### 1. Bot yaratish
- Telegram'da [@BotFather](https://t.me/BotFather) ga yozing → `/newbot` → nom va username bering → token oling.
- `.env` fayliga `BOT_TOKEN` ni yozing.

### 2. Kino kanali
- Maxsus kanal oching (masalan: `@kinolar_kanali`).
- Botni kanalga **Admin** qilib qo'shing:
  - Kanal sozlamalari → `Administrators` → `Add Administrator` → botni tanlang.
- Kanal id sini aniqlash:
  - [@userinfobot](https://t.me/userinfobot) ga habar forward qiling → kanal id si chiqadi (salbiy son, masalan `-1001234567890`).
  - Yoki o'z botingizga `/myid` deb yozing (qo'shimcha).
- `CHANNEL_ID` ni `.env` faylida to'g'rilang.

### 3. Admin ID
- Sizning Telegram user id'gingizni [@userinfobot](https://t.me/userinfobot) dan oling → `ADMIN_ID` ga yozing.

---

## 🎬 Kinolar qanday qo'shiladi? (2 usul)

### Usul 1: Kanal orqali (avtomatik) — TDAGAN USUL
Kanalga nomi (caption) bilan video yuklang:
- Captionda **kino nomi** birinchi qatorda bo'lsin, yilini ham yozsangiz (masalan `Avatar 2009`) bot yilni o'zi aniqlab oladi.
- Bot kanalda admin bo'lsa, videoni ko'rib, avtomatik bazaga qo'shadi.

### Usul 2: Bot orqali (manual)
- Botga `/admin` deb yozing (faqat admin).
- `➕ Add Movie` tugmasini bosing → kino nomini yozing → video fayl yuboring. ✅

### 🎫 Kino kodi (Kod orqali topish)
Har bir kinoga **kod** berishingiz mumkin. Foydalanuvchi kodni botga yozsa, o'sha kino chiqadi.

Caption'ga quyidagicha yozing:
```
Avatar 2009
Kod: AVATAR-2024
```
- Kod formatlari: `Kod: ABC123`, `Code: ABC123`, `Код: ABC123`, `#ABC123` — bulardan birini qo'llasangiz bo'ladi.
- Bot kodni o'zi aniqlab, bazaga saqlaydi va kanalga javob yozadi: `✅ Kino bazaga qo'shildi: Avatar 2009 🎫 AVATAR-2024`
- Foydalanuvchi botda «🎫 Kod orqali» tugmasini bosib yoki to'g'ridan-to'g'ri `AVATAR-2024` yozib, kinoni chiqaradi (kod **nozik** emas — katta/kichik harf barobar).

---

## 📖 Foydalanish

- `/start` — til tanlash (🇺🇿 Uzbek / 🇷🇺 Русский / 🇬🇧 English)
- `/help` — yordam
- Admin: `/admin`, `/stats`, `/broadcast`, `/addmovie`, `/listmovies`

**Foydalanuvchilar uchun:**
- 🔍 **Kino izlash** — nom yozish yoki Search tugmasi
- 🎥 **Eng so'nggi kinolar** — oxirgi 50 ta kino
- ▶️ **Ko'rish** — videoni ichida o'ynatish
- 📥 **Yuklab olish** — fayl sifatida yuklab olish

---

## 📁 Loyiha tuzilmasi

```
telekinobot/
├── bot.js          # Asosiy fayl (ishga tushirish)
├── handlers.js     # Barcha ishlar: tugmalar, qidiruv, admin
├── database.js     # JSON fayllarga saqlash (users.json, movies.json)
├── languages.js    # 3 til: uz, ru, en
├── config.js       # Sozlamalar (.env dan)
├── data/           # Avtomatik yaratiladi (baza fayllari)
├── .env            # Maxfiy sozlamalar
└── package.json
```

---

## 🛠 Admin buyruqlari

| Buyruq | Vazifasi |
|---|---|
| `/addmovie` | Kino qo'shish (nom → video) |
| `/listmovies` | Bazadagi kinolar ro'yxati |
| `/stats` | Statistika |
| `/broadcast` | Barcha foydalanuvchilarga xabar |

---

## ❓ Ko'p beriladigan savollar

**Kanalga video qo'shganman, lekin bot ko'ra olamayapti?**
→ Bot kanalda **admin** emas. Ikkala yo'lni tekshiring: (1) bot kanalga admin qilingan, (2) `CHANNEL_ID` to'g'ri.

**Bot video yuborayotganda xatolik?**
→ Telegram fayllarni qayta ishlash uchun bir necha soniya kuting. Katta kinolar yuborilishida biroz vaqt ketadi (50MB dan kattalari restrict bo'lishi mumkin). Katta fayllar uchun botni **restrict** qilmasligi kerak.

**Videoga javob yo'q?**
→ Kanalda admin statusini tekshiring, bot allaqachon kanalda bo'lishi kerak; postlarni ko'rish uchun `channel_post` update ruxsati kerak — bot admin bo'lsa avtomatik ishlaydi.

Bot muallifi: Kinobot (Node.js / node-telegram-bot-api)