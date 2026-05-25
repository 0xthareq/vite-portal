/**
 * /api/auth.js — Vercel Serverless Auth Function
 *
 * POST /api/auth        → login, returns signed token
 * GET  /api/auth        → verify token, returns session info
 *
 * Env variables yang WAJIB diset di Vercel Dashboard:
 *   ADMIN_USERNAME        → username admin
 *   ADMIN_PASSWORD_HASH   → SHA-256 hex dari password (lowercase)
 *   SESSION_SECRET        → string random panjang (min 32 karakter)
 *
 * Cara buat hash: di browser console →
 *   crypto.subtle.digest('SHA-256', new TextEncoder().encode('passwordmu'))
 *     .then(b => console.log([...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')))
 */

const crypto = require('crypto');

/* ── token helpers ─────────────────────────────────────────── */

function signToken(username, expiresAt, secret) {
  const payload = `${username}:${expiresAt}`;
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return Buffer.from(`${payload}:${sig}`).toString('base64url');
}

function verifyToken(token, secret) {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length !== 3) return null;

    const [username, expiresAtStr, sig] = parts;
    const expiresAt = Number(expiresAtStr);

    if (Date.now() > expiresAt) return null; // expired

    const expected = crypto
      .createHmac('sha256', secret)
      .update(`${username}:${expiresAt}`)
      .digest('hex');

    // Constant-time compare to prevent timing attacks
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;

    return { username, expiresAt };
  } catch {
    return null;
  }
}

/* ── main handler ──────────────────────────────────────────── */

module.exports = async function handler(req, res) {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  // CORS: hanya izinkan origin sendiri
  const origin = req.headers.origin || '';
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const {
    ADMIN_USERNAME,
    ADMIN_PASSWORD_HASH,
    SESSION_SECRET,
  } = process.env;

  if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH || !SESSION_SECRET) {
    console.error('[auth] ENV vars missing');
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  /* ── POST /api/auth — Login ── */
  if (req.method === 'POST') {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan password wajib diisi.' });
    }

    // Hash password yang dikirim
    const submittedHash = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');

    // Constant-time compare: cegah timing attack
    const usernameMatch = username === ADMIN_USERNAME;
    let hashMatch = false;
    try {
      hashMatch = crypto.timingSafeEqual(
        Buffer.from(submittedHash),
        Buffer.from(ADMIN_PASSWORD_HASH)
      );
    } catch {
      hashMatch = false;
    }

    if (!usernameMatch || !hashMatch) {
      // Tunda 400ms untuk mencegah brute-force
      await new Promise(r => setTimeout(r, 400));
      return res.status(401).json({ error: 'Username atau password salah.' });
    }

    const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 jam
    const expiresAt = Date.now() + SESSION_DURATION;
    const token = signToken(username, expiresAt, SESSION_SECRET);

    return res.status(200).json({
      token,
      expiresAt,
      user: { username, displayName: 'Administrator', role: 'Super Admin' }
    });
  }

  /* ── GET /api/auth — Verify Token ── */
  if (req.method === 'GET') {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: 'Token tidak ditemukan.' });
    }

    const session = verifyToken(token, SESSION_SECRET);
    if (!session) {
      return res.status(401).json({ error: 'Token tidak valid atau sudah expired.' });
    }

    return res.status(200).json({
      valid: true,
      user: { username: session.username, displayName: 'Administrator', role: 'Super Admin' },
      expiresAt: session.expiresAt
    });
  }

  return res.status(405).json({ error: 'Method not allowed.' });
};

/* ── Helper yang bisa diimpor oleh API lain ── */
module.exports.verifyToken = verifyToken;
