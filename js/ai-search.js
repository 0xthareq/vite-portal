/* ================================================================
   ai-search.js — Asmanisa Chat
   Input bar sticky bawah → overlay panel percakapan muncul di atas
   ================================================================ */

const AI_PROXY_URL = '/api/ai-chat';

const FMIPA_STATIC_CONTEXT = `
=== PORTAL RESMI: AKADEMIK & KEMAHASISWAAN FMIPA UNTAN ===
Nama Lengkap  : Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)
Universitas   : Universitas Tanjungpura (Untan), Pontianak, Kalimantan Barat

SUMBER DATA UTAMA:
1. Portal terbaru : https://ac-fmipa-portal.vercel.app
2. Mirror portal  : https://portalmipa.vercel.app
3. SEKAR ruangan  : https://sekarfmipa.vercel.app
4. Universitas    : https://untan.ac.id
⚠️ mipa.untan.ac.id jarang diupdate — arahkan ke ac-fmipa-portal.vercel.app.

PROGRAM STUDI S-1: Matematika, Fisika, Kimia, Biologi, Siskom, Ilmu Kelautan,
Sisfo, Statistika, Geofisika. S-2: Kimia.

JAM LAYANAN: Senin–Kamis (kantor) | Jumat WFH via online/WhatsApp.

LAYANAN: Bio Ijazah → xandria.pduntan.id | SATU UNTAN → satu.untan.ac.id
Cek Surat & Jenis Layanan → ac-fmipa-portal.vercel.app | SEKAR → sekarfmipa.vercel.app

SURAT: Aktif Kuliah, SKL, Cuti, Pindah, Pengunduran Diri. Proses 1–3 hari kerja.

DATA 2026: Mahasiswa Aktif 2.370 | Lulus 100
Yudisium Periode III: 27 April 2026 | Wisuda: 29–30 April 2026

KONTAK: WhatsApp via menu Kontak di ac-fmipa-portal.vercel.app (Senin–Jumat)
`.trim();

/* ──────────────────────────────────────────────────────────────── */
function buildKBContext() {
  if (typeof window.ASMANISA_KB === 'undefined') return '';
  return window.ASMANISA_KB
    .filter(i => !['kata_kasar','pujian_diri'].includes(i.id))
    .map(i => {
      const c = i.answer
        .replace(/<br\s*\/?>/gi,'\n')
        .replace(/<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/gi,'$2 ($1)')
        .replace(/<[^>]+>/g,'')
        .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
        .replace(/&nbsp;/g,' ').replace(/\n{3,}/g,'\n\n').trim();
      return `[${i.id}]\n${c}`;
    }).join('\n\n');
}

async function buildPortalDataContext() {
  try {
    const r = await fetch('/data/portal-data.json');
    if (!r.ok) return '';
    const d = await r.json();
    const p = [];
    if (d.news?.length) {
      p.push('=== BERITA TERKINI (ac-fmipa-portal.vercel.app) ===');
      d.news.forEach(n => p.push(`• [${n.date}] ${n.text}`));
    }
    if (d.slides?.length) {
      p.push('\n=== INFO SLIDER ===');
      const seen = new Set();
      d.slides.filter(s => { if(seen.has(s.title)) return false; seen.add(s.title); return true; })
        .forEach(s => p.push(`• [${s.tag}] ${s.title}${s.desc?': '+s.desc:''}`));
    }
    return p.join('\n');
  } catch { return ''; }
}

function buildSystemPrompt(dynCtx) {
  const kbCtx = buildKBContext();
  return `Kamu adalah Asmanisa, asisten virtual AI Portal Akademik & Kemahasiswaan FMIPA Universitas Tanjungpura (Untan), Pontianak.

KEPRIBADIAN: Ramah, hangat, natural. Seperti kakak tingkat yang helpful. Pakai emoji sesekali 😊. Jangan kaku atau robotic.

CARA MENJAWAB:
- Jawab natural layaknya AI asisten pintar — tidak harus selalu soal kampus
- Pertanyaan umum (hari libur, presiden, info dunia, dll) → jawab langsung dari pengetahuanmu
- Pertanyaan soal FMIPA/Untan → prioritaskan data di bawah ini
- Jangan paksa redirect ke website kalau kamu sudah tahu jawabannya
- Hanya arahkan ke website jika info memang perlu dikonfirmasi atau tidak tersedia

TOPIK SENSITIF (Politik, SARA, konten vulgar): tolak dengan santai dan ajak balik ke topik kampus.

FORMAT: Bahasa Indonesia natural, singkat & padat. Bullet point hanya jika memang perlu.

=== DATA REFERENSI FMIPA UNTAN ===
${FMIPA_STATIC_CONTEXT}
${dynCtx ? '\n' + dynCtx : ''}
${kbCtx ? '\n=== DETAIL DATA PEGAWAI & LAYANAN ===\n' + kbCtx : ''}

Ingat konteks percakapan sebelumnya. Tetap ramah dan helpful! 😊`;
}

/* ──────────────────────────────────────────────────────────────── */
function stripThink(t) {
  // Hapus blok <think>...</think> yang sudah selesai
  let result = t.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  // Kalau masih ada <think> yang belum ditutup (streaming blm selesai), potong dari sana
  const openIdx = result.search(/<think>/i);
  if (openIdx !== -1) result = result.slice(0, openIdx).trim();
  return result;
}

function fmt(raw) {
  let h = raw
    .replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\*\*([^*\n]+)\*\*/g,'<strong>$1</strong>')
    .replace(/__([^_\n]+)__/g,'<strong>$1</strong>')
    .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g,'<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:var(--primary,#2589e9);font-weight:600;">$1</a>')
    .replace(/`([^`\n]+)`/g,
      '<code style="background:#f3f4f6;padding:1px 5px;border-radius:4px;font-size:12px;font-family:monospace;">$1</code>')
    .replace(/^[•\-\*]\s+(.+)$/gm,'<li>$1</li>')
    .replace(/^\d+\.\s+(.+)$/gm,'<li>$1</li>')
    .replace(/\n/g,'<br>');
  h = h.replace(/(<li>.*?<\/li>(<br>)?)+/g, m =>
    '<ul style="margin:5px 0 5px 17px;line-height:1.7;">' + m.replace(/<br>/g,'') + '</ul>');
  return h;
}

/* ──────────────────────────────────────────────────────────────── */
let _history   = [];
let _portalCtx = null;
let _isTyping  = false;
let _isOpen    = false;

async function getCtx() {
  if (_portalCtx === null) _portalCtx = await buildPortalDataContext();
  return _portalCtx;
}

/* ── OPEN / CLOSE ────────────────────────────────────────────── */
function openOverlay() {
  if (_isOpen) return;
  _isOpen = true;
  document.getElementById('asmaOverlay')?.classList.add('asma--open');
  // Sembunyikan chips setelah ada percakapan
  scrollLog();
}

function closeOverlay() {
  _isOpen  = false;
  _history = [];
  document.getElementById('asmaOverlay')?.classList.remove('asma--open');

  // Reset log
  const log = document.getElementById('asmaLog');
  if (log) log.innerHTML = '';

  // Tampilkan kembali chips
  const chips = document.getElementById('asmaChips');
  if (chips) chips.style.display = '';

  // Focus input bar
  setTimeout(() => document.getElementById('asmaInput')?.focus(), 200);
}

/* ── UI HELPERS ──────────────────────────────────────────────── */
function scrollLog() {
  const l = document.getElementById('asmaLog');
  if (l) l.scrollTop = l.scrollHeight;
}

function addUserBubble(text) {
  const log = document.getElementById('asmaLog');
  if (!log) return;
  const d = document.createElement('div');
  d.className = 'asma-msg asma-msg--user';
  d.innerHTML = `<div class="asma-bubble asma-bubble--user">${text.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>`;
  log.appendChild(d);
  scrollLog();
}

function addBotBubble() {
  const log = document.getElementById('asmaLog');
  if (!log) return null;
  const d = document.createElement('div');
  d.className = 'asma-msg asma-msg--bot';
  d.innerHTML = `<img class="asma-avatar" src="assets/images/asmanisa.jpg" alt="Asmanisa">
    <div class="asma-bubble asma-bubble--bot"></div>`;
  log.appendChild(d);
  scrollLog();
  return d.querySelector('.asma-bubble--bot');
}

function addTyping() {
  const log = document.getElementById('asmaLog');
  if (!log) return;
  const d = document.createElement('div');
  d.className = 'asma-msg asma-msg--bot';
  d.id = 'asmaTyping';
  d.innerHTML = `<img class="asma-avatar" src="assets/images/asmanisa.jpg" alt="Asmanisa">
    <div class="asma-bubble asma-bubble--bot asma-typing"><span></span><span></span><span></span></div>`;
  log.appendChild(d);
  scrollLog();
}

function rmTyping() { document.getElementById('asmaTyping')?.remove(); }

function setDisabled(v) {
  const i = document.getElementById('asmaInput');
  const b = document.getElementById('asmaSendBtn');
  if (i) i.disabled = v;
  if (b) b.disabled = v;
}

/* ── STREAM ──────────────────────────────────────────────────── */
async function streamResp(sysPrompt, msgs, bubble, onDone, onErr) {
  try {
    const res = await fetch(AI_PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemPrompt: sysPrompt, messages: msgs })
    });
    if (!res.ok) {
      let m = `HTTP ${res.status}`;
      try { const e = await res.json(); if(e.error?.message) m = e.error.message; } catch {}
      throw new Error(m);
    }
    const reader = res.body.getReader();
    const dec    = new TextDecoder();
    let buf = '', raw = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split('\n');
      buf = lines.pop() ?? '';
      for (const ln of lines) {
        if (!ln.startsWith('data: ')) continue;
        const pay = ln.slice(6).trim();
        if (pay === '[DONE]') { onDone(raw); return; }
        try {
          const p = JSON.parse(pay);
          const d = p.choices?.[0]?.delta?.content ?? '';
          if (d) {
            raw += d;
            const clean = stripThink(raw);
            // Token pertama datang — hapus typing indicator, tampilkan bubble
            if (bubble.parentElement.style.display === 'none') {
              rmTyping();
              bubble.parentElement.style.display = '';
            }
            if (clean) {
              bubble.classList.remove('asma-bubble--thinking');
              bubble.innerHTML = fmt(clean);
            } else {
              // Masih di dalam <think> — tetap tampilkan typing dots
              bubble.classList.add('asma-bubble--thinking');
              bubble.innerHTML = '<span class="asma-think-dots"><span></span><span></span><span></span></span>';
            }
            scrollLog();
          }
        } catch {}
      }
    }
    onDone(raw);
  } catch(e) { onErr(e.message || 'Koneksi gagal.'); }
}

/* ── SEND ────────────────────────────────────────────────────── */
async function send(text) {
  text = (text || '').trim();
  if (!text || _isTyping) return;
  _isTyping = true;

  const input = document.getElementById('asmaInput');
  if (input) { input.value = ''; input.style.height = 'auto'; }

  // Buka overlay kalau belum
  openOverlay();

  // Sembunyikan chips
  const chips = document.getElementById('asmaChips');
  if (chips) chips.style.display = 'none';

  addUserBubble(text);
  _history.push({ role:'user', content:text });
  setDisabled(true);
  addTyping();

  const ctx    = await getCtx();
  const sysPr  = buildSystemPrompt(ctx);

  const bubble = addBotBubble();
  if (!bubble) { _isTyping = false; setDisabled(false); return; }
  bubble.parentElement.style.display = 'none'; // sembunyikan dulu

  await streamResp(sysPr, [..._history], bubble,
    (raw) => {
      _isTyping = false;
      setDisabled(false);
      rmTyping();
      bubble.parentElement.style.display = '';
      const c = stripThink(raw);
      bubble.innerHTML = c ? fmt(c) : '<em style="color:#6b7280">Tidak ada respons.</em>';
      if (c) _history.push({ role:'assistant', content:c });
      input?.focus();
    },
    (err) => {
      _isTyping = false;
      setDisabled(false);
      rmTyping();
      bubble.parentElement.style.display = '';
      bubble.innerHTML = `<div style="color:#b91c1c;display:flex;gap:7px;align-items:flex-start">
        <span>⚠️</span>
        <div><strong style="display:block;margin-bottom:2px">Gagal</strong>
        <span style="font-size:11.5px;color:#6b7280">${err}</span></div></div>`;
      input?.focus();
    }
  );
}

/* ── INIT ────────────────────────────────────────────────────── */
function init() {
  const input   = document.getElementById('asmaInput');
  const sendBtn = document.getElementById('asmaSendBtn');
  const closeBtn = document.getElementById('asmaCloseBtn');
  const overlay  = document.getElementById('asmaOverlay');
  const chips    = document.querySelectorAll('.asma-chip');

  if (!input) return;

  // Send
  sendBtn?.addEventListener('click', () => send(input.value));
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input.value); }
  });

  // Auto-resize
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 100) + 'px';
  });

  // Close
  closeBtn?.addEventListener('click', closeOverlay);
  overlay?.addEventListener('click', e => { if (e.target === overlay) closeOverlay(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && _isOpen) closeOverlay(); });

  // Chips — klik chip = send langsung
  chips.forEach(c => {
    c.addEventListener('click', () => {
      const q = c.dataset.query || c.textContent.replace(/^[\p{Emoji}\s]+/u,'').trim();
      send(q);
    });
  });

  // Prefetch
  getCtx().catch(() => {});
}

document.addEventListener('DOMContentLoaded', init);

