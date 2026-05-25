/**
 * /api/visitor.js — Vercel Serverless: Visitor Counter
 * GET  → ambil data pengunjung
 * POST → increment counter (alltime + harian)
 *
 * Data disimpan di GitHub: data/visitor-data.json
 * Format: { alltime: 0, daily: { "YYYY-MM-DD": 0 }, lastUpdated: "" }
 */

const DATA_PATH = 'data/visitor-data.json';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH = 'main' } = process.env;

  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return res.status(500).json({ error: 'ENV belum lengkap di Vercel.' });
  }

  const apiUrl    = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${DATA_PATH}`;
  const ghHeaders = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  // Helper: ambil data dari GitHub
  async function fetchData() {
    const r = await fetch(apiUrl, { headers: ghHeaders });
    if (r.status === 404) return { data: { alltime: 0, daily: {}, lastUpdated: '' }, sha: null };
    if (!r.ok) throw new Error('Gagal baca data visitor dari GitHub');
    const file = await r.json();
    return {
      data: JSON.parse(Buffer.from(file.content, 'base64').toString('utf-8')),
      sha:  file.sha,
    };
  }

  // Helper: simpan data ke GitHub
  async function saveData(data, sha) {
    const base64 = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
    const body   = {
      message: `visitor update: ${new Date().toISOString()}`,
      content: base64,
      branch:  GITHUB_BRANCH,
    };
    if (sha) body.sha = sha;

    const r = await fetch(apiUrl, {
      method: 'PUT',
      headers: { ...ghHeaders, 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });
    if (!r.ok) {
      const err = await r.json();
      throw new Error('Gagal simpan: ' + (err.message || JSON.stringify(err)));
    }
  }

  // ── GET: baca saja ──────────────────────────────────
  if (req.method === 'GET') {
    try {
      const { data } = await fetchData();
      const today    = new Date().toISOString().slice(0, 10);
      return res.status(200).json({
        alltime: data.alltime || 0,
        today:   (data.daily || {})[today] || 0,
        lastUpdated: data.lastUpdated || null,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ── POST: increment ─────────────────────────────────
  if (req.method === 'POST') {
    try {
      const { data, sha } = await fetchData();
      const today         = new Date().toISOString().slice(0, 10);

      data.alltime         = (data.alltime || 0) + 1;
      data.daily           = data.daily || {};
      data.daily[today]    = (data.daily[today] || 0) + 1;
      data.lastUpdated     = new Date().toISOString();

      // Hapus data harian yang lebih dari 30 hari (bersih-bersih)
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      for (const d of Object.keys(data.daily)) {
        if (new Date(d) < cutoff) delete data.daily[d];
      }

      await saveData(data, sha);
      return res.status(200).json({
        alltime: data.alltime,
        today:   data.daily[today],
        lastUpdated: data.lastUpdated,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
