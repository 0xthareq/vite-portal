
// ═══════════════════════════════════════════════════════════════════
// API key disimpan aman di Vercel ENV — tidak pernah ada di sini.
// Semua request AI dikirim ke /api/ai-chat (serverless proxy).
// ═══════════════════════════════════════════════════════════════════

const AI_PROXY_URL = '/api/ai-chat';

/* ────────────────────────────────────────────────────────────────
   KONTEKS STATIS FMIPA UNTAN (RAG — Sumber 1)
   ──────────────────────────────────────────────────────────────── */
const FMIPA_STATIC_CONTEXT = `
=== PORTAL RESMI: AKADEMIK & KEMAHASISWAAN FMIPA UNTAN ===

Nama Lengkap: Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)
Universitas: Universitas Tanjungpura (Untan)
Kota: Pontianak, Kalimantan Barat
Website Resmi FMIPA: https://mipa.untan.ac.id
Website Universitas: https://untan.ac.id
SEKAR (Sistem Ketersediaan Ruang): https://sekarfmipa.vercel.app
Kemendiktisaintek: https://www.kemdikbud.go.id (info beasiswa, kebijakan pendidikan nasional)

--- PROGRAM STUDI FMIPA UNTAN ---
S-1: Matematika, Fisika, Kimia, Biologi, Rekayasa Sistem Komputer (Siskom),
     Ilmu Kelautan, Sistem Informasi (Sisfo), Statistika, Geofisika
S-2: Kimia
Website prodi masing-masing tersedia di menu Web Prodi pada mipa.untan.ac.id

--- JAM LAYANAN AKADEMIK ---
• Senin–Kamis : Jam kerja normal (hadir di kantor)
• Jumat       : WFH (Work From Home) — layanan via online/WhatsApp

--- LAYANAN UTAMA PORTAL ---
1. Bio Ijazah     → https://xandria.pduntan.id/login
2. SATU UNTAN     → https://satu.untan.ac.id/gate/login
3. Cek Surat      → halaman ceksurat.html di portal ini
4. Jenis Layanan  → via menu Jenis Layanan di portal (Google Form)
5. SEKAR          → https://sekarfmipa.vercel.app

--- JENIS SURAT YANG DAPAT DIAJUKAN ---
Semua pengajuan via Google Form di menu Jenis Layanan.
• Surat Keterangan Aktif Kuliah
• Surat Keterangan Lulus (SKL)
• Surat Permohonan Cuti Kuliah
• Surat Pengunduran Diri
• Surat Permohonan Pindah Kuliah
Proses: 1–3 hari kerja setelah pengajuan diverifikasi oleh staf.

--- STATISTIK MAHASISWA 2026 ---
• Mahasiswa Aktif : 2.370 orang
• Mahasiswa Lulus : 100 orang (data terkini)

--- WISUDA & YUDISIUM T.A 2025/2026 ---
• Yudisium Periode III : 27 April 2026
• Wisuda Periode III   : 29–30 April 2026

--- KEMAHASISWAAN ---
• Organisasi Mahasiswa: mipa.untan.ac.id/kemahasiswaan/organisasi-mahasiswa
• Beasiswa (termasuk LPDP, KIP Kuliah, dll): mipa.untan.ac.id/kemahasiswaan/beasiswa

--- KONTAK ---
Via WhatsApp — buka menu Kontak di portal.
Aktif Senin–Jumat pada jam kerja.

--- VISI FMIPA UNTAN ---
"Menjadi institusi unggul dalam transformasi, pengembangan dan penyebarluasan
sains dan teknologi berbasis lingkungan tropis dengan luaran berdaya saing global."
`.trim();

/* ────────────────────────────────────────────────────────────────
   BUILD CONTEXT DARI ASMANISA_KB
   ──────────────────────────────────────────────────────────────── */
function buildKBContext() {
  if (typeof window.ASMANISA_KB === 'undefined') return '';
  const skipIds = ['kata_kasar', 'pujian_diri'];
  return window.ASMANISA_KB
    .filter(item => !skipIds.includes(item.id))
    .map(item => {
      const clean = item.answer
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/gi, '$2 ($1)')
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
      return `[${item.id}]\n${clean}`;
    })
    .join('\n\n');
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
      parts.push('=== BERITA & PENGUMUMAN TERKINI ===');
      data.news.forEach(n => parts.push(`• [${n.date}] ${n.text}`));
    }
    if (data.slides?.length) {
      parts.push('\n=== INFO PENGUMUMAN (DARI SLIDER PORTAL) ===');
      const seen = new Set();
      data.slides.filter(s => { if (seen.has(s.title)) return false; seen.add(s.title); return true; })
        .forEach(s => parts.push(`• [${s.tag}] ${s.title}${s.desc ? ': ' + s.desc : ''}`));
    }
    return parts.join('\n');
  } catch { return ''; }
}

/* ────────────────────────────────────────────────────────────────
   BUILD SYSTEM PROMPT
   ──────────────────────────────────────────────────────────────── */
function buildSystemPrompt(dynamicContext) {
  const kbCtx = buildKBContext();
  return `Kamu adalah Asmanisa, asisten virtual AI resmi Portal Akademik & Kemahasiswaan FMIPA (Fakultas Matematika dan Ilmu Pengetahuan Alam) Universitas Tanjungpura (Untan), Pontianak, Kalimantan Barat.

=== KEPRIBADIAN ===
Kamu ramah, hangat, sedikit santai tapi tetap sopan dan profesional — seperti kakak tingkat yang helpful.
Boleh merespons sapaan, perkenalan, basa-basi, candaan ringan, gombalan lucu, atau pujian dengan natural dan menyenangkan.
Gunakan emoji sesekali supaya terasa lebih hidup 😊

=== TOPIK YANG BOLEH DIJAWAB ===
1. Semua hal tentang FMIPA Untan & Universitas Tanjungpura
2. Kebijakan pendidikan tinggi nasional dari Kemendiktisaintek
3. Sapaan, perkenalan, basa-basi, candaan ringan, dan percakapan biasa yang sopan
4. Pertanyaan umum tentang dunia perkuliahan, tips belajar, kehidupan mahasiswa

=== TOPIK YANG TIDAK BOLEH DIJAWAB ===
❌ Politik, SARA sensitif, kata-kata kasar, konten vulgar
Jika ada topik terlarang: "Hehe, itu di luar zona kenyamananku 😅 Yuk tanya seputar kampus aja!"

=== PEDOMAN MENJAWAB ===
• Bahasa Indonesia natural, ramah, mudah dipahami
• Jawaban singkat & padat — 2–4 paragraf
• Gunakan bullet point jika ada banyak poin
• Sertakan link relevan jika tersedia di konteks
• Jangan mengarang informasi — jika tidak tahu, akui dan arahkan ke kontak resmi

=== DATA RESMI PORTAL & FMIPA UNTAN ===

${FMIPA_STATIC_CONTEXT}

${dynamicContext ? dynamicContext + '\n' : ''}
${kbCtx ? '=== PENGETAHUAN DETAIL LAYANAN ===\n' + kbCtx : ''}

=== INSTRUKSI AKHIR ===
Jawab dengan akurat, hangat, dan ringkas. Ini adalah percakapan multi-turn — kamu bisa merujuk ke pesan sebelumnya jika relevan. Tetap jaga kepribadian ramah dan menyenangkan! 😊`;
}

/* ────────────────────────────────────────────────────────────────
   FORMAT MARKDOWN → HTML
   ──────────────────────────────────────────────────────────────── */
function formatAIResponse(rawText) {
  let html = rawText
    .replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_\n]+)__/g, '<strong>$1</strong>')
    .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:var(--primary,#2589e9);font-weight:600;">$1</a>')
    .replace(/`([^`\n]+)`/g,
      '<code style="background:#f3f4f6;padding:1px 5px;border-radius:4px;font-size:12.5px;font-family:monospace;">$1</code>')
    .replace(/^[•\-\*]\s+(.+)$/gm, '<li>$1</li>')
    .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
    .replace(/\n/g, '<br>');

  html = html.replace(/(<li>.*?<\/li>(<br>)?)+/g, match =>
    '<ul style="margin:6px 0 6px 18px;line-height:1.75;">' +
    match.replace(/<br>/g, '') + '</ul>');
  return html;
}

/* ────────────────────────────────────────────────────────────────
   CONVERSATION STATE
   ──────────────────────────────────────────────────────────────── */
let _conversationHistory = [];  // array of {role, content}
let _portalContext = null;
let _isTyping = false;

async function getPortalContext() {
  if (_portalContext === null) _portalContext = await buildPortalDataContext();
  return _portalContext;
}

/* ────────────────────────────────────────────────────────────────
   UI HELPERS — RENDER CHAT MESSAGES
   ──────────────────────────────────────────────────────────────── */

function getChatLog() {
  return document.getElementById('aiChatLog');
}

function scrollToBottom() {
  const log = getChatLog();
  if (log) log.scrollTop = log.scrollHeight;
}

/** Tambah bubble user */
function appendUserBubble(text) {
  const log = getChatLog();
  if (!log) return;
  const div = document.createElement('div');
  div.className = 'aic-msg aic-msg--user';
  div.innerHTML = `<div class="aic-bubble aic-bubble--user">${text.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>`;
  log.appendChild(div);
  scrollToBottom();
}

/** Tambah bubble bot kosong, return elemen bubble untuk diisi streaming */
function appendBotBubble() {
  const log = getChatLog();
  if (!log) return null;
  const div = document.createElement('div');
  div.className = 'aic-msg aic-msg--bot';
  div.innerHTML = `
    <img class="aic-avatar" src="assets/images/asmanisa.jpg" alt="Asmanisa">
    <div class="aic-bubble aic-bubble--bot"></div>`;
  log.appendChild(div);
  scrollToBottom();
  return div.querySelector('.aic-bubble--bot');
}

/** Tambah bubble typing dots */
function appendTypingIndicator() {
  const log = getChatLog();
  if (!log) return;
  const div = document.createElement('div');
  div.className = 'aic-msg aic-msg--bot';
  div.id = 'aic-typing';
  div.innerHTML = `
    <img class="aic-avatar" src="assets/images/asmanisa.jpg" alt="Asmanisa">
    <div class="aic-bubble aic-bubble--bot aic-typing-bubble">
      <span></span><span></span><span></span>
    </div>`;
  log.appendChild(div);
  scrollToBottom();
}

function removeTypingIndicator() {
  document.getElementById('aic-typing')?.remove();
}

function setInputState(disabled) {
  const input = document.getElementById('aiChatInput');
  const btn   = document.getElementById('aiChatSend');
  if (input) input.disabled = disabled;
  if (btn)   btn.disabled   = disabled;
}

/* ────────────────────────────────────────────────────────────────
   STREAMING API CALL
   ──────────────────────────────────────────────────────────────── */
async function streamAIResponse(systemPrompt, messages, bubbleEl, onDone, onError) {
  try {
    const response = await fetch(AI_PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemPrompt, messages })
    });

    if (!response.ok) {
      let errMsg = `Gagal: HTTP ${response.status}`;
      try {
        const errData = await response.json();
        if (errData.error?.message) errMsg = errData.error.message;
      } catch { /* ignore */ }
      throw new Error(errMsg);
    }

    const reader  = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer    = '';
    let rawText   = '';

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
            bubbleEl.innerHTML = formatAIResponse(rawText);
            scrollToBottom();
          }
        } catch { /* skip */ }
      }
    }
    onDone(rawText);

  } catch (err) {
    onError(err.message || 'Terjadi kesalahan koneksi ke AI.');
  }
}

/* ────────────────────────────────────────────────────────────────
   MAIN: SEND MESSAGE
   ──────────────────────────────────────────────────────────────── */
async function sendChatMessage(text) {
  text = (text || '').trim();
  if (!text || _isTyping) return;

  _isTyping = true;

  // Clear input
  const input = document.getElementById('aiChatInput');
  if (input) { input.value = ''; input.style.height = 'auto'; }

  // Sembunyikan welcome screen kalau masih ada
  const welcome = document.getElementById('aiChatWelcome');
  if (welcome) welcome.style.display = 'none';

  // Render user bubble
  appendUserBubble(text);

  // Tambah ke history
  _conversationHistory.push({ role: 'user', content: text });

  // Tampilkan typing indicator
  setInputState(true);
  appendTypingIndicator();

  // Bangun system prompt
  const portalCtx    = await getPortalContext();
  const systemPrompt = buildSystemPrompt(portalCtx);

  // Semua messages history (bukan cuma 1 pesan)
  const messages = [..._conversationHistory];

  // Hapus typing, munculkan bubble bot kosong
  removeTypingIndicator();
  const botBubble = appendBotBubble();

  if (!botBubble) { _isTyping = false; setInputState(false); return; }

  await streamAIResponse(
    systemPrompt,
    messages,
    botBubble,

    // onDone
    (rawText) => {
      _isTyping = false;
      setInputState(false);
      if (!rawText.trim()) {
        botBubble.innerHTML = '<em style="color:#6b7280;">Tidak ada respons. Coba ulangi.</em>';
      } else {
        // Simpan jawaban bot ke history
        _conversationHistory.push({ role: 'assistant', content: rawText });
      }
      input?.focus();
    },

    // onError
    (errMsg) => {
      _isTyping = false;
      setInputState(false);
      botBubble.innerHTML = `
        <div style="color:#b91c1c;display:flex;align-items:flex-start;gap:7px;">
          <span>⚠️</span>
          <div>
            <strong style="display:block;margin-bottom:3px;">Gagal menghubungi AI</strong>
            <span style="font-size:12px;color:#6b7280;">${errMsg}</span>
          </div>
        </div>`;
      input?.focus();
    }
  );
}

/* ────────────────────────────────────────────────────────────────
   INIT
   ──────────────────────────────────────────────────────────────── */
function initAIChat() {
  const input    = document.getElementById('aiChatInput');
  const sendBtn  = document.getElementById('aiChatSend');
  const chips    = document.querySelectorAll('.ai-chip');

  if (!input) return;

  // Auto-resize textarea
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  });

  // Send via button
  sendBtn?.addEventListener('click', () => sendChatMessage(input.value));

  // Send via Enter (Shift+Enter = newline)
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage(input.value);
    }
  });

  // Quick chips
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.dataset.query || chip.textContent.replace(/^[\p{Emoji}\s]+/u, '').trim();
      sendChatMessage(q);
    });
  });

  // Prefetch context
  getPortalContext().catch(() => {});
}

document.addEventListener('DOMContentLoaded', initAIChat);
