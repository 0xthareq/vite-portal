const SCRAMBLE_CHARS = "█▓▒░#@$%&*+=?ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const SCRAMBLE_DELAY = 2000;

/**
 * Format tanggal dari berbagai format ke bahasa Indonesia
 * Handles: ISO string, "Sabtu, 9 Mei 2026", dll
 */
function formatTanggal(val) {
  if (!val) return "–";
  // Sudah dalam format Indonesia
  if (/[A-Za-z]/.test(val) && !val.includes("T")) return val;
  // ISO date string dari Google Sheets
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return val;
    return d.toLocaleDateString("id-ID", {
      weekday: "long", day: "numeric", month: "long", year: "numeric"
    });
  } catch { return val; }
}

/**
 * Efek teks scramble / decode pada elemen
 * @param {HTMLElement} element  - elemen target
 * @param {string}      finalText - teks akhir yang dituju
 * @param {string}      colorFinal    - warna saat sudah terdecode
 * @param {string}      colorScramble - warna saat masih scramble
 */
function createScramble(element, finalText, colorFinal = "#1a4f8a", colorScramble = "#c5c7cc") {
  let iteration  = 0;
  let frameId;
  let isDecoding = false;

  function tick() {
    element.textContent = finalText.split("").map((char, i) => {
      if (char === " ") return " ";
      if (i < iteration) return finalText[i];
      return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
    }).join("");

    element.style.color = isDecoding ? colorFinal : colorScramble;

    if (iteration <= finalText.length) {
      iteration += 0.5;
      frameId = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(frameId);
      isDecoding = !isDecoding;
      setTimeout(() => {
        iteration = 0;
        frameId = requestAnimationFrame(tick);
      }, SCRAMBLE_DELAY);
    }
  }

  requestAnimationFrame(tick);
}

/* ══════════════════════════════════════════════
   BAGIAN 2 — CARD 3D TILT
   ══════════════════════════════════════════════ */

function initCardTilt() {
  const card      = document.getElementById("tilt-card");
  const container = document.querySelector(".cs-card-container");
  if (!card || !container) return;

  container.addEventListener("mousemove", (e) => {
    const rect  = card.getBoundingClientRect();
    const xNorm = ((e.clientX - rect.left)  / rect.width)  * 2 - 1;
    const yNorm = ((e.clientY - rect.top)   / rect.height) * 2 - 1;
    const MAX   = 6;
    card.style.transform = `rotateX(${-yNorm*MAX}deg) rotateY(${xNorm*MAX}deg) translateZ(12px)`;
  });

  container.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0px)";
  });
}

/* ══════════════════════════════════════════════
   BAGIAN 3 — FETCH API GOOGLE SHEET
   Ganti API_URL dengan endpoint Apps Script kamu
   ══════════════════════════════════════════════ */

const API_URL = "https://script.google.com/macros/s/AKfycbx_fgFroV_E7VtVpkgm1HjSAmy9pPc-HxNia8TGev9-mVLjVjOo8pzh8YX0lmu7LRRU5Q/exec";

async function cariSurat() {
  const inputEl      = document.getElementById("searchInput");
  const himpunanEl   = document.getElementById("himpunanSelect");
  const selectEl     = document.getElementById("jenisSurat");
  const hasilEl      = document.getElementById("hasil");

  const jenisSurat   = selectEl.value.trim();
  const isKegiatan   = jenisSurat === "izin_kegiatan";

  // Ambil keyword dari field yang aktif
  const keyword = isKegiatan
    ? himpunanEl.value.trim()
    : inputEl.value.trim();

  // Reset error
  inputEl.classList.remove("error");
  himpunanEl.classList.remove("error");

  if (!keyword) {
    if (isKegiatan) {
      himpunanEl.classList.add("error");
      hasilEl.innerHTML = `<div class="cs-error-msg">⚠️ Pilih nama Himpunan terlebih dahulu.</div>`;
    } else {
      inputEl.classList.add("error");
      hasilEl.innerHTML = `<div class="cs-error-msg">⚠️ Masukkan Nama atau NIM terlebih dahulu.</div>`;
      inputEl.focus();
    }
    return;
  }

  if (!jenisSurat) {
    hasilEl.innerHTML = `<div class="cs-error-msg">⚠️ Pilih jenis surat terlebih dahulu.</div>`;
    return;
  }

  hasilEl.innerHTML = `<div class="cs-loading">Memuat data...</div>`;

  try {
    const url = `${API_URL}?nama=${encodeURIComponent(keyword)}&jenis=${encodeURIComponent(jenisSurat)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!data || data.length === 0) {
      // ── Pesan kontak per jenis surat ──
      const kontakMap = {
        ket_lulus:     "Mohon hubungi <strong>Onny</strong> di Menu <strong>Kontak</strong> terkait Surat Keterangan Lulus.",
        aktif_kuliah:  "Mohon hubungi <strong>Agung</strong> di Menu <strong>Kontak</strong> terkait Surat Aktif Kuliah.",
        cuti_kuliah:   "Mohon hubungi <strong>Bu Ana</strong> di Menu <strong>Kontak</strong> terkait surat ini.",
        undur_diri:    "Mohon hubungi <strong>Bu Ana</strong> di Menu <strong>Kontak</strong> terkait surat ini.",
        pindah_kuliah: "Mohon hubungi <strong>Bu Ana</strong> di Menu <strong>Kontak</strong> terkait surat ini.",
      };

      // ── Khusus izin_kegiatan: per himpunan ──
      const thareqList = ["HIMATIKA","HIMABIO","HIMAFIS","HMG","HIMASTA","KOMIK","ART LABORATORY","MSI"];
      const onnyList   = ["HIMASTER","HIMKI","HMIK","HMSI","FIKRI","IMASIKA","BEM","DPM"];

      let kontakMsg = kontakMap[jenisSurat] || "";
      // izin_kegiatan: tidak tampilkan pesan kontak di sini
      // karena kotak kontak sudah tampil di atas hasil pencarian
      if (jenisSurat === "izin_kegiatan") kontakMsg = "";

      hasilEl.innerHTML = `
        <div class="cs-no-result">
          ❌ Data tidak ditemukan untuk "<strong>${keyword}</strong>".
          ${kontakMsg ? `<br><span class="cs-no-result-kontak">${kontakMsg}</span>` : ""}
        </div>`;
      return;
    }

    renderHasil(data, jenisSurat);

  } catch (err) {
    console.error("Fetch error:", err);
    hasilEl.innerHTML = `<div class="cs-error-msg">⚠️ Server tidak merespons. Coba beberapa saat lagi.</div>`;
  }
}

// Enter key juga bisa cari
document.addEventListener("DOMContentLoaded", () => {
  const jenisSuratEl  = document.getElementById("jenisSurat");
  const searchInputEl = document.getElementById("searchInput");
  const himpunanEl    = document.getElementById("himpunanSelect");
  const subEl         = document.getElementById("searchSub");

  const DEFAULT_SUB    = "Masukkan nama atau NIM dan pilih jenis surat";
  const KEGIATAN_SUB   = "Pilih nama Himpunan dan klik Cari";

  // Enter pada text input
  searchInputEl?.addEventListener("keydown", e => {
    if (e.key === "Enter") cariSurat();
  });

  const THAREQ_LIST = ["HIMATIKA","HIMABIO","HIMAFIS","HMG","HIMASTA","KOMIK","ART LABORATORY","MSI"];
  const ONNY_LIST   = ["HIMASTER","HIMKI","HMIK","HMSI","FIKRI","IMASIKA","BEM","DPM"];

  function getPic(himpunanValue) {
    // value dari option langsung dipakai (sudah singkatan/nama bersih)
    const val = himpunanValue.trim().toUpperCase();
    if (THAREQ_LIST.includes(val)) return "Thareq";
    if (ONNY_LIST.includes(val))   return "Onny";
    return "Thareq / Onny";
  }

  function updateKontakCard() {
    const kontakBox  = document.getElementById("kontakKegiatan");
    const kontakText = document.getElementById("kontakKegiatanText");
    if (!kontakBox || !kontakText) return;

    if (jenisSuratEl.value !== "izin_kegiatan") {
      kontakBox.style.display = "none";
      return;
    }

    const pic         = himpunanEl.value ? getPic(himpunanEl.value) : "Thareq / Onny";
    const namaDisplay = himpunanEl.value
      ? `<strong>${himpunanEl.options[himpunanEl.selectedIndex]?.text.split(/[–-]/)[0].trim()}</strong>`
      : "himpunan";

    kontakText.innerHTML = `Jika surat izin kegiatan ${namaDisplay} belum terdaftar atau butuh konfirmasi, hubungi <strong>${pic}</strong> di Menu <strong>Kontak</strong>.`;
    kontakBox.style.display = "";
  }

  // Ganti tampilan field sesuai jenis surat
  jenisSuratEl?.addEventListener("change", () => {
    const val = jenisSuratEl.value;

    if (val === "izin_kegiatan") {
      searchInputEl.style.display = "none";
      himpunanEl.style.display    = "";
      himpunanEl.selectedIndex    = 0;
      if (subEl) subEl.style.display = "none";
    } else {
      searchInputEl.style.display = "";
      himpunanEl.style.display    = "none";
      if (subEl) subEl.style.display = "";
    }

    updateKontakCard();

    const placeholder = jenisSuratEl.querySelector('option[value=""]');
    if (placeholder) placeholder.remove();
  });

  // Update kontak card saat himpunan dipilih
  himpunanEl?.addEventListener("change", updateKontakCard);

  // QR modal tutup saat klik overlay
  document.getElementById("qrModal")?.addEventListener("click", e => {
    if (e.target.id === "qrModal") closeQR();
  });

  // Scramble effect
  const el1 = document.getElementById("linesurat");
  const el2 = document.getElementById("linesurat2");
  if (el1) createScramble(el1, "Cek Status",     "#1a4f8a", "#c5c7cc");
  if (el2) createScramble(el2, "Surat Mahasiswa", "#e8a020", "#c5c7cc");

  // 3D tilt card
  initCardTilt();
});

/* ══════════════════════════════════════════════
   BAGIAN 4 — RENDER TABEL HASIL
   ══════════════════════════════════════════════ */

function renderHasil(data, jenisSurat) {
  const hasilEl    = document.getElementById("hasil");
  const isKegiatan = jenisSurat === "izin_kegiatan";

  if (isKegiatan) {
    let rows = data.map(row => {
      const fileUrl = row.link || row.lihat_surat || row.file || "";
      return `
        <tr>
          <td>${row.nama_himpunan || row.nama || "–"}</td>
          <td>${formatTanggal(row.hari_tanggal)}</td>
          <td>${row.tempat || "–"}</td>
          <td>
            <button class="cs-file-btn" onclick="openQR('${fileUrl}')">
              📄 Lihat File
            </button>
          </td>
        </tr>`;
    }).join("");

    hasilEl.innerHTML = `
      <table class="cs-table">
        <thead>
          <tr>
            <th>Nama Himpunan</th>
            <th>Hari/Tanggal</th>
            <th>Tempat</th>
            <th>File</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
  } else {
    let rows = data.map(row => `
      <tr>
        <td>${row.nama  || "–"}</td>
        <td>${row.nim   || "–"}</td>
        <td>${row.surat || "–"}</td>
        <td>
          <button class="cs-file-btn" onclick="openQR('${row.file || ""}')">
            📄 Lihat File
          </button>
        </td>
      </tr>`).join("");

    hasilEl.innerHTML = `
      <table class="cs-table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>NIM</th>
            <th>Jenis Surat</th>
            <th>File</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
  }
}

/* ══════════════════════════════════════════════
   BAGIAN 5 — QR CODE MODAL
   ══════════════════════════════════════════════ */

/**
 * Ekstrak Google Drive File ID dari berbagai format URL
 */
function extractFileId(url) {
  if (!url) return null;
  let m = url.match(/\/d\/([a-zA-Z0-9_-]{10,})/);
  if (m) return m[1];
  m = url.match(/id=([a-zA-Z0-9_-]{10,})/);
  if (m) return m[1];
  return null;
}

/**
 * Buka modal QR code untuk file Google Drive
 * @param {string} fileUrl - URL Google Drive
 */
function openQR(fileUrl) {
  if (!fileUrl) {
    alert("File belum tersedia.");
    return;
  }

  const fileId = extractFileId(fileUrl);
  if (!fileId) {
    alert("Format URL file tidak valid.");
    return;
  }

  const previewURL = `https://drive.google.com/uc?id=${fileId}&export=view`;
  const downloadURL = `https://drive.google.com/uc?id=${fileId}&export=download`;

  // Coba Google Charts QR, fallback ke qrserver
  const qrImg = document.getElementById("qrImage");
  qrImg.src   = `https://chart.googleapis.com/chart?cht=qr&chs=400x400&chl=${encodeURIComponent(previewURL)}`;
  qrImg.onerror = () => {
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(previewURL)}`;
    qrImg.onerror = null;
  };

  // Set href tombol download
  const dlBtn = document.getElementById("qrDownloadBtn");
  if (dlBtn) dlBtn.href = downloadURL;

  // Tampilkan modal
  const modal = document.getElementById("qrModal");
  modal.style.display = "flex";
  modal.classList.add("open");
}

/**
 * Tutup modal QR
 */
function closeQR() {
  const modal = document.getElementById("qrModal");
  modal.style.display = "none";
  modal.classList.remove("open");
  document.getElementById("qrImage").src = "";
}

// Klik overlay tutup modal