/**
 * _auth-middleware.js — helper internal (tidak di-expose ke web)
 * Diimpor oleh api/save-data.js, api/upload-*.js
 *
 * Cara pakai:
 *   const { requireAuth } = require('./_auth-middleware');
 *   module.exports = async (req, res) => {
 *     if (!requireAuth(req, res)) return;
 *     // ... logic
 *   };
 */

const crypto = require('crypto');

function verifyToken(token, secret) {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length !== 3) return null;
    const [username, expiresAtStr, sig] = parts;
    const expiresAt = Number(expiresAtStr);
    if (Date.now() > expiresAt) return null;
    const expected = crypto.createHmac('sha256', secret).update(`${username}:${expiresAt}`).digest('hex');
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    return { username, expiresAt };
  } catch {
    return null;
  }
}

/**
 * Cek Authorization header.
 * Jika valid → return session object.
 * Jika tidak → kirim 401 dan return null (caller harus `return`).
 */
function requireAuth(req, res) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    res.status(500).json({ error: 'Server configuration error.' });
    return null;
  }
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: 'Autentikasi diperlukan.' });
    return null;
  }
  const session = verifyToken(token, secret);
  if (!session) {
    res.status(401).json({ error: 'Token tidak valid atau expired. Silakan login ulang.' });
    return null;
  }
  return session;
}

module.exports = { requireAuth, verifyToken };
