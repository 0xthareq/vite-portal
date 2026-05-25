/**
 * chatbot.js  —  Asmanisa (Client-Side Edition)
 * ─────────────────────────────────────────────────────────────────
 * Zero API. Zero server. Bekerja 100% di browser.
 * Semua jawaban dibaca dari js/kb.js
 *
 * Fitur:
 *   - Keyword matching engine (dari kb.js)
 *   - Animasi typing indicator (... bergerak)
 *   - Typewriter effect: teks muncul karakter per karakter
 *   - Jeda tanda baca: lebih lama di titik/seru/tanya
 *   - Avatar menggunakan foto (assets/images/asmanisa.jpg)
 * ─────────────────────────────────────────────────────────────────
 */

/* ── State ── */
let chatOpen = false;

/* Avatar HTML — dipakai di bubble & typing indicator */
const BOT_AVATAR_HTML =
  '<div class="msg-avatar" style="padding:0;overflow:hidden;">' +
  '<img src="assets/images/asmanisa.jpg" alt="Asmanisa" ' +
  'style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;">' +
  '</div>';

/* ────────────────────────────────────────────────────────────────
   MATCHING ENGINE
   ──────────────────────────────────────────────────────────────── */

function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function scoreItem(normalizedQuery, item) {
  const queryWords = normalizedQuery.split(' ');
  let score = 0;

  for (const pattern of item.patterns) {
    const p      = normalizeText(pattern);
    const pWords = p.split(' ');

    if (normalizedQuery.includes(p)) {
      score += pWords.length * 3;
    } else {
      const matchedWords = pWords.filter(
        w => w.length > 2 && queryWords.includes(w)
      );
      score += matchedWords.length;
    }
  }
  return score;
}

function findAnswer(query) {
  if (typeof window.ASMANISA_KB === 'undefined') {
    console.error('[Asmanisa] kb.js belum dimuat!');
    return null;
  }

  const q = normalizeText(query);
  if (!q) return null;

  let bestItem  = null;
  let bestScore = 0;

  for (const item of window.ASMANISA_KB) {
    const score = scoreItem(q, item);
    if (score > bestScore) {
      bestScore = score;
      bestItem  = item;
    }
  }

  return bestScore >= 2 ? bestItem : null;
}

/* ────────────────────────────────────────────────────────────────
   FALLBACK
   ──────────────────────────────────────────────────────────────── */
const FALLBACK_ANSWER =
  'Maaf, saya belum punya informasi untuk pertanyaan itu 😔<br><br>' +
  'Coba tanyakan tentang:<br>' +
  '• <em>Bio Ijazah, SATU UNTAN, Cek Surat</em><br>' +
  '• <em>Syarat Sidang, Bebas Lab, Cuti, PDDIKTI</em><br>' +
  '• <em>Kalender Akademik, Pedoman, Kontak</em><br><br>' +
  'Atau hubungi staf akademik langsung via ' +
  '<a href="#" onclick="openKontakPopup(); return false;" ' +
  'style="color:var(--primary);font-weight:600;">WhatsApp</a> ya 📞';

/* ────────────────────────────────────────────────────────────────
   TYPEWRITER ENGINE
   ──────────────────────────────────────────────────────────────── */

/**
 * Pisahkan HTML menjadi array token:
 *   - Tag HTML (<strong>, </a>, <br>, dsb.) → 1 token utuh (langsung, tanpa jeda)
 *   - Karakter teks biasa                   → 1 token per karakter
 */
function tokenizeHTML(html) {
  const tokens = [];
  const tagRe  = /<[^>]+>/g;
  let last = 0, m;

  while ((m = tagRe.exec(html)) !== null) {
    for (const ch of html.slice(last, m.index)) tokens.push(ch);
    tokens.push(m[0]);
    last = m.index + m[0].length;
  }
  for (const ch of html.slice(last)) tokens.push(ch);
  return tokens;
}

/**
 * Ketik HTML ke dalam bubble secara animasi karakter-per-karakter.
 * @param {HTMLElement} bubble  — elemen .msg-bubble yang sudah ada di DOM
 * @param {string}      html    — konten HTML jawaban
 * @param {Function}    onDone  — callback setelah semua karakter selesai diketik
 */
function typewriterHTML(bubble, html, onDone) {
  const tokens  = tokenizeHTML(html);
  let   idx     = 0;
  let   current = '';

  function typeNext() {
    if (idx >= tokens.length) {
      if (onDone) onDone();
      return;
    }

    const token = tokens[idx++];
    current    += token;
    bubble.innerHTML = current;

    // Auto-scroll
    const msgs = document.getElementById('chatMessages');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;

    // Tentukan jeda berdasarkan jenis token
    let delay;
    if (token.startsWith('<')) {
      delay = 0;                          // tag HTML → langsung, tanpa jeda
    } else if ('.!?'.includes(token)) {
      delay = 110 + Math.random() * 90;  // akhir kalimat → jeda panjang (~110-200ms)
    } else if (',;:'.includes(token)) {
      delay = 55 + Math.random() * 35;   // koma/titik dua → jeda sedang
    } else if (token === ' ') {
      delay = 22 + Math.random() * 15;   // spasi antar kata
    } else {
      delay = 16 + Math.random() * 13;   // karakter biasa (~16-29ms)
    }

    setTimeout(typeNext, delay);
  }

  typeNext();
}

/* ────────────────────────────────────────────────────────────────
   UI HELPERS
   ──────────────────────────────────────────────────────────────── */

/** Tambah bubble pesan (user, atau bot langsung tanpa typewriter — untuk sambutan) */
function addChatMsg(role, text) {
  const msgs = document.getElementById('chatMessages');
  if (!msgs) return;

  const div = document.createElement('div');
  div.className = 'msg ' + role;

  const userAvatar =
    '<div class="msg-avatar" ' +
    'style="background:var(--accent);font-size:10px;font-weight:700;">Anda</div>';

  div.innerHTML =
    (role === 'bot' ? BOT_AVATAR_HTML : '') +
    '<div class="msg-bubble">' + text.replace(/\n/g, '<br>') + '</div>' +
    (role === 'user' ? userAvatar : '');

  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

/** Buat bubble bot kosong → isi dengan typewriter */
function addBotBubbleTyped(html, onDone) {
  const msgs = document.getElementById('chatMessages');
  if (!msgs) return;

  const div    = document.createElement('div');
  div.className = 'msg bot';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';

  div.insertAdjacentHTML('beforeend', BOT_AVATAR_HTML);
  div.appendChild(bubble);
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;

  typewriterHTML(bubble, html, onDone);
}

function showTyping() {
  const msgs = document.getElementById('chatMessages');
  if (!msgs) return;

  const div = document.createElement('div');
  div.className = 'msg bot';
  div.id = 'typingDot';
  div.innerHTML =
    BOT_AVATAR_HTML +
    '<div class="msg-bubble">' +
    '<div class="typing-indicator">' +
    '<div class="typing-dot"></div>' +
    '<div class="typing-dot"></div>' +
    '<div class="typing-dot"></div>' +
    '</div></div>';

  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function removeTyping() {
  document.getElementById('typingDot')?.remove();
}

/* ────────────────────────────────────────────────────────────────
   SEND MESSAGE
   ──────────────────────────────────────────────────────────────── */

function sendChat() {
  const input   = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSend');
  const text    = input?.value.trim();
  if (!text) return;

  addChatMsg('user', text);
  if (input)   input.value      = '';
  if (sendBtn) sendBtn.disabled = true;
  showTyping();

  // Jeda "berpikir" sebelum mulai mengetik: 700–1300ms
  const thinkDelay = 700 + Math.random() * 600;

  setTimeout(() => {
    removeTyping();

    const match  = findAnswer(text);
    const answer = match ? match.answer : FALLBACK_ANSWER;

    // Typewriter — tombol kirim aktif kembali setelah selesai mengetik
    addBotBubbleTyped(answer, () => {
      if (sendBtn) sendBtn.disabled = false;
      input?.focus();
    });

  }, thinkDelay);
}

/* ────────────────────────────────────────────────────────────────
   INIT
   ──────────────────────────────────────────────────────────────── */

/* ────────────────────────────────────────────────────────────────
   BUBBLE ANIMATION ENGINE
   ──────────────────────────────────────────────────────────────── */
const BUBBLE_MESSAGES = [
  'Bingung sama layanannya? 😊',
  'Hei! Ada yang bisa dibantu? 👋',
  'Coba tanya aku dulu yuk!',
  'Mau info akademik FMIPA?',
  'Ada pertanyaan? Klik aku! 😄',
  'Perlu bantuan administrasi?',
];
let _bubbleIdx    = 0;
let _bubbleLoop   = null;
let _bubblePaused = false;

function _bubbleShow() {
  const wrap   = document.getElementById('asmanisa-bubble-wrap');
  const bubble = document.getElementById('asmanisa-bubble');
  const dots   = document.getElementById('asmanisa-dots');
  const txt    = document.getElementById('asmanisa-text');
  if (!bubble) return;

  /* Reset animasi */
  bubble.classList.remove('ab-hide');
  bubble.style.animation = 'none';
  void bubble.offsetWidth;
  bubble.style.animation = 'ab-in 0.45s cubic-bezier(0.34,1.56,0.64,1) both';

  wrap.style.display  = 'flex';
  dots.style.display  = 'inline-flex';
  txt.style.display   = 'none';
  txt.style.opacity   = '0';

  /* Tampilkan teks setelah typing dots */
  setTimeout(() => {
    if (_bubblePaused) return;
    dots.style.display = 'none';
    txt.textContent    = BUBBLE_MESSAGES[_bubbleIdx % BUBBLE_MESSAGES.length];
    _bubbleIdx++;
    txt.style.display  = 'inline';
    void txt.offsetWidth;
    txt.style.opacity  = '1';
  }, 1200);

  /* Sembunyikan bubble */
  setTimeout(() => _bubbleHide(), 4200);
}

function _bubbleHide() {
  const wrap   = document.getElementById('asmanisa-bubble-wrap');
  const bubble = document.getElementById('asmanisa-bubble');
  if (!bubble) return;
  bubble.classList.add('ab-hide');
  setTimeout(() => {
    if (bubble.classList.contains('ab-hide')) wrap.style.display = 'none';
  }, 350);
}

function _bubbleStart() {
  _bubblePaused = false;
  clearInterval(_bubbleLoop);
  setTimeout(() => {
    _bubbleShow();
    _bubbleLoop = setInterval(_bubbleShow, 6000);
  }, 2500);
}

function _bubbleStop() {
  _bubblePaused = true;
  clearInterval(_bubbleLoop);
  _bubbleHide();
}

/* ────────────────────────────────────────────────────────────────
   INIT
   ──────────────────────────────────────────────────────────────── */
function initChat() {
  const fab      = document.getElementById('chatFab');
  const win      = document.getElementById('chatWindow');
  const closeBtn = document.getElementById('chatCloseBtn');
  const input    = document.getElementById('chatInput');
  const sendBtn  = document.getElementById('chatSend');
  if (!fab) return;

  /* Mulai animasi bubble */
  _bubbleStart();

  fab.addEventListener('click', () => {
    chatOpen = !chatOpen;
    win.classList.toggle('open', chatOpen);
    if (chatOpen) {
      _bubbleStop();                              /* matikan bubble saat chat dibuka */
      const badge = document.querySelector('.chat-badge');
      if (badge) badge.style.display = 'none';
      setTimeout(() => input?.focus(), 300);
    }
  });

  closeBtn?.addEventListener('click', () => {
    chatOpen = false;
    win.classList.remove('open');
    setTimeout(_bubbleStart, 8000);             /* hidupkan lagi 8 detik setelah ditutup */
  });

  sendBtn?.addEventListener('click', sendChat);
  input?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChat();
    }
  });

  /* Pesan sambutan — langsung tampil, tanpa typewriter */
  addChatMsg('bot',
    'Halo! Saya <strong>Asmanisa</strong> 👋<br>' +
    'Asisten virtual Portal Akademik &amp; Kemahasiswaan FMIPA UNTAN.<br><br>' +
    'Tanyakan apa saja seputar layanan akademik, ijazah, surat, atau info kampus ya!'
  );
}

document.addEventListener('DOMContentLoaded', initChat);
