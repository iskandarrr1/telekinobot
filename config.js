require('dotenv').config();

module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN || '',
  CHANNEL_ID: process.env.CHANNEL_ID ? Number(process.env.CHANNEL_ID) : 0,
  ADMIN_ID: process.env.ADMIN_ID ? Number(process.env.ADMIN_ID) : 0,
  MOVIE_PER_PAGE: 5,
};