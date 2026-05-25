

/* ── Data kontak ── */
const KONTAK_DATA = [
  {
    name:     "Bu Ana",
    phone:    "+6285822020466",
    initials: "BA"
  },
  {
    name:     "Bu Primanita",
    phone:    "+6285750325925",
    initials: "BP"
  },
  {
    name:     "Onny",
    phone:    "+6289651758517",
    initials: "ON"
  },
  {
    name:     "Agung",
    phone:    "+6285882959315",
    initials: "AG"
  },
  {
    name:     "Thareq",
    phone:    "+6285787908406",
    initials: "TH"
  },
  /* ── Kontak baru ── */
  {
    name: "Pak Prima",
    phone: "+6282351862413",
    initials: "PP",
    desc: "Admin Matematika, Statistika, Operator UKT"
  },
  {
    name: "Surya Dharma",
    phone: "+62882019580331",
    initials: "SD",
    desc: "Admin IlmuKel, Fisika, Geofisika"
  },
  {
    name: "Raymount",
    phone: "+6285750114081",
    initials: "RM",
    desc: "Admin Sisfo, Siskom"
  },
  {
    name: "Bu Warsih",
    phone: "+6285750079543",
    initials: "BW",
    desc: "Admin S1 Kimia, S2 Kimia, Operator UKT"
  },
  {
    name: "Pak Udin",
    phone: "+6285252036331",
    initials: "PU",
    desc: "Admin Biologi"
  }
];

/* Warna avatar — seragam dengan BADGE_COLORS layanan-popup.js */
const KONTAK_AVATAR_COLORS = [
  { bg: "#e8f0fd", text: "#1a4f8a" },
  { bg: "#e6f7f0", text: "#0f6e56" },
  { bg: "#fef3e2", text: "#854f0b" },
  { bg: "#fce8f3", text: "#993556" },
  { bg: "#eeedfe", text: "#3c3489" }
];

/* ── Format nomor untuk tampilan (0858...) ── */
function ktFormatPhone(phone) {
  return phone.replace(/^\+62/, "0");
}

/* ── Buat URL WhatsApp ── */
function ktBuildWaUrl(phone) {
  const clean = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${clean}`;
}

/* ── SVG WhatsApp ── */
const KT_WA_SVG = `
<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="#fff">
  <path d="M16 2.9C8.8 2.9 3 8.7 3 15.9c0 2.3.6 4.5 1.8 6.5L3 29.1l6.9-1.8
           c1.9 1 4 1.6 6.1 1.6 7.2 0 13-5.8 13-13S23.2 2.9 16 2.9zm6.4 18.1
           c-.3.8-1.5 1.5-2.1 1.6-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.7-.6
           -3-1.3-4.9-4.3-5.1-4.5-.2-.2-1.3-1.7-1.3-3.2s.8-2.3 1.1-2.6
           c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5.2.5.8 2 .9 2.1.1.2.1.4 0 .6
           -.1.2-.2.3-.3.5-.1.2-.3.4-.4.5-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1
           c1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.7-.1
           .3.1 1.8.9 2.1 1 .3.2.5.3.6.4.1.3.1 1-.2 1.7z"/>
</svg>`;

/* ── Render daftar kontak ── */
function renderKontakList() {
  const container = document.getElementById("kt-list");
  if (!container) return;

  container.innerHTML = KONTAK_DATA.map((person, i) => {
    const color = KONTAK_AVATAR_COLORS[i % KONTAK_AVATAR_COLORS.length];
    const waUrl = ktBuildWaUrl(person.phone);

    return `
      <a class="kt-item"
         href="${waUrl}"
         target="_blank"
         rel="noopener noreferrer"
         aria-label="Chat WhatsApp dengan ${person.name}">
        <div class="kt-avatar"
             style="background:${color.bg};color:${color.text}">
          ${person.initials}
        </div>
        <div class="kt-info">
          <div class="kt-name">${person.name}</div>
          <div class="kt-desc">${person.desc || ""}</div>
        </div>
        <div class="kt-wa-icon">${KT_WA_SVG}</div>
      </a>`;
  }).join("");
}

/* ── Buka popup ── */
function openKontakPopup() {
  renderKontakList();
  document.getElementById("kt-overlay")?.classList.add("kt-open");
}

/* ── Tutup popup ── */
function closeKontakPopup() {
  document.getElementById("kt-overlay")?.classList.remove("kt-open");
}

/* ── Event listeners ── */
document.addEventListener("DOMContentLoaded", () => {
  /* Tombol X */
  document.getElementById("kt-close-btn")
    ?.addEventListener("click", closeKontakPopup);

  /* Klik overlay (luar modal) → tutup */
  document.getElementById("kt-overlay")
    ?.addEventListener("click", e => {
      if (e.target.id === "kt-overlay") closeKontakPopup();
    });

  /* Escape → tutup */
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeKontakPopup();
  });
});

// ═══ Expose globals untuk Vite build ═══
window.openKontakPopup = openKontakPopup;
window.closeKontakPopup = closeKontakPopup;
