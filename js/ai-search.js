const AI_PROXY_URL = '/api/ai-chat';

/* ────────────────────────────────────────────────────────────────
   KONTEKS STATIS FMIPA UNTAN
   ──────────────────────────────────────────────────────────────── */
const FMIPA_STATIC_CONTEXT = `
=== PORTAL RESMI: AKADEMIK & KEMAHASISWAAN FMIPA UNTAN ===

Nama Lengkap: Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)
Universitas: Universitas Tanjungpura (Untan)
Kota: Pontianak, Kalimantan Barat

SUMBER DATA UTAMA (SELALU PRIORITASKAN INI):
- Portal Akademik & Kemahasiswaan FMIPA: https://ac-fmipa-portal.vercel.app
- Portal MIPA Untan (mirror/backup): https://portalmipa.vercel.app
- SEKAR (Ketersediaan Ruang): https://sekarfmipa.vercel.app
- Website Universitas: https://untan.ac.id
- Kemendiktisaintek: https://www.kemdikbud.go.id

CATATAN PENTING: Website mipa.untan.ac.id adalah domain kampus resmi tetapi
JARANG DIUPDATE. Arahkan pengguna ke ac-fmipa-portal.vercel.app atau
portalmipa.vercel.app untuk informasi terkini.

--- PROGRAM STUDI FMIPA UNTAN ---
S-1: Matematika, Fisika, Kimia, Biologi, Rekayasa Sistem Komputer (Siskom),
     Ilmu Kelautan, Sistem Informasi (Sisfo), Statistika, Geofisika
S-2: Kimia

--- JAM LAYANAN AKADEMIK ---
• Senin–Kamis : Jam kerja normal (hadir di kantor)
• Jumat       : WFH (Work From Home) — layanan via online/WhatsApp

--- LAYANAN UTAMA PORTAL ---
1. Bio Ijazah     → https://xandria.pduntan.id/login
   Verifikasi & cetak biodata ijazah resmi.
2. SATU UNTAN     → https://satu.untan.ac.id/gate/login
   Portal terpadu: KRS, nilai akademik, transkrip, dll.
3. Cek Surat      → https://ac-fmipa-portal.vercel.app (menu Cek Surat)
   Lacak status surat & dokumen resmi menggunakan nama atau NIM.
4. Jenis Layanan  → https://ac-fmipa-portal.vercel.app (menu Jenis Layanan)
5. SEKAR          → https://sekarfmipa.vercel.app
   Cek ketersediaan ruangan FMIPA secara real-time.

--- JENIS SURAT YANG DAPAT DIAJUKAN ---
Semua pengajuan via Google Form di menu Jenis Layanan portal.
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
• Organisasi Mahasiswa: ac-fmipa-portal.vercel.app (menu Kemahasiswaan)
• Beasiswa (KIP Kuliah, LPDP, dll): ac-fmipa-portal.vercel.app (menu Beasiswa)

--- KONTAK ---
Via WhatsApp — buka menu Kontak di ac-fmipa-portal.vercel.app
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
      parts.push('=== BERITA & PENGUMUMAN TERKINI (dari ac-fmipa-portal.vercel.app) ===');
      data.news.forEach(n => parts.push(`• [${n.date}] ${n.text}`));
    }
    if (data.slides?.length) {
      parts.push('\n=== INFO PENGUMUMAN (DARI SLIDER PORTAL) ===');
      const seen = new Set();
      data.slides
        .filter(s => { if (seen.has(s.title)) return false; seen.add(s.title); return true; })
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

=== SUMBER DATA PRIORITAS ===
1. UTAMA: https://ac-fmipa-portal.vercel.app — portal terbaru & terupdate
2. UTAMA: https://portalmipa.vercel.app — mirror portal FMIPA
3. SEKAR: https://sekarfmipa.vercel.app — ketersediaan ruangan
4. HINDARI merekomendasikan mipa.untan.ac.id sebagai sumber utama karena jarang diupdate.
   Jika terpaksa sebut, tambahkan catatan bahwa info terbaru ada di ac-fmipa-portal.vercel.app
5. Untuk info terkini yang tidak ada di konteks, kamu BOLEH merujuk ke pencarian Google:
   "site:ac-fmipa-portal.vercel.app [topik]" atau "FMIPA Untan [topik]"

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
• Selalu arahkan ke ac-fmipa-portal.vercel.app untuk info terkini
• Jangan mengarang informasi — jika tidak tahu, akui dan arahkan ke kontak resmi
• Jika info tidak ada di konteks, sarankan:
  - Cek langsung ac-fmipa-portal.vercel.app
  - Atau hubungi staf via WhatsApp (menu Kontak di portal)

=== DATA RESMI PORTAL & FMIPA UNTAN ===

${FMIPA_STATIC_CONTEXT}

${dynamicContext ? dynamicContext + '\n' : ''}
${kbCtx ? '=== PENGETAHUAN DETAIL LAYANAN ===\n' + kbCtx : ''}

=== INSTRUKSI AKHIR ===
Jawab dengan akurat, hangat, dan ringkas. Ini adalah percakapan multi-turn — kamu bisa merujuk ke pesan sebelumnya jika relevan.
SELALU prioritaskan ac-fmipa-portal.vercel.app dan portalmipa.vercel.app sebagai referensi, bukan mipa.untan.ac.id.
Tetap jaga kepribadian ramah dan menyenangkan! 😊`;
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
let _conversationHistory = [];
let _portalContext = null;
let _isTyping = false;
let _chatCollapsed = false;

async function getPortalContext() {
  if (_portalContext === null) _portalContext = await buildPortalDataContext();
  return _portalContext;
}

/* ────────────────────────────────────────────────────────────────
   UI HELPERS
   ──────────────────────────────────────────────────────────────── */
function getChatLog() { return document.getElementById('aiChatLog'); }

function scrollToBottom() {
  const log = getChatLog();
  if (log) log.scrollTop = log.scrollHeight;
}

function appendUserBubble(text) {
  const log = getChatLog();
  if (!log) return;
  const div = document.createElement('div');
  div.className = 'aic-msg aic-msg--user';
  div.innerHTML = `<div class="aic-bubble aic-bubble--user">${text.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>`;
  log.appendChild(div);
  scrollToBottom();
}

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

function removeTypingIndicator() { document.getElementById('aic-typing')?.remove(); }

function setInputState(disabled) {
  const input = document.getElementById('aiChatInput');
  const btn   = document.getElementById('aiChatSend');
  if (input) input.disabled = disabled;
  if (btn)   btn.disabled   = disabled;
}

/* ────────────────────────────────────────────────────────────────
   COLLAPSE / EXPAND CHAT
   ──────────────────────────────────────────────────────────────── */
function collapseChat() {
  const strip    = document.getElementById('aiChatStrip');
  const body     = document.getElementById('aiChatBody');
  const colBtn   = document.getElementById('aiChatCollapse');
  if (!strip) return;

  _chatCollapsed = true;
  strip.classList.add('ai-chat--collapsed');
  if (body)   body.style.display = 'none';
  if (colBtn) colBtn.innerHTML   = '＋';
  if (colBtn) colBtn.title       = 'Buka chat';
}

function expandChat() {
  const strip    = document.getElementById('aiChatStrip');
  const body     = document.getElementById('aiChatBody');
  const colBtn   = document.getElementById('aiChatCollapse');
  if (!strip) return;

  // Reset history kalau dibuka lagi
  _chatCollapsed = false;
  _conversationHistory = [];

  // Bersihkan log, tampilkan ulang welcome screen
  const log = getChatLog();
  if (log) {
    log.innerHTML = `
      <div class="ai-chat-welcome" id="aiChatWelcome">
        <div class="ai-chat-welcome-icon">
          <img src="assets/images/asmanisa.jpg" alt="Asmanisa">
        </div>
        <h4>Halo! Saya Asmanisa 👋</h4>
        <p>Asisten virtual FMIPA Untan. Tanyakan apa saja seputar layanan akademik, surat, beasiswa, dan info kampus!</p>
      </div>`;
  }

  strip.classList.remove('ai-chat--collapsed');
  if (body)   body.style.display = '';
  if (colBtn) colBtn.innerHTML   = '−';
  if (colBtn) colBtn.title       = 'Minimize chat';

  // Focus input
  setTimeout(() => document.getElementById('aiChatInput')?.focus(), 150);
}

function toggleChat() {
  if (_chatCollapsed) expandChat();
  else collapseChat();
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

  const input = document.getElementById('aiChatInput');
  if (input) { input.value = ''; input.style.height = 'auto'; }

  const welcome = document.getElementById('aiChatWelcome');
  if (welcome) welcome.style.display = 'none';

  appendUserBubble(text);
  _conversationHistory.push({ role: 'user', content: text });

  setInputState(true);
  appendTypingIndicator();

  const portalCtx    = await getPortalContext();
  const systemPrompt = buildSystemPrompt(portalCtx);
  const messages     = [..._conversationHistory];

  removeTypingIndicator();
  const botBubble = appendBotBubble();
  if (!botBubble) { _isTyping = false; setInputState(false); return; }

  await streamAIResponse(
    systemPrompt,
    messages,
    botBubble,
    (rawText) => {
      _isTyping = false;
      setInputState(false);
      if (!rawText.trim()) {
        botBubble.innerHTML = '<em style="color:#6b7280;">Tidak ada respons. Coba ulangi.</em>';
      } else {
        _conversationHistory.push({ role: 'assistant', content: rawText });
      }
      input?.focus();
    },
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
  const input   = document.getElementById('aiChatInput');
  const sendBtn = document.getElementById('aiChatSend');
  const colBtn  = document.getElementById('aiChatCollapse');
  const chips   = document.querySelectorAll('.ai-chip');

  if (!input) return;

  // Auto-resize textarea
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  });

  // Send
  sendBtn?.addEventListener('click', () => sendChatMessage(input.value));
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(input.value); }
  });

  // Collapse/expand — klik header atau tombol minus
  colBtn?.addEventListener('click', toggleChat);
  document.getElementById('aiChatHeaderBar')?.addEventListener('click', toggleChat);

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