/**
 * news.js — Build daftar berita di frontend.
 * Mendukung field pdfLink opsional → popup PDF (bukan new tab).
 *
 * FIX: Google Drive URL kini dikonversi ke /preview (embed native),
 *      sehingga tidak lagi menampilkan HTML mentah di iframe.
 */

/**
 * Konversi berbagai format URL Google Drive ke URL embed /preview.
 * Format yang didukung:
 *   https://drive.google.com/file/d/FILE_ID/view?...
 *   https://drive.google.com/file/d/FILE_ID/edit
 *   https://drive.google.com/open?id=FILE_ID
 *   https://drive.google.com/uc?id=FILE_ID&export=...
 */
function toGDriveEmbedUrl(url) {
  try {
    // Sudah format preview → kembalikan apa adanya
    if (/drive\.google\.com\/file\/d\/.+\/preview/.test(url)) return url;

    // Format: /file/d/FILE_ID/...
    const fileMatch = url.match(/drive\.google\.com\/file\/d\/([^/?&#]+)/);
    if (fileMatch) return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;

    // Format: ?id=FILE_ID atau open?id=FILE_ID atau uc?id=FILE_ID
    const idMatch = url.match(/[?&]id=([^&]+)/);
    if (idMatch && url.includes('drive.google.com')) {
      return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
    }
  } catch (_) {}
  return null; // bukan Google Drive
}

/**
 * Tentukan URL yang tepat untuk iframe PDF.
 *   1. Proxy internal  → gunakan langsung
 *   2. Google Drive    → konversi ke /preview
 *   3. URL lain        → pakai Google Docs Viewer sebagai fallback
 */
function resolvePdfIframeSrc(pdfUrl) {
  if (pdfUrl.startsWith('/api/get-file')) return pdfUrl;

  const gdrive = toGDriveEmbedUrl(pdfUrl);
  if (gdrive) return gdrive;

  // Fallback: Google Docs Viewer (untuk URL PDF publik non-Drive)
  return `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
}

// ─────────────────────────────────────────────────────────────────────────────

function buildNews(news) {
  const list = document.getElementById('newsList');
  if (!list) return;

  if (!news || news.length === 0) {
    list.innerHTML = `
      <li style="color:var(--text-muted);font-size:13px;padding:8px 0;">
        Belum ada berita.
      </li>`;
    return;
  }

  list.innerHTML = news.map(item => {
    let contentHtml;

    if (item.pdfLink) {
      // Ada PDF link → klik buka popup PDF (bukan new tab)
      contentHtml = `
        <div class="news-text news-clickable"
             onclick="openNewsPdf('${item.pdfLink}', '${(item.text || '').replace(/'/g, "\\'")}')"
             title="Klik untuk buka PDF">
          ${item.text}
          <span class="news-pdf-badge">📄 PDF</span>
        </div>`;
    } else if (item.link) {
      // Ada link biasa → buka new tab
      contentHtml = `
        <div class="news-text">
          <a href="${item.link}" target="_blank" style="color:#1a4f8a;">
            ${item.text}
          </a>
        </div>`;
    } else {
      contentHtml = `<div class="news-text">${item.text}</div>`;
    }

    return `
      <li>
        <div class="news-date">${item.date}</div>
        ${contentHtml}
      </li>`;
  }).join('');
}

/**
 * Buka PDF berita sebagai popup (sama seperti popup slide PDF).
 * Sekarang menangani URL Google Drive dengan benar.
 */
function openNewsPdf(pdfUrl, label) {
  const overlay = document.getElementById('popupOverlay');
  const inner   = document.getElementById('popupInner');
  if (!overlay || !inner) { window.open(pdfUrl, '_blank'); return; }

  const iframeSrc = resolvePdfIframeSrc(pdfUrl);

  inner.innerHTML = `
    <div class="popup-pdf-wrap">
      <div class="popup-pdf-header">
        📄 ${label}
        <a href="${pdfUrl}" target="_blank" rel="noopener"
          style="margin-left:auto;font-size:11px;color:rgba(255,255,255,.75);
          text-decoration:none;padding:3px 10px;
          background:rgba(255,255,255,.15);border-radius:6px;">
          ⬇️ Download
        </a>
      </div>
      <div class="popup-pdf-body">
        <iframe src="${iframeSrc}" frameborder="0" allowfullscreen
                onload="this.style.opacity='1'"
                style="opacity:0;transition:opacity .3s;"></iframe>
      </div>
    </div>`;

  overlay.classList.add('open');
}