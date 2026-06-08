/**
 * /api/save-data.js — Vercel Serverless Function
 * GET  → baca data portal-data.json dari GitHub (publik)
 * POST → simpan data (✅ Dilindungi: wajib Bearer token)
 */

const { requireAuth } = require('./_auth-middleware');
const DATA_PATH = 'public/data/portal-data.json';

module.exports = async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  const origin = req.headers.origin || '';
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH = 'main' } = process.env;

  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return res.status(500).json({ error: 'ENV belum lengkap di Vercel.' });
  }

  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${DATA_PATH}`;
  const ghHeaders = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  };

  // ── GET ──────────────────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const ghRes = await fetch(apiUrl, { headers: ghHeaders });
      if (ghRes.status === 404) {
        return res.status(200).json({ slides: [], news: [], initialized: false });
      }
      if (!ghRes.ok) return res.status(500).json({ error: 'Gagal baca data dari GitHub' });

      const file = await ghRes.json();

      // Decode base64 → Buffer (handle UTF-16 LE & UTF-8)
      const buf = Buffer.from(file.content, 'base64');

      let str;
      // Cek BOM UTF-16 LE: FF FE
      if (buf[0] === 0xFF && buf[1] === 0xFE) {
        str = buf.slice(2).toString('utf16le');
      }
      // Cek BOM UTF-16 BE: FE FF
      else if (buf[0] === 0xFE && buf[1] === 0xFF) {
        str = buf.slice(2).swap16().toString('utf16le');
      }
      // Cek BOM UTF-8: EF BB BF
      else if (buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
        str = buf.slice(3).toString('utf-8');
      }
      else {
        str = buf.toString('utf-8');
      }

      // Bersihkan CRLF dan whitespace
      str = str.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();

      return res.status(200).json(JSON.parse(str));
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ── POST ─────────────────────────────────────────────────────
  if (req.method === 'POST') {
    if (!requireAuth(req, res)) return;

    try {
      const { slides, news } = req.body;
      if (!slides || !news) return res.status(400).json({ error: 'slides dan news wajib ada' });

      let sha;
      const checkRes = await fetch(apiUrl, { headers: ghHeaders });
      if (checkRes.ok) { sha = (await checkRes.json()).sha; }

      const data = { slides, news, updatedAt: new Date().toISOString() };
      // Selalu simpan sebagai UTF-8 murni tanpa BOM
      const base64Content = Buffer.from(JSON.stringify(data, null, 2), 'utf-8').toString('base64');

      const saveRes = await fetch(apiUrl, {
        method: 'PUT',
        headers: { ...ghHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Update data: ${new Date().toLocaleString('id-ID')}`,
          content: base64Content,
          branch: GITHUB_BRANCH,
          ...(sha && { sha })
        })
      });

      if (!saveRes.ok) {
        const err = await saveRes.json();
        return res.status(500).json({ error: 'Gagal simpan: ' + (err.message || JSON.stringify(err)) });
      }

      return res.status(200).json({ success: true, message: 'Data berhasil disimpan ke GitHub' });

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
