/**
 * /api/get-file.js — Vercel Serverless Function
 * Proxy file dari private GitHub repo (gambar & PDF).
 * Tidak perlu auth — hanya membaca file yang sudah tersimpan di repo.
 *
 * Penggunaan: GET /api/get-file?path=assets/images/nama-file.jpg
 */

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH = 'main' } = process.env;
  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return res.status(500).json({ error: 'ENV belum lengkap di Vercel.' });
  }

  const filePath = req.query.path;
  if (!filePath) {
    return res.status(400).json({ error: 'Query param "path" wajib ada.' });
  }

  // Keamanan: hanya izinkan akses ke folder assets/
  const allowedPrefixes = ['assets/images/', 'assets/pdf/'];
  const isAllowed = allowedPrefixes.some(prefix => filePath.startsWith(prefix));
  if (!isAllowed) {
    return res.status(403).json({ error: 'Akses ditolak.' });
  }

  // Keamanan: cegah path traversal
  if (filePath.includes('..') || filePath.includes('//')) {
    return res.status(400).json({ error: 'Path tidak valid.' });
  }

  try {
    const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`;
    const ghRes = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.raw+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    if (ghRes.status === 404) {
      return res.status(404).json({ error: 'File tidak ditemukan.' });
    }
    if (!ghRes.ok) {
      return res.status(500).json({ error: 'Gagal mengambil file dari GitHub.' });
    }

    // Deteksi Content-Type dari ekstensi file
    const ext = filePath.split('.').pop().toLowerCase();
    const contentTypeMap = {
      jpg: 'image/jpeg', jpeg: 'image/jpeg',
      png:  'image/png',
      gif:  'image/gif',
      webp: 'image/webp',
      pdf:  'application/pdf',
      svg:  'image/svg+xml'
    };
    const contentType = contentTypeMap[ext] || 'application/octet-stream';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // cache 1 hari
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // Stream body langsung ke response
    const buffer = await ghRes.arrayBuffer();
    res.status(200).send(Buffer.from(buffer));

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
