
// ═══════════════════════════════════════════════════════════════════
<<<<<<< HEAD
const AI_SEARCH_API_KEY = 'REMOVED';
=======
//  ↓↓↓ MASUKKAN API KEY OPENROUTER KAMU DI SINI ↓↓↓
// ═══════════════════════════════════════════════════════════════════
const AI_SEARCH_API_KEY = 'castai_v1_83535d9c713badfcac91d739ccb11a1d51b8e773229b35c6517b40b2fbf2a5a8_a7e0e558';

// const AI_SEARCH_API_KEY = 'REMOVED';
>>>>>>> 79cac86a45f18821d8b7b0541803636e07540e18
// ═══════════════════════════════════════════════════════════════════

const AI_MODEL   = 'kimi-k2.6';
const AI_API_URL = 'https://llm.kimchi.dev/openai/v1/chat/completions';

/* ────────────────────────────────────────────────────────────────
   KONTEKS STATIS FMIPA UNTAN (RAG — Sumber 1)
   Berisi info tetap yang selalu relevan sebagai ground truth.
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
   Verifikasi & cetak biodata ijazah resmi. Login dengan akun mahasiswa.
2. SATU UNTAN     → https://satu.untan.ac.id/gate/login
   Portal terpadu: KRS, nilai akademik, transkrip, dll.
3. Cek Surat      → halaman ceksurat.html di portal ini
   Lacak status surat & dokumen resmi menggunakan nama atau NIM.
4. Jenis Layanan  → via menu Jenis Layanan di portal (Google Form)
5. SEKAR          → https://sekarfmipa.vercel.app
   Cek ketersediaan ruangan FMIPA secara real-time (hari kerja Senin–Jumat)

--- JENIS SURAT YANG DAPAT DIAJUKAN ---
Semua pengajuan via Google Form di menu Jenis Layanan.
• Surat Keterangan Aktif Kuliah
• Surat Keterangan Lulus (SKL)
• Surat Permohonan Cuti Kuliah
• Surat Pengunduran Diri
• Surat Permohonan Pindah Kuliah
Proses: 1–3 hari kerja setelah pengajuan diverifikasi oleh staf.

--- DOKUMEN & INFO PENTING (via menu Info Penting di portal) ---
• Pedoman Akademik (juga tersedia di mipa.untan.ac.id/akademik)
• Kalender Akademik Semester Genap T.A 2025/2026
• Kode Etik Universitas Tanjungpura
• Edaran PISN
• Prosedur Perbaikan Data PDDIKTI
• Prosedur Pengajuan Cuti Kuliah
• SOP Pendaftaran Ulang: mipa.untan.ac.id/akademik/daftar-ulang
• Informasi UKT: mipa.untan.ac.id/akademik/info-ukt
• SOP Pelayanan Akademik: mipa.untan.ac.id/akademik/sop-pelayanan-akademik

--- STATISTIK MAHASISWA 2026 ---
• Mahasiswa Aktif : 2.370 orang
• Mahasiswa Lulus : 100 orang (data terkini)

--- WISUDA & YUDISIUM T.A 2025/2026 ---
• Yudisium Periode III : 27 April 2026
• Wisuda Periode III   : 29–30 April 2026

--- KEMAHASISWAAN ---
• Organisasi Mahasiswa: mipa.untan.ac.id/kemahasiswaan/organisasi-mahasiswa
• Prestasi Mahasiswa: mipa.untan.ac.id/kemahasiswaan/prestasi-mahasiswa
• Beasiswa (termasuk LPDP, KIP Kuliah, dll): mipa.untan.ac.id/kemahasiswaan/beasiswa
• Pengumuman Kemahasiswaan: mipa.untan.ac.id/kemahasiswaan/pengumuman

--- KONTAK ---
Via WhatsApp — buka menu Kontak di portal.
Aktif Senin–Jumat pada jam kerja.

--- DOWNLOAD ---
• Akreditasi UNTAN (tersedia di mipa.untan.ac.id/tentang-kami/akreditasi)
• Draft Syarat Sidang (Google Docs)
• Draft Bebas Laboratorium (Google Docs)

--- VISI FMIPA UNTAN ---
"Menjadi institusi unggul dalam transformasi, pengembangan dan penyebarluasan
sains dan teknologi berbasis lingkungan tropis dengan luaran berdaya saing global."
`.trim();

/* ────────────────────────────────────────────────────────────────
   BUILD CONTEXT DARI ASMANISA_KB (RAG — Sumber 2)
   Mengambil jawaban dari kb.js yang sudah dimuat.
   ──────────────────────────────────────────────────────────────── */
function buildKBContext() {
  if (typeof window.ASMANISA_KB === 'undefined') return '';

  const skipIds = ['kata_kasar', 'pujian_diri'];  // jangan skip greeting & bercanda

  return window.ASMANISA_KB
    .filter(item => !skipIds.includes(item.id))
    .map(item => {
      // Strip HTML tags dari jawaban
      const clean = item.answer
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/gi, '$2 ($1)')
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
      return `[${item.id}]\n${clean}`;
    })
    .join('\n\n');
}

/* ────────────────────────────────────────────────────────────────
   BUILD CONTEXT DARI PORTAL-DATA.JSON (RAG — Sumber 3)
   Mengambil berita & slide terkini secara dinamis.
   ──────────────────────────────────────────────────────────────── */
async function buildPortalDataContext() {
  try {
    const res = await fetch('/data/portal-data.json');
    if (!res.ok) return '';
    const data = await res.json();
    const parts = [];

    if (data.news?.length) {
      parts.push('=== BERITA & PENGUMUMAN TERKINI ===');
      data.news.forEach(n => {
        parts.push(`• [${n.date}] ${n.text}`);
      });
    }

    if (data.slides?.length) {
      parts.push('\n=== INFO PENGUMUMAN (DARI SLIDER PORTAL) ===');
      // Deduplicate berdasarkan title
      const seen = new Set();
      data.slides
        .filter(s => {
          if (seen.has(s.title)) return false;
          seen.add(s.title);
          return true;
        })
        .forEach(s => {
          const desc = s.desc ? `: ${s.desc}` : '';
          parts.push(`• [${s.tag}] ${s.title}${desc}`);
        });
    }

    return parts.join('\n');
  } catch {
    return '';
  }
}

/* ────────────────────────────────────────────────────────────────
   BUILD SYSTEM PROMPT (Gabungan semua konteks RAG)
   ──────────────────────────────────────────────────────────────── */
function buildSystemPrompt(dynamicContext) {
  const kbCtx = buildKBContext();

  return `Kamu adalah Asmanisa, asisten virtual AI resmi Portal Akademik & Kemahasiswaan FMIPA (Fakultas Matematika dan Ilmu Pengetahuan Alam) Universitas Tanjungpura (Untan), Pontianak, Kalimantan Barat.

=== KEPRIBADIAN ===
Kamu ramah, hangat, sedikit santai tapi tetap sopan dan profesional — seperti kakak tingkat yang helpful.
Boleh merespons sapaan, perkenalan, basa-basi, candaan ringan, gombalan lucu, atau pujian ("kamu ganteng", "makasih ya", "selamat pagi") dengan natural dan menyenangkan.
Gunakan emoji sesekali supaya terasa lebih hidup 😊

=== TOPIK YANG BOLEH DIJAWAB ===
1. Semua hal tentang FMIPA Untan & Universitas Tanjungpura:
   - Layanan akademik, administrasi, surat-menyurat, KRS, nilai, transkrip
   - Jadwal, kalender akademik, UAS, yudisium, wisuda
   - Beasiswa (KIP Kuliah, LPDP, Dikti, dan beasiswa lain)
   - Program studi, kurikulum, dosen, laboratorium
   - Ketersediaan ruang (SEKAR: sekarfmipa.vercel.app)
   - Organisasi mahasiswa, kegiatan kemahasiswaan
   - Informasi dari website resmi: mipa.untan.ac.id, untan.ac.id
2. Kebijakan pendidikan tinggi nasional dari Kemendiktisaintek
   (beasiswa nasional, PDDIKTI, MBKM, aturan akademik nasional, dll)
3. Sapaan, perkenalan, basa-basi, candaan ringan, gombalan lucu, dan percakapan biasa yang sopan
4. Pertanyaan umum tentang dunia perkuliahan, tips belajar, kehidupan mahasiswa

=== TOPIK YANG TIDAK BOLEH DIJAWAB (HARD BLOCK) ===
❌ Politik, partai, pilkada, pemilu, opini tentang pejabat/tokoh politik
❌ SARA (suku, agama, ras, antar golongan) secara sensitif atau provokatif
❌ Kata-kata kasar, makian, atau umpatan dalam bahasa apapun
❌ Konten jorok, vulgar, atau tidak senonoh
❌ Hal yang sama sekali tidak berkaitan dengan kampus/pendidikan DAN bukan percakapan biasa
   (contoh: resep masakan detail, gosip artis, prediksi bola, berita viral non-akademik)

Jika ada yang bertanya topik terlarang, tolak dengan santai dan arahkan kembali:
"Hehe, itu di luar zona kenyamananku 😅 Yuk tanya seputar kampus aja, siap bantu!"

=== PEDOMAN MENJAWAB ===
• Bahasa Indonesia yang natural, ramah, dan mudah dipahami
• Jawaban singkat & padat — 2–4 paragraf, kecuali detail memang diperlukan
• Gunakan bullet point jika ada banyak poin
• Sertakan link relevan jika tersedia di konteks
• Jangan mengarang informasi — jika tidak tahu, akui dan arahkan ke kontak resmi atau website terkait
• Jika info tidak ada di konteks, sarankan cek langsung ke:
  - mipa.untan.ac.id (info resmi FMIPA)
  - untan.ac.id (info universitas)
  - sekarfmipa.vercel.app (cek ruangan)
  - atau hubungi staf via WhatsApp (menu Kontak di portal)

=== DATA RESMI PORTAL & FMIPA UNTAN ===

${FMIPA_STATIC_CONTEXT}

${dynamicContext ? dynamicContext + '\n' : ''}
${kbCtx ? '=== PENGETAHUAN DETAIL LAYANAN ===\n' + kbCtx : ''}

=== INSTRUKSI AKHIR ===
Jawab dengan akurat, hangat, dan ringkas. Gunakan konteks di atas sebagai referensi utama.
Untuk info yang tidak ada di konteks tapi masih seputar kampus/pendidikan, berikan panduan umum
dan arahkan ke sumber yang tepat. Tetap jaga kepribadian ramah dan menyenangkan! 😊`;
}

/* ────────────────────────────────────────────────────────────────
   OPENROUTER API — STREAMING
   ──────────────────────────────────────────────────────────────── */
async function callOpenRouter(question, systemPrompt, onChunk, onDone, onError) {
  const apiKey = AI_SEARCH_API_KEY;

  if (!apiKey || apiKey.startsWith('MASUKKAN')) {
    onError('API Key belum dikonfigurasi. Buka file <code>js/ai-search.js</code> dan isi variabel <code>AI_SEARCH_API_KEY</code> dengan API key OpenRouter-mu.');
    return;
  }

  try {
    const response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Asmanisa AI - FMIPA Untan'
      },
      body: JSON.stringify({
        model: AI_MODEL,
        stream: true,
        max_tokens: 1024,
        temperature: 0.5,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: question    }
        ]
      })
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

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const payload = line.slice(6).trim();
        if (payload === '[DONE]') { onDone(); return; }
        try {
          const parsed = JSON.parse(payload);
          const delta  = parsed.choices?.[0]?.delta?.content ?? '';
          if (delta) onChunk(delta);
        } catch {
          /* skip malformed SSE chunks */
        }
      }
    }
    onDone();

  } catch (err) {
    onError(err.message || 'Terjadi kesalahan koneksi ke AI.');
  }
}

/* ────────────────────────────────────────────────────────────────
   FORMAT MARKDOWN SEDERHANA → HTML
   Mendukung: **bold**, *italic*, [link](url), bullet (•/-/*)
   ──────────────────────────────────────────────────────────────── */
function formatAIResponse(rawText) {
  let html = rawText
    // Escape < > untuk keamanan (kecuali tag link yang kita buat sendiri)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Bold **text** atau __text__
    .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_\n]+)__/g, '<strong>$1</strong>')
    // Italic *text* (bukan bold)
    .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>')
    // Link [teks](url) — re-escape karena url aman
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:var(--primary,#2589e9);font-weight:600;">$1</a>'
    )
    // Inline code `code`
    .replace(/`([^`\n]+)`/g,
      '<code style="background:#f3f4f6;padding:1px 5px;border-radius:4px;font-size:12.5px;font-family:monospace;">$1</code>'
    )
    // Bullet: baris dimulai dengan • atau - atau * (diikuti spasi)
    .replace(/^[•\-\*]\s+(.+)$/gm, '<li>$1</li>')
    // Numbered list: 1. item
    .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
    // Newlines → <br>
    .replace(/\n/g, '<br>');

  // Bungkus kelompok <li> berurutan dengan <ul>
  html = html.replace(/(<li>.*?<\/li>(<br>)?)+/g, match =>
    '<ul style="margin:6px 0 6px 18px;line-height:1.75;">' +
    match.replace(/<br>/g, '') +
    '</ul>'
  );

  return html;
}

/* ────────────────────────────────────────────────────────────────
   STATE & CACHE
   ──────────────────────────────────────────────────────────────── */
let _portalContext = null;   // cache context dari portal-data.json
let _isSearching   = false;  // lock agar tidak double-submit

/** Ambil context portal (sekali saja, cached) */
async function getPortalContext() {
  if (_portalContext === null) {
    _portalContext = await buildPortalDataContext();
  }
  return _portalContext;
}

/* ────────────────────────────────────────────────────────────────
   UI HELPERS
   ──────────────────────────────────────────────────────────────── */
function showResponsePanel() {
  const panel = document.getElementById('aiResponsePanel');
  if (panel) panel.classList.add('visible');
}

function hideResponsePanel() {
  const panel = document.getElementById('aiResponsePanel');
  if (panel) panel.classList.remove('visible');
}

function setResponseBody(html) {
  const body = document.getElementById('aiResponseBody');
  if (body) body.innerHTML = html;
}

function setLoadingState(loading) {
  const btn   = document.getElementById('aiSearchBtn');
  const input = document.getElementById('aiSearchInput');
  _isSearching = loading;

  if (input) input.disabled = loading;

  if (btn) {
    btn.disabled = loading;
    if (loading) {
      btn.innerHTML = `
        <svg class="ai-spin" width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>`;
    } else {
      btn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
        <span class="ai-btn-text">Tanya</span>`;
    }
  }
}

/* ────────────────────────────────────────────────────────────────
   MAIN: HANDLE SUBMIT PERTANYAAN
   ──────────────────────────────────────────────────────────────── */
async function handleAISearch(question) {
  question = (question || '').trim();
  if (!question || _isSearching) return;

  // Tampilkan panel dan loading state
  setLoadingState(true);
  showResponsePanel();
  setResponseBody(`
    <div style="display:flex;align-items:center;gap:10px;color:var(--text-muted,#6b7280);">
      <div class="ai-loading-dots">
        <div class="ai-loading-dot"></div>
        <div class="ai-loading-dot"></div>
        <div class="ai-loading-dot"></div>
      </div>
      <span style="font-size:13px;">Asmanisa sedang mencari jawaban...</span>
    </div>
  `);

  // Scroll panel ke viewport
  const panel = document.getElementById('aiResponsePanel');
  if (panel) {
    setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
  }

  // Bangun system prompt dengan konteks terkini
  const portalCtx    = await getPortalContext();
  const systemPrompt = buildSystemPrompt(portalCtx);

  let rawText        = '';
  const responseBody = document.getElementById('aiResponseBody');

  await callOpenRouter(
    question,
    systemPrompt,

    // onChunk — dipanggil setiap ada teks baru (streaming)
    (chunk) => {
      rawText += chunk;
      if (responseBody) {
        responseBody.innerHTML = formatAIResponse(rawText);
        responseBody.scrollTop = responseBody.scrollHeight;
      }
    },

    // onDone — streaming selesai
    () => {
      setLoadingState(false);
      if (responseBody && !rawText.trim()) {
        responseBody.innerHTML =
          '<em style="color:var(--text-muted,#6b7280);">Tidak ada respons. Coba ulangi pertanyaan.</em>';
      }
    },

    // onError — ada kesalahan
    (errMsg) => {
      setLoadingState(false);
      if (responseBody) {
        responseBody.innerHTML = `
          <div style="display:flex;align-items:flex-start;gap:9px;color:#b91c1c;">
            <span style="font-size:16px;line-height:1.4;">⚠️</span>
            <div>
              <strong style="display:block;margin-bottom:4px;">Gagal menghubungi AI</strong>
              <span style="font-size:12.5px;color:var(--text-muted,#6b7280);">${errMsg}</span>
            </div>
          </div>`;
      }
    }
  );
}

/* ────────────────────────────────────────────────────────────────
   INIT — Pasang semua event listener
   ──────────────────────────────────────────────────────────────── */
function initAISearch() {
  const input    = document.getElementById('aiSearchInput');
  const btn      = document.getElementById('aiSearchBtn');
  const closeBtn = document.getElementById('aiResponseClose');
  const chips    = document.querySelectorAll('.ai-chip');

  if (!input) return; // Komponen tidak ada di halaman ini

  // ── Submit via tombol ──
  btn?.addEventListener('click', () => handleAISearch(input.value));

  // ── Submit via Enter ──
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAISearch(input.value);
    }
  });

  // ── Tutup panel respons ──
  closeBtn?.addEventListener('click', hideResponsePanel);

  // ── Klik di luar panel untuk menutup (opsional) ──
  document.addEventListener('click', e => {
    const strip = document.getElementById('aiSearchStrip');
    if (strip && !strip.contains(e.target)) {
      hideResponsePanel();
    }
  });

  // ── Quick chips ──
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.dataset.query || chip.textContent.replace(/^[\p{Emoji}\s]+/u, '').trim();
      input.value = q;
      handleAISearch(q);
      input.focus();
    });
  });

  // ── Prefetch konteks portal di background ──
  // (agar respons pertama lebih cepat)
  getPortalContext().catch(() => {});

  // ── Notifikasi jika API key belum diset ──
  if (!AI_SEARCH_API_KEY || AI_SEARCH_API_KEY.startsWith('MASUKKAN')) {
    const strip = document.querySelector('.ai-search-inner');
    if (strip) {
      const notice = document.createElement('div');
      notice.className = 'ai-no-key-notice';
      notice.innerHTML =
        '⚙️ <div><strong>Setup diperlukan:</strong> ' +
        'Buka file <code>js/ai-search.js</code>, isi variabel ' +
        '<code>AI_SEARCH_API_KEY</code> dengan API key OpenRouter-mu, lalu simpan.</div>';
      strip.appendChild(notice);
    }
  }
}

// Jalankan setelah DOM siap
document.addEventListener('DOMContentLoaded', initAISearch);
