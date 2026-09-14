# ☁️ Botni bepul hosting'ga o'rnatish (24/7 ishlaydi)

Bot endi quyidagilarga tayyor:
- **Dockerfile** — server uchun konteyner
- **render.yaml** — Render'ga bir tugmada ulash
- **bot.js** — go'shimcha HTTP port (platforma botni "tirik" deb biladi)

Botni doim ishlashi uchun **GitHub → Render** usulini tavsiya qilamiz (bepul).

---

## 1-qadam: GitHub hisob + repo
1. [github.com](https://github.com) ga kirib **Sign up** bilan hisob oching (yoki kirgan bo'lsangiz).
2. Ochilgach: **+ (yuqori o'ng)** → **New repository**.
3. Nomi: `telekinobot` → **Public** → **Create repository**.
4. Foydalanuvchi interfeysida **"uploading an existing file"** havolasini bosing.
5. `C:\Users\user\Documents\Default Project\telekinobot` dan **BARCHA fayllar**ni ko'ching (Sichqoncha bilan belgilab sudrab tashlang).
   - ⚠️ `.env` ni **yuklamang**! Uning ichida secret token bor. Lekin `.env.example` bemalol yuboriladi.
6. **Commit changes** tugmasini bosing.

## 2-qadam: Render'da deploy
1. [render.com](https://render.com) ga oching → **Sign up** → GitHub orqali kirish.
2. **New +** → **Web Service**.
3. GitHub repongizni ulang (Ruxsat so'rasa *All repositories* ga ruxsat).
4. `telekinobot` ni tanlang → Render sozlamalarni o'zi topadi (Dockerfile).
5. Quyidagi **Environment** o'zgaruvchilarni qo'shing:
   | Key | Value (sizniki) |
   |---|---|
   | `BOT_TOKEN` | Sizning token (rasm nusxalab qo'ying) |
   | `CHANNEL_ID` | `-1004345856126` |
   | `ADMIN_ID` | `7924071302` |
6. Region: vafli emas; **Oregon** yoki **Singapore**.
7. **Create Web Service** → 3-5 daqiqa build kutilsin.
8. **"Live"** deb chiqsa — tayyor! 🎉

## 3-qadam: Uxlashini oldini olish (ixtiyoriy lekin tavsiya)
Render bepul rejasi bo'sh vaqtda (15 daqiqa) serviceni "uyquga" qo'yishi mumkin. Oldini olish:

1. [uptimerobot.com](https://uptimerobot.com) oching → bepul hisob.
2. **Add New Monitor** → Monitor Type: **HTTP(s)**.
3. URL ga Render'da berilgan manzilni yozing (masalan `https://telekinobot.onrender.com`).
4. Interval: **5 minutes** → Create Monitor.

Endi bot PC'ga bog'liqsiz 24/7 ishlaydi — kompyuterni o'chirsangiz ham. ✅

---

## ❗ Muhim eslatma
Server diskida saqlanadigan `data/` fayllari qayta deploy'da (yoki qayta ishga tushganda) **tozalanadi**. Kino bazasi kanal orqali to'ladi:
- Yangi postlar bot orqali qayta qo'shiladi.
- Bazani qaytadan to'ldirish uchun `/addmovie` yoki kanalga qaytadan post qilish kerak.

Kelajakda ma'lumotni saqlab turgizish (bepul) kerak bo'lsa — aytasiz, tuzib beramiz.

## Alternativ: Koyeb (ham bepul)
1. [koyeb.com](https://koyeb.com) → Sign up → GitHub.
2. **Create App** → GitHub → `telekinobot`.
3. Builder: **Dockerfile**, Port: `8080`.
4. Env o'zgaruvchilarini shunday xuddi qo'shing.
5. Health check: `/` yo **/health**.