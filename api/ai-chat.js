/**
 * /api/ai-chat.js — Vercel Serverless Function
 * Proxy ke Kimchi.dev API dengan streaming SSE.
 * API key disimpan aman di Vercel Environment Variables.
 *
 * Env variable yang WAJIB diset di Vercel Dashboard:
 *   CASTAI_API_KEY   → API key dari https://app.kimchi.dev
 *   ALLOWED_ORIGINS  → URL site kamu, contoh: https://portalmipa.vercel.app
 */

const AI_MODEL   = 'minimax-m2.7';
const AI_API_URL = 'https://llm.kimchi.dev/openai/v1/chat/completions';

module.exports = async function handler(req, res) {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  // CORS — hanya izinkan origin sendiri
  const origin = req.headers.origin || '';
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',').map(s => s.trim()).filter(Boolean);

  if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  } else {
    return res.status(403).json({ error: 'Origin tidak diizinkan.' });
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  // Ambil API key dari ENV (aman, tidak pernah ke browser)
  const apiKey = process.env.CASTAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key belum dikonfigurasi di server.' });
  }

  const { messages, systemPrompt } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Field "messages" (array) wajib ada.' });
  }

  // Bangun array messages lengkap dengan system prompt
  const fullMessages = systemPrompt
    ? [{ role: 'system', content: systemPrompt }, ...messages]
    : messages;

  try {
    const upstream = await fetch(AI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: AI_MODEL,
        stream: true,
        max_tokens: 1024,
        temperature: 0.5,
        messages: fullMessages
      })
    });

    if (!upstream.ok) {
      let errMsg = `HTTP ${upstream.status}`;
      let errRaw = '';
      try {
        errRaw = await upstream.text();
        const errData = JSON.parse(errRaw);
        if (errData.error?.message) errMsg = errData.error.message;
        else if (errData.message) errMsg = errData.message;
      } catch { errMsg = errRaw || errMsg; }
      console.error('[ai-chat] upstream error', upstream.status, errRaw);
      return res.status(upstream.status).json({ error: errMsg, raw: errRaw });
    }

    // Stream SSE response langsung ke browser
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value, { stream: true }));
    }

    res.end();

  } catch (err) {
    // Kalau header SSE belum dikirim, kirim JSON error
    if (!res.headersSent) {
      return res.status(500).json({ error: err.message || 'Koneksi ke AI gagal.' });
    }
    res.end();
  }
};
