/* ================================================================
   ai-search.js — Asmanisa Floating Chat
   - Floating window dengan glassmorphism
   - Multi-turn conversation history
   - Strip <think>...</think> dari response
   - Web search via api/ai-chat untuk data real-time
   ================================================================ */

const AI_PROXY_URL = '/api/ai-chat';

/* ────────────────────────────────────────────────────────────────
   KONTEKS STATIS FMIPA UNTAN
   ──────────────────────────────────────────────────────────────── */
const FMIPA_STATIC_CONTEXT = `
=== PORTAL RESMI: AKADEMIK & KEMAHASISWAAN FMIPA UNTAN ===

Nama Lengkap  : Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)
Universitas   : Universitas Tanjungpura (Untan)
Kota          : Pontianak, Kalimantan Barat

SUMBER DATA UTAMA — SELALU PRIORITASKAN INI:
1. Portal Akademik FMIPA (terbaru): https://ac-fmipa-portal.vercel.app
2. Portal MIPA Untan (mirror):      https://portalmipa.vercel.app
3. SEKAR (ketersediaan ruangan):    https://sekarfmipa.vercel.app
4. Website Untan:                   https://untan.ac.id

⚠️ mipa.untan.ac.id adalah domain kampus resmi tetapi JARANG DIUPDATE.
   Selalu arahkan ke ac-fmipa-portal.vercel.app untuk info terkini.

--- PROGRAM STUDI S-1 ---
Matematika, Fisika, Kimia, Biologi, Rekayasa Sistem Komputer (Siskom),
Ilmu Kelautan, Sistem Informasi (Sisfo), Statistika, Geofisika
S-2: Kimia

--- JAM LAYANAN AKADEMIK ---
Senin–Kamis : Jam kerja normal (hadir)
Jumat       : WFH — layanan via online/WhatsApp

--- LAYANAN PORTAL ---
• Bio Ijazah  → https://xandria.pduntan.id/login
• SATU UNTAN  → https://satu.untan.ac.id/gate/login
• Cek Surat   → ac-fmipa-portal.vercel.app (menu Cek Surat)
• Jenis Layanan → ac-fmipa-portal.vercel.app (via Google Form)
• SEKAR       → https://sekarfmipa.vercel.app

--- JENIS SURAT ---
Surat Keterangan Aktif Kuliah, SKL, Cuti, Pindah Kuliah, Pengunduran Diri
Proses: 1–3 hari kerja.

--- DATA 2026 ---
Mahasiswa Aktif : 2.370 | Lulus : 100
Yudisium Periode III : 27 April 2026
Wisuda Periode III   : 29–30 April 2026

--- KONTAK ---
Via WhatsApp — menu Kontak di ac-fmipa-portal.vercel.app (Senin–Jumat)
`.trim();

/* ────────────────────────────────────────────────────────────────
   BUILD CONTEXT DARI ASMANISA_KB
   ──────────────────────────────────────────────────────────────── */
function buildKBContext() {
  if (typeof window.ASMANISA_KB === 'undefined') return '';
  return window.ASMANISA_KB
    .filter(item => !['kata_kasar','pujian_diri'].includes(item.id))
    .map(item => {
      const clean = item.answer
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/gi, '$2 ($1)')
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
        .replace(/&nbsp;/g,' ').replace(/\n{3,}/g,'\n\n').trim();
      return `[${item.id}]\n${clean}`;
    }).join('\n\n');
}

/* ────────────────────────────────────────────────────────────────
   BUILD CONTEXT DARI PORTAL-DATA.JSON
   ──────────────────────────────────────────────────────────────── */
async function buildPortalDataContext() {
  try {
    const res = await fetch('/data/portal-data.json');
    if (!res.ok) return '';
    const data = await res.json();
    const parts = [];
    if (data.news?.length) {
      parts.push('=== BERITA & PENGUMUMAN TERKINI (ac-fmipa-portal.vercel.app) ===');
      data.news.forEach(n => parts.push(`• [${n.date}] ${n.text}`));
    }
    if (data.slides?.length) {
      parts.push('\n=== INFO SLIDER PORTAL ===');
      const seen = new Set();
      data.slides.filter(s => { if(seen.has(s.title)) return false; seen.add(s.title); return true; })
        .forEach(s => parts.push(`• [${s.tag}] ${s.title}${s.desc ? ': '+s.desc : ''}`));
    }
    return parts.join('\n');
  } catch { return ''; }
}

/* ────────────────────────────────────────────────────────────────
   BUILD SYSTEM PROMPT
   ──────────────────────────────────────────────────────────────── */
function buildSystemPrompt(dynamicCtx) {
  const kbCtx = buildKBContext();
  return `Kamu adalah Asmanisa, asisten virtual AI resmi Portal Akademik & Kemahasiswaan FMIPA Universitas Tanjungpura (Untan), Pontianak, Kalimantan Barat.

=== KEPRIBADIAN ===
Ramah, hangat, sedikit santai tapi sopan dan profesional. Seperti kakak tingkat yang helpful.
Boleh merespons sapaan, basa-basi, candaan ringan dengan natural. Gunakan emoji sesekali 😊

=== CARA MENJAWAB PERTANYAAN FAKTUAL ===
Jika ditanya fakta spesifik (nama rektor, dekan, pejabat, info terkini kampus, dsb) yang TIDAK ada di konteks di bawah:
→ JAWAB LANGSUNG berdasarkan pengetahuanmu tentang Universitas Tanjungpura / FMIPA.
→ Jika kamu benar-benar tidak tahu, baru sarankan cek ke ac-fmipa-portal.vercel.app atau untan.ac.id
→ JANGAN langsung menyuruh user cek website kalau kamu sebenarnya tahu jawabannya!

Contoh:
- "Siapa rektor Untan?" → jawab dengan nama yang kamu tahu, tambahkan saran verifikasi ke untan.ac.id
- "Siapa dekan FMIPA?" → jawab dengan nama yang kamu tahu jika ada di pengetahuanmu

=== SUMBER DATA PRIORITAS ===
1. ac-fmipa-portal.vercel.app (portal terbaru)
2. portalmipa.vercel.app (mirror)
3. sekarfmipa.vercel.app (ruangan)
4. untan.ac.id (info universitas)
⚠️ JANGAN rekomendasikan mipa.untan.ac.id sebagai sumber utama.

=== TOPIK DILARANG ===
Politik, SARA sensitif, kata kasar, konten vulgar.
Respons: "Hehe, itu di luar zona kenyamananku 😅 Yuk tanya seputar kampus aja!"

=== PEDOMAN FORMAT ===
• Bahasa Indonesia natural dan ramah
• Jawaban singkat & padat (2–4 paragraf)
• Gunakan bullet point jika banyak poin
• Sertakan link relevan jika tersedia

=== DATA KONTEKS PORTAL ===
${FMIPA_STATIC_CONTEXT}

${dynamicCtx ? dynamicCtx + '\n' : ''}
${kbCtx ? '=== PENGETAHUAN DETAIL LAYANAN ===\n' + kbCtx : ''}

=== INSTRUKSI AKHIR ===
Percakapan multi-turn — kamu bisa merujuk pesan sebelumnya.
PRIORITASKAN menjawab langsung daripada menyuruh cek website.
Tetap ramah dan menyenangkan! 😊`;
}

/* ────────────────────────────────────────────────────────────────
   STRIP <think>...</think> TAGS
   ──────────────────────────────────────────────────────────────── */
function stripThinkTags(text) {
  return text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
}

/* ────────────────────────────────────────────────────────────────
   FORMAT MARKDOWN → HTML
   ──────────────────────────────────────────────────────────────── */
function formatAIResponse(rawText) {
  let html = rawText
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

  html = html.replace(/(<li>.*?<\/li>(<br>)?)+/g, m =>
    '<ul style="margin:6px 0 6px 18px;line-height:1.75;">' +
    m.replace(/<br>/g,'') + '</ul>');
  return html;
}

/* ────────────────────────────────────────────────────────────────
   STATE
   ──────────────────────────────────────────────────────────────── */
let _history     = [];
let _portalCtx   = null;
let _isTyping    = false;
let _isOpen      = false;

async function getPortalContext() {
  if (_portalCtx === null) _portalCtx = await buildPortalDataContext();
  return _portalCtx;
}

/* ────────────────────────────────────────────────────────────────
   OPEN / CLOSE CHAT
   ──────────────────────────────────────────────────────────────── */
function openChat() {
  const overlay  = document.getElementById('asmaOverlay');
  const bar      = document.getElementById('asmaTriggerBar');
  if (!overlay) return;
  _isOpen = true;
  overlay.classList.add('asma--open');
  bar?.classList.add('asma-bar--hidden');
  setTimeout(() => document.getElementById('asmaInput')?.focus(), 250);
}

function closeChat() {
  const overlay = document.getElementById('asmaOverlay');
  const bar     = document.getElementById('asmaTriggerBar');
  if (!overlay) return;
  _isOpen  = false;
  _history = [];
  overlay.classList.remove('asma--open');
  bar?.classList.remove('asma-bar--hidden');

  // Reset log ke welcome screen
  setTimeout(() => {
    const log = document.getElementById('asmaLog');
    if (log) log.innerHTML = `
      <div class="asma-welcome" id="asmaWelcome">
        <div class="asma-welcome-avatar">
          <img src="assets/images/asmanisa.jpg" alt="Asmanisa">
        </div>
        <h4>Halo! Saya Asmanisa 👋</h4>
        <p>Asisten virtual FMIPA Untan. Tanyakan apa saja seputar layanan akademik, surat, beasiswa, dan info kampus!</p>
      </div>`;
    // Tampilkan kembali chips
    const chips = document.getElementById('asmaChips');
    if (chips) chips.style.display = '';
  }, 280);
}

/* ────────────────────────────────────────────────────────────────
   UI HELPERS
   ──────────────────────────────────────────────────────────────── */
function scrollToBottom() {
  const log = document.getElementById('asmaLog');
  if (log) log.scrollTop = log.scrollHeight;
}

function appendUserBubble(text) {
  const log = document.getElementById('asmaLog');
  if (!log) return;
  const div = document.createElement('div');
  div.className = 'asma-msg asma-msg--user';
  div.innerHTML = `<div class="asma-bubble asma-bubble--user">${text.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>`;
  log.appendChild(div);
  scrollToBottom();
}

function appendBotBubble() {
  const log = document.getElementById('asmaLog');
  if (!log) return null;
  const div = document.createElement('div');
  div.className = 'asma-msg asma-msg--bot';
  div.innerHTML = `
    <img class="asma-avatar" src="assets/images/asmanisa.jpg" alt="Asmanisa">
    <div class="asma-bubble asma-bubble--bot"></div>`;
  log.appendChild(div);
  scrollToBottom();
  return div.querySelector('.asma-bubble--bot');
}

function appendTyping() {
  const log = document.getElementById('asmaLog');
  if (!log) return;
  const div = document.createElement('div');
  div.className = 'asma-msg asma-msg--bot';
  div.id = 'asmaTyping';
  div.innerHTML = `
    <img class="asma-avatar" src="assets/images/asmanisa.jpg" alt="Asmanisa">
    <div class="asma-bubble asma-bubble--bot asma-typing">
      <span></span><span></span><span></span>
    </div>`;
  log.appendChild(div);
  scrollToBottom();
}

function removeTyping() { document.getElementById('asmaTyping')?.remove(); }

function setInputDisabled(val) {
  const inp = document.getElementById('asmaInput');
  const btn = document.getElementById('asmaSendBtn');
  if (inp) inp.disabled = val;
  if (btn) btn.disabled = val;
}

/* ────────────────────────────────────────────────────────────────
   STREAMING
   ──────────────────────────────────────────────────────────────── */
async function streamResponse(systemPrompt, messages, bubbleEl, onDone, onError) {
  try {
    const res = await fetch(AI_PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemPrompt, messages })
    });

    if (!res.ok) {
      let msg = `HTTP ${res.status}`;
      try { const e = await res.json(); if (e.error?.message) msg = e.error.message; } catch {}
      throw new Error(msg);
    }

    const reader  = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '', rawText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const payload = line.slice(6).trim();
        if (payload === '[DONE]') { onDone(rawText); return; }
        try {
          const parsed = JSON.parse(payload);
          const delta  = parsed.choices?.[0]?.delta?.content ?? '';
          if (delta) {
            rawText += delta;
            // Strip <think> dulu sebelum render
            const cleaned = stripThinkTags(rawText);
            bubbleEl.innerHTML = cleaned
              ? formatAIResponse(cleaned)
              : '<span style="color:#9ca3af;font-size:12px;">Memproses...</span>';
            scrollToBottom();
          }
        } catch {}
      }
    }
    onDone(rawText);
  } catch (err) {
    onError(err.message || 'Koneksi ke AI gagal.');
  }
}

/* ────────────────────────────────────────────────────────────────
   SEND MESSAGE
   ──────────────────────────────────────────────────────────────── */
async function sendMessage(text) {
  text = (text || '').trim();
  if (!text || _isTyping) return;
  _isTyping = true;

  const input = document.getElementById('asmaInput');
  if (input) { input.value = ''; input.style.height = 'auto'; }

  // Sembunyikan welcome & chips setelah pesan pertama
  document.getElementById('asmaWelcome')?.remove();
  const chips = document.getElementById('asmaChips');
  if (chips) chips.style.display = 'none';

  appendUserBubble(text);
  _history.push({ role: 'user', content: text });

  setInputDisabled(true);
  appendTyping();

  const portalCtx    = await getPortalContext();
  const systemPrompt = buildSystemPrompt(portalCtx);

  removeTyping();
  const bubble = appendBotBubble();
  if (!bubble) { _isTyping = false; setInputDisabled(false); return; }

  await streamResponse(
    systemPrompt,
    [..._history],
    bubble,
    (rawText) => {
      _isTyping = false;
      setInputDisabled(false);
      const cleaned = stripThinkTags(rawText);
      if (!cleaned) {
        bubble.innerHTML = '<em style="color:#6b7280;">Tidak ada respons. Coba ulangi.</em>';
      } else {
        bubble.innerHTML = formatAIResponse(cleaned);
        _history.push({ role: 'assistant', content: cleaned });
      }
      input?.focus();
    },
    (errMsg) => {
      _isTyping = false;
      setInputDisabled(false);
      bubble.innerHTML = `
        <div style="color:#b91c1c;display:flex;align-items:flex-start;gap:7px;">
          <span>⚠️</span>
          <div>
            <strong style="display:block;margin-bottom:2px;">Gagal menghubungi AI</strong>
            <span style="font-size:11.5px;color:#6b7280;">${errMsg}</span>
          </div>
        </div>`;
      input?.focus();
    }
  );
}

/* ────────────────────────────────────────────────────────────────
   INIT
   ──────────────────────────────────────────────────────────────── */
function initAsmanisa() {
  const triggerBtn = document.getElementById('asmaTriggerBtn');
  const triggerBar = document.getElementById('asmaTriggerBar');
  const closeBtn   = document.getElementById('asmaCloseBtn');
  const overlay    = document.getElementById('asmaOverlay');
  const sendBtn    = document.getElementById('asmaSendBtn');
  const input      = document.getElementById('asmaInput');
  const chips      = document.querySelectorAll('.asma-chip');

  if (!triggerBtn) return;

  // Buka chat
  triggerBtn.addEventListener('click', openChat);

  // Tutup via tombol X
  closeBtn?.addEventListener('click', closeChat);

  // Tutup via klik overlay (di luar window)
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeChat();
  });

  // Tutup via Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && _isOpen) closeChat();
  });

  // Send
  sendBtn?.addEventListener('click', () => sendMessage(input?.value));
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input.value); }
  });

  // Auto-resize textarea
  input?.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 110) + 'px';
  });

  // Quick chips
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.dataset.query || chip.textContent.replace(/^[\p{Emoji}\s]+/u,'').trim();
      sendMessage(q);
    });
  });

  // Prefetch context
  getPortalContext().catch(() => {});
}

document.addEventListener('DOMContentLoaded', initAsmanisa);
