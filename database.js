const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const MOVIES_FILE = path.join(DATA_DIR, 'movies.json');

let users = {}; // { [userId]: { username, fullName, lang, joinedAt } }
let movies = []; // [ { id, title, year, genre, rating, quality, fileId, caption, code, addedAt } ]
let searchLogCount = 0;

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function load() {
  ensureDir();
  try {
    if (fs.existsSync(USERS_FILE)) {
      users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    }
  } catch (e) {
    users = {};
    console.warn('users.json o\'qib bo\'lmadi, yangi boshlanadi');
  }
  try {
    if (fs.existsSync(MOVIES_FILE)) {
      movies = JSON.parse(fs.readFileSync(MOVIES_FILE, 'utf8'));
      if (!Array.isArray(movies)) movies = [];
    }
  } catch (e) {
    movies = [];
    console.warn('movies.json o\'qib bo\'lmadi, yangi boshlanadi');
  }
}

function saveUsers() {
  ensureDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

function saveMovies() {
  ensureDir();
  fs.writeFileSync(MOVIES_FILE, JSON.stringify(movies, null, 2), 'utf8');
}

// ---------- Users ----------
function addUser(userId, username, fullName, lang = 'uz') {
  if (!users[userId]) {
    users[userId] = {
      username: username || '',
      fullName: fullName || '',
      lang,
      joinedAt: new Date().toISOString(),
    };
    saveUsers();
  }
}

function setLang(userId, lang) {
  if (!users[userId]) users[userId] = { username: '', fullName: '', lang, joinedAt: new Date().toISOString() };
  users[userId].lang = lang;
  saveUsers();
}

function getUser(userId) {
  return users[userId] || null;
}

function getLang(userId) {
  const u = getUser(userId);
  return u ? u.lang : 'uz';
}

function countUsers() {
  return Object.keys(users).length;
}

function allUserIds() {
  return Object.keys(users).map(Number);
}

// ---------- Movies ----------
function nextId() {
  return movies.length ? Math.max(...movies.map((m) => m.id)) + 1 : 1;
}

function addMovie({ title, year, genre, rating, quality, fileId, caption, code }) {
  const movie = {
    id: nextId(),
    title: String(title || '').trim(),
    year: year || null,
    genre: genre || '',
    rating: rating || null,
    quality: quality || '',
    fileId,
    caption: caption || '',
    code: code || null,
    addedAt: new Date().toISOString(),
  };
  movies.push(movie);
  saveMovies();
  return movie;
}

function searchMovies(query) {
  const q = String(query).toLowerCase().trim();
  if (!q) return [];
  return movies
    .filter((m) => m.title.toLowerCase().includes(q))
    .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
}

function getMovie(id) {
  return movies.find((m) => m.id === Number(id)) || null;
}

function getMovieByCode(code) {
  const c = String(code || '').trim().toLowerCase();
  if (!c) return null;
  return movies.find((m) => m.code && String(m.code).toLowerCase() === c) || null;
}

function getLatestMovies(limit = 20) {
  return [...movies]
    .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
    .slice(0, limit);
}

function getAllMovies() {
  return [...movies].sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
}

function countMovies() {
  return movies.length;
}

function deleteMovie(id) {
  movies = movies.filter((m) => m.id !== Number(id));
  saveMovies();
}

// ---------- Search log ----------
function logSearch() {
  searchLogCount += 1;
}

function countSearches() {
  return searchLogCount;
}

module.exports = {
  load,
  addUser,
  setLang,
  getUser,
  getLang,
  countUsers,
  allUserIds,
  addMovie,
  searchMovies,
  getMovie,
  getMovieByCode,
  getLatestMovies,
  getAllMovies,
  countMovies,
  deleteMovie,
  logSearch,
  countSearches,
};