// /**
//  * PashtoHub Backend — Entry Point
//  * ----------------------------------
//  * Sets up Express, security middleware, CORS for the React frontend,
//  * mounts all API routes and connects to MongoDB.
//  */


// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const rateLimit = require('express-rate-limit');
// const dotenv = require('dotenv');

// // Load env before anything else
// dotenv.config();

// const connectDB = require('./config/db');
// const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// // Route imports
// const authRoutes = require('./routes/authRoutes');
// const bookRoutes = require('./routes/bookRoutes');
// const dictionaryRoutes = require('./routes/dictionaryRoutes');
// const lessonRoutes = require('./routes/lessonRoutes');
// const contactRoutes = require('./routes/contactRoutes');

// // Connect to MongoDB
// // connectDB();
// const app = express();

// const allowedOrigins = [
//   process.env.CLIENT_URL || 'http://localhost:5173',
//   'http://localhost:5173',
//   'http://127.0.0.1:5173',
//   'http://localhost:3000',
// ];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       // Allow requests with no origin (Postman, curl, server-to-server)
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.includes(origin)) return callback(null, true);
//       console.warn(`⚠️  CORS blocked origin: ${origin}`);
//       return callback(new Error(`CORS blocked for origin: ${origin}`));
//     },
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   })
// );

// // Handle preflight for all routes
// app.options('*', cors());

// // -----------------------------
// // Core middleware
// // -----------------------------
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true }));

// // Helmet — relaxed for dev so it doesn't block cross-origin requests
// app.use(
//   helmet({
//     crossOriginResourcePolicy: { policy: 'cross-origin' },
//     crossOriginOpenerPolicy: false,
//     contentSecurityPolicy: false,
//   })
// );

// // Logger — only in development
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

// // -----------------------------
// // Rate limiter — ONLY on login/register, not on all /api/auth
// // -----------------------------
// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 50, // generous for development
//   message: {
//     success: false,
//     message: 'Too many attempts. Please try again in 15 minutes.',
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// // -----------------------------
// // Health check
// // -----------------------------
// app.get('/', (req, res) => {
//   res.json({
//     success: true,
//     message: 'PashtoHub API is running 🎉',
//     version: '1.0.0',
//     endpoints: {
//       auth: '/api/auth',
//       books: '/api/books',
//       dictionary: '/api/dictionary',
//       lessons: '/api/lessons',
//       contact: '/api/contact',
//     },
//   });
// });

// app.get('/api/health', (req, res) => {
//   res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
// });

// // -----------------------------
// // API routes
// // -----------------------------
// // Apply rate limit only to the sensitive endpoints, not the whole router
// app.use('/api/auth/login', authLimiter);
// app.use('/api/auth/register', authLimiter);
// app.use('/api/auth', authRoutes);
// app.use('/api/books', bookRoutes);
// app.use('/api/dictionary', dictionaryRoutes);
// app.use('/api/lessons', lessonRoutes);
// app.use('/api/contact', contactRoutes);

// // -----------------------------
// // Error handling (must be last)
// // -----------------------------
// app.use(notFound);
// app.use(errorHandler);

// // -----------------------------
// // Start server — connect to DB first, THEN listen
// // -----------------------------
// const PORT = parseInt(process.env.PORT, 10) || 5000;
// const HOST = process.env.HOST || '0.0.0.0';

// const startServer = async () => {
//   try {
//     // 1. Connect to MongoDB first
//     await connectDB();

//     // 2. Bind explicitly to HOST (0.0.0.0 = all IPv4 interfaces, including localhost & 127.0.0.1)
//     const server = app.listen(PORT, HOST, () => {
//       console.log('-------------------------------------------');
//       console.log(`✅ PashtoHub API running in ${process.env.NODE_ENV || 'development'} mode`);
//       console.log(`✅ Listening on http://${HOST}:${PORT}`);
//       console.log(`✅ Accessible at: http://localhost:${PORT}`);
//       console.log(`✅ Accessible at: http://127.0.0.1:${PORT}`);
//       console.log('-------------------------------------------');
//     });

//     // Extra safety: log any listen errors (EADDRINUSE, EACCES, etc.)
//     server.on('error', (err) => {
//       if (err.code === 'EADDRINUSE') {
//         console.error(`❌ Port ${PORT} is already in use. Close the other process or change PORT in .env`);
//       } else if (err.code === 'EACCES') {
//         console.error(`❌ Permission denied on port ${PORT}. Try a port > 1024.`);
//       } else {
//         console.error(`❌ Server error: ${err.message}`);
//       }
//       process.exit(1);
//     });

//     // Graceful shutdown on unhandled rejections
//     process.on('unhandledRejection', (err) => {
//       console.error(`❌ Unhandled Rejection: ${err.message}`);
//       server.close(() => process.exit(1));
//     });
//   } catch (err) {
//     console.error(`❌ Failed to start server: ${err.message}`);
//     process.exit(1);
//   }
// };

// startServer();

// module.exports = app;

/**
 * PashtoHub Backend — Entry Point
 * --------------------------------
 * Designed so the "I am listening" log CANNOT lie:
 *   - The startup banner is printed only inside the listen() callback.
 *   - After the callback fires, we read server.address() and assert it's bound.
 *   - We then make a real HTTP request to ourselves to PROVE the port is reachable.
 *   - Every error path (listen error, uncaught exception, unhandled rejection)
 *     is logged loudly. No process.exit() during boot without a printed reason.
 */

'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const { doubleCsrf } = require('csrf-csrf');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// 1) Load env first
dotenv.config();

// 2) Defensive: prove which file is actually running.
//    If you ever see this line missing, you're running a different file than you think.
console.log(`[boot] server.js starting — pid=${process.pid} cwd=${process.cwd()}`);
console.log(`[boot] node=${process.version} platform=${process.platform}`);

// 3) Crash-loud handlers BEFORE anything else can throw.
process.on('uncaughtException', (err) => {
  console.error('[fatal] uncaughtException:', err && err.stack ? err.stack : err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[fatal] unhandledRejection:', reason);
});

// 4) Imports that may throw — wrap so we see the error
let notFound, errorHandler;
let authRoutes, bookRoutes, dictionaryRoutes, lessonRoutes, contactRoutes, sitemapRoutes, uploadRoutes;
let categoryRoutes, adminBookRoutes, adminLessonRoutes;
let leaderRoutes, adminLeaderRoutes;
let adminDictionaryRoutes;
try {
  ({ notFound, errorHandler } = require('./middleware/errorMiddleware'));
  authRoutes       = require('./routes/authRoutes');
  bookRoutes       = require('./routes/bookRoutes');
  dictionaryRoutes = require('./routes/dictionaryRoutes');
  lessonRoutes     = require('./routes/lessonRoutes');
  contactRoutes    = require('./routes/contactRoutes');
  sitemapRoutes    = require('./routes/sitemapRoutes');
  uploadRoutes     = require('./routes/uploadRoutes');
  categoryRoutes      = require('./routes/categoryRoutes');
  adminBookRoutes     = require('./routes/adminBookRoutes');
  adminLessonRoutes   = require('./routes/adminLessonRoutes');
  leaderRoutes          = require('./routes/leaderRoutes');
  adminLeaderRoutes     = require('./routes/adminLeaderRoutes');
  adminDictionaryRoutes = require('./routes/adminDictionaryRoutes');
} catch (err) {
  console.error('[fatal] Failed to load a module during require():', err);
  process.exit(1);
}

const app = express();

// ---- security middleware ----
// Body size capped at 10kb. Anything large (book PDFs, images) goes through dedicated upload routes.
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// Helmet: sane defaults + CSP that allows our font hosts.
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'default-src': ["'self'"],
      'script-src':  ["'self'", "'unsafe-inline'"],
      'style-src':   ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      'font-src':    ["'self'", 'https://fonts.gstatic.com', 'data:'],
      'img-src':     ["'self'", 'data:', 'https:'],
      'connect-src': ["'self'", 'https:'],
    },
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Strip $ and . from req.body/query/params to block NoSQL ($where, $ne) injection.
app.use(mongoSanitize());

// Block HTTP parameter pollution (?role=user&role=admin → keeps last only)
app.use(hpp());

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);                       // server-to-server / curl
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,                                          // required for httpOnly cookies
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-CSRF-Token'],
}));

// ----------------------------------------------------------------------------
// Local-storage uploads — anything saved by services/localUploadService.js
// is served from here.  Cached for 1 day; ETag handles modifications.
// In dev, the Vite dev server proxies /uploads to this same Express instance.
// ----------------------------------------------------------------------------
const { UPLOAD_DIR } = require('./services/localUploadService');
app.use('/uploads', express.static(UPLOAD_DIR, {
  maxAge: '1d',
  etag: true,
  fallthrough: true,
  dotfiles: 'ignore',
}));

// Global generic limiter — 300 req / 15 min / IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Try again later.' },
});
app.use('/api/', globalLimiter);

// Tight limiter for auth — 10 attempts / 15 min / IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please try again in 15 minutes.' },
});

// ----------------------------------------------------------------------------
// CSRF (double-submit cookie pattern).
// Because we use httpOnly auth cookies, CSRF is now a real risk and must be blocked.
// Flow: client GETs /api/csrf → receives token → sends it as `X-CSRF-Token` header
//       on every state-changing request (POST/PUT/PATCH/DELETE).
// ----------------------------------------------------------------------------
const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || process.env.JWT_SECRET || 'dev-csrf-secret-change-me',

  // CRITICAL: this identifier must NOT change between token mint and token
  // validation. Previously we used `req.cookies.access_token`, but that JWT
  // changes on login, logout, and every 15 minutes when the access token
  // rotates via /auth/refresh — so any cached CSRF token would silently
  // become invalid. We use req.ip instead, which is stable for the lifetime
  // of a session at one network location. The double-submit pair (httpOnly
  // cookie + JS-set header) remains the primary protection — the session
  // identifier is just additional binding.
  getSessionIdentifier: (req) => req.ip || 'anonymous',

  cookieName: process.env.NODE_ENV === 'production' ? '__Host-psifi.x-csrf-token' : 'x-csrf-token',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    path: '/',
  },
  size: 64,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
  getCsrfTokenFromRequest: (req) => req.headers['x-csrf-token'],
});

// ---- routes ----
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'PashtoHub API is running 🎉',
    pid: process.pid,
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Diagnostic endpoint — confirms which process answers and on what address
app.get('/__alive', (req, res) => {
  res.json({
    alive: true,
    pid: process.pid,
    boundTo: req.socket.localAddress + ':' + req.socket.localPort,
    remote:  req.socket.remoteAddress,
    time: new Date().toISOString(),
  });
});

// CSRF token endpoint — frontend calls this once on app boot to fetch a token.
app.get('/api/csrf', (req, res) => {
  res.json({ success: true, data: { csrfToken: generateCsrfToken(req, res) } });
});

// Apply CSRF to all state-changing /api requests EXCEPT login/register/refresh
// (those use rate limiting + credential check, no session cookie to ride yet).
// Match by suffix so the check survives any base-URL prefix variation.
const csrfExemptSuffixes = ['/auth/login', '/auth/register', '/auth/refresh'];
app.use('/api', (req, res, next) => {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') return next();
  const path = (req.originalUrl || '').split('?')[0];
  if (csrfExemptSuffixes.some((s) => path.endsWith(s))) return next();
  return doubleCsrfProtection(req, res, next);
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/dictionary', dictionaryRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/categories', categoryRoutes.publicRouter);
app.use('/api/leaders',    leaderRoutes);

// Admin-only — all guarded by protect+admin inside their routers
app.use('/api/admin/uploads',     uploadRoutes);
app.use('/api/admin/books',       adminBookRoutes);
app.use('/api/admin/lessons',     adminLessonRoutes);
app.use('/api/admin/leaders',     adminLeaderRoutes);
app.use('/api/admin/dictionary',  adminDictionaryRoutes);
app.use('/api/admin/categories',  categoryRoutes.adminRouter);

// SEO files served at site root (must be before SPA static fallback)
app.use('/', sitemapRoutes);

// ----------------------------------------------------------------------------
// Production: serve the built React app with aggressive caching.
// Vite emits hashed filenames in /assets, so we can safely send immutable + 1y.
// index.html must never be cached, otherwise users see stale JS references.
// ----------------------------------------------------------------------------
if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '..', 'frontend', 'dist');
  if (fs.existsSync(distPath)) {
    app.use(
      '/assets',
      express.static(path.join(distPath, 'assets'), {
        maxAge: '1y',
        immutable: true,
        etag: false,
      })
    );
    app.use(
      express.static(distPath, {
        maxAge: '1d',
        etag: true,
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('index.html')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          }
        },
      })
    );
    // SPA fallback — every non-API GET serves index.html
    app.get(/^\/(?!api|__alive).*/, (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log(`[static] Serving frontend from ${distPath}`);
  } else {
    console.warn(`[static] NODE_ENV=production but dist not found at ${distPath} — run "npm run build" in frontend/`);
  }
}

app.use(notFound);
app.use(errorHandler);

// ---- startup ----
const PORT = Number(process.env.PORT) || 5000;
const HOST = '0.0.0.0';   // bind on all interfaces; fixes Windows IPv6-only issue

// Use an explicit http.Server so error events are easy to attach BEFORE listen()
const server = http.createServer(app);

// Attach error handler BEFORE calling listen() so EADDRINUSE etc. is never silent
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[fatal] Port ${PORT} is already in use.`);
    console.error('  Windows: netstat -ano | findstr :5000  →  taskkill /PID <pid> /F');
    console.error('  macOS/Linux: lsof -iTCP:' + PORT + ' -sTCP:LISTEN  →  kill -9 <pid>');
  } else if (err.code === 'EACCES') {
    console.error(`[fatal] Permission denied to bind port ${PORT}.`);
  } else {
    console.error('[fatal] HTTP server error:', err);
  }
  process.exit(1);
});

server.on('close', () => {
  console.warn('[server] HTTP server closed.');
});

// The ONLY place we log "listening" — and only AFTER verifying the bind.
server.listen(PORT, HOST, () => {
  const addr = server.address();
  if (!addr || typeof addr === 'string') {
    console.error('[fatal] listen() callback fired but server.address() is invalid:', addr);
    process.exit(1);
    return;
  }
  console.log('================================================');
  console.log(`[ok] Bound to ${addr.address}:${addr.port}  (family=${addr.family})`);
  console.log(`[ok] Try:  curl http://127.0.0.1:${addr.port}/`);
  console.log(`[ok] Try:  curl http://localhost:${addr.port}/`);
  console.log('================================================');

  // SELF-TEST: prove the bind is real by sending a request to ourselves.
  selfTest(addr.port);

  // Connect Mongo AFTER the port is bound. DB failure must not bring the server down.
  connectMongo();
});

// Self-test: hit the running server from inside the same process.
// If this fails, the bind was a lie and you'll see it here.
function selfTest(port) {
  const req = http.get({ host: '127.0.0.1', port, path: '/__alive', timeout: 3000 }, (res) => {
    let body = '';
    res.on('data', (c) => (body += c));
    res.on('end', () => {
      console.log(`[selftest] GET /__alive → HTTP ${res.statusCode}, body=${body}`);
    });
  });
  req.on('timeout', () => { req.destroy(); console.error('[selftest] FAILED — request timed out. The "listening" log was a lie.'); });
  req.on('error', (e) => { console.error('[selftest] FAILED —', e.message); });
}

// Mongo connect — never exits the process; logs status and continues.
async function connectMongo() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn('[mongo] MONGO_URI not set — DB features disabled.');
    return;
  }
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log(`[mongo] connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error('[mongo] connection FAILED:', err.message);
    console.error('[mongo] HTTP server stays up so you can see this error and fix .env.');
  }
}

mongoose.connection.on('disconnected', () => console.warn('[mongo] disconnected'));

// Graceful shutdown
function shutdown(signal) {
  console.log(`\n[shutdown] ${signal} received — closing…`);
  server.close(() => mongoose.connection.close(false).finally(() => process.exit(0)));
  setTimeout(() => process.exit(1), 5000).unref(); // hard kill if hangs
}
process.on('SIGINT',  () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

module.exports = app;