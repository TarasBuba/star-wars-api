// server.js — Star Wars Mock API
// Розташування: star-wars/api/server.js
// Запуск: cd star-wars/api && node server.js

const jsonServer = require('json-server');
const path = require('path');

const app = jsonServer.create();
const router = jsonServer.router(require('./db.js')());
const routes = require('./routes.json');

// ── Middleware ──────────────────────────────────────────
const middlewares = jsonServer.defaults({ logger: true, noCors: false });
app.use(middlewares);

// ── CORS ────────────────────────────────────────────────
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// ── Rewriter: /api/v1/* → /* ────────────────────────────
app.use(jsonServer.rewriter(routes));

// ── Custom response: додаємо meta обгортку ───────────────
router.render = (req, res) => {
  const data = res.locals.data;
  const isArr = Array.isArray(data);
  res.header('X-Total-Count', isArr ? data.length : 1);
  res.jsonp(isArr ? { data, meta: { total: data.length } } : data);
};

// ── Mount ────────────────────────────────────────────────
app.use(router);

// ── Start ────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('');
  console.log('  ⭐ STAR WARS API запущено!');
  console.log(`  🚀 http://localhost:${PORT}`);
  console.log(`  📡 http://localhost:${PORT}/api/v1/characters`);
  console.log(`  📡 http://localhost:${PORT}/api/v1/films`);
  console.log(`  📡 http://localhost:${PORT}/api/v1/weapons?type=lightsaber`);
  console.log(`  📡 http://localhost:${PORT}/api/v1/quotes?is_iconic=true`);
  console.log('');
  console.log('  May the Force be with you. ✨');
});
