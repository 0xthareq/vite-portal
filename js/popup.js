
let _popupGroup = [];
let _popupIdx   = 0;

/* ─── BUKA POPUP ────────────────────────────────────────────────
 * @param {Object} slide      - data slide yang diklik
 * @param {Array}  allSlides  - semua slide dalam grup (opsional)
 * @param {number} index      - index slide yang diklik dalam allSlides
 */
function openPopup(slide, allSlides, index) {
  const overlay = document.getElementById('popupOverlay');
  const inner   = document.getElementById('popupInner');

  if (slide.popupType === 'pdf') {

    /* ── PDF diklik langsung (tanpa group navigasi) ── */
    _popupGroup = [];
    _popupIdx   = 0;

    if (slide.popupUrl) {
      if (slide.popupUrl.startsWith('data:')) {
        inner.innerHTML = buildPdfFallback(slide, slide.popupUrl);
      } else {
        inner.innerHTML = buildPdfEmbed(slide);
      }
    } else {
      inner.innerHTML = buildPdfNotUploaded(slide);
    }

  } else {

    /* ── IMAGE popup — dengan navigasi kalau ada group ── */
    if (allSlides && allSlides.length > 1) {
      _popupGroup = allSlides;
      _popupIdx   = (typeof index === 'number') ? index : 0;
    } else {
      _popupGroup = [slide];
      _popupIdx   = 0;
    }
    renderPopupSlide(inner);
  }

  overlay.classList.add('open');
}

/* ─── Render slide (image ATAU pdf) saat navigasi ──────────────
 * FIX: cek popupType per-slide agar PDF dalam group tetap tampil
 */
function renderPopupSlide(inner) {
  if (!inner) inner = document.getElementById('popupInner');
  const slide  = _popupGroup[_popupIdx];
  const total  = _popupGroup.length;
  const hasNav = total > 1;

  const navPrev = hasNav ? `
    <button class="popup-nav-btn popup-nav-prev" onclick="navigateImagePopup(-1)" title="Sebelumnya">
      &#8592;
    </button>` : '';

  const navNext = hasNav ? `
    <button class="popup-nav-btn popup-nav-next" onclick="navigateImagePopup(1)" title="Berikutnya">
      &#8594;
    </button>` : '';

  const navCounter = hasNav ? `
    <div class="popup-nav-counter">${_popupIdx + 1} / ${total}</div>` : '';

  if (slide.popupType === 'pdf') {

    /* ── Slide PDF dalam group — tampil dengan tombol navigasi ── */
    if (slide.popupUrl && !slide.popupUrl.startsWith('data:')) {

      const iframeSrc = slide.popupUrl.startsWith('/api/get-file')
        ? slide.popupUrl
        : `https://docs.google.com/viewer?url=${encodeURIComponent(slide.popupUrl)}&embedded=true`;

      const downloadBtn = `
        <a href="${slide.popupUrl}" target="_blank" rel="noopener"
          style="margin-left:auto;font-size:11px;color:rgba(255,255,255,.75);
                 text-decoration:none;padding:3px 10px;
                 background:rgba(255,255,255,.15);border-radius:6px;">
          ⬇️ Download
        </a>`;

      inner.innerHTML = `
        <div class="popup-pdf-wrap" style="position:relative;">
          ${navPrev}
          <div class="popup-pdf-header">
            📄 ${slide.popupLabel || slide.title}
            ${downloadBtn}
          </div>
          <div class="popup-pdf-body">
            <iframe src="${iframeSrc}" frameborder="0" allowfullscreen></iframe>
          </div>
          ${navNext}
          ${navCounter}
        </div>`;

    } else {

      /* PDF belum diupload tapi tetap ada navigasi */
      inner.innerHTML = `
        <div style="position:relative;width:min(380px,88vw);background:#fff;
                    border-radius:16px;padding:36px 28px;text-align:center;">
          ${navPrev}
          <div style="font-size:48px;margin-bottom:12px;">📄</div>
          <div style="font-size:14px;font-weight:700;color:#1a4f8a;margin-bottom:8px;">
            ${slide.popupLabel || slide.title}
          </div>
          <div style="font-size:13px;color:#5a6e82;">
            File PDF belum diunggah.<br>
            Upload melalui <strong>Admin Panel</strong>.
          </div>
          ${navNext}
          ${navCounter}
        </div>`;
    }

  } else {

    /* ── Slide IMAGE — seperti semula ── */
    const src = slide.popupUrl || slide.imageUrl;

    inner.innerHTML = `
      <div class="popup-img" style="position:relative;">
        ${navPrev}
        <img
          src="${src}"
          alt="${slide.title}"
          style="display:block;max-height:80vh;max-width:min(90vw,900px);border-radius:12px;"
        />
        ${navNext}
        ${navCounter}
        ${slide.title ? `<div class="popup-nav-caption">${slide.title}</div>` : ''}
      </div>`;
  }
}

/* ─── Alias agar kode lama (renderImagePopup) tetap kompatibel ── */
function renderImagePopup(inner) {
  renderPopupSlide(inner);
}

/* ─── Navigasi popup (image & pdf) ─────────────────────────────── */
function navigateImagePopup(dir) {
  _popupIdx = (_popupIdx + dir + _popupGroup.length) % _popupGroup.length;
  renderPopupSlide();
}

/* ─── Keyboard navigasi ─────────────────────────────────────────── */
function _handlePopupKey(e) {
  if (!document.getElementById('popupOverlay').classList.contains('open')) return;
  if (_popupGroup.length <= 1) return;
  if (e.key === 'ArrowLeft')  navigateImagePopup(-1);
  if (e.key === 'ArrowRight') navigateImagePopup(1);
}

/* ─── Helper: PDF embed iframe ──────────────────────────────────── */
function buildPdfEmbed(slide) {
  const isProxyUrl  = slide.popupUrl.startsWith('/api/get-file');
  const iframeSrc   = isProxyUrl
    ? slide.popupUrl
    : `https://docs.google.com/viewer?url=${encodeURIComponent(slide.popupUrl)}&embedded=true`;

  const downloadBtn = `
    <a href="${slide.popupUrl}" target="_blank" rel="noopener"
      style="margin-left:auto;font-size:11px;color:rgba(255,255,255,.75);
             text-decoration:none;padding:3px 10px;
             background:rgba(255,255,255,.15);border-radius:6px;">
      ⬇️ Download
    </a>`;

  return `
    <div class="popup-pdf-wrap">
      <div class="popup-pdf-header">
        📄 ${slide.popupLabel || slide.title}
        ${downloadBtn}
      </div>
      <div class="popup-pdf-body">
        <iframe src="${iframeSrc}" frameborder="0" allowfullscreen></iframe>
      </div>
    </div>`;
}

/* ─── Helper: PDF belum diupload ────────────────────────────────── */
function buildPdfNotUploaded(slide) {
  return `
    <div style="width:min(380px,88vw);background:#fff;border-radius:16px;
                padding:36px 28px;text-align:center;">
      <div style="font-size:48px;margin-bottom:12px;">📄</div>
      <div style="font-size:14px;font-weight:700;color:#1a4f8a;margin-bottom:8px;">
        ${slide.popupLabel || slide.title}
      </div>
      <div style="font-size:13px;color:#5a6e82;">
        File PDF belum diunggah.<br>
        Upload melalui <strong>Admin Panel</strong>.
      </div>
    </div>`;
}

/* ─── Fallback PDF base64 ───────────────────────────────────────── */
function buildPdfFallback(slide, url) {
  const isBase64 = url.startsWith('data:');
  return `
    <div style="width:min(360px,88vw);background:#fff;border-radius:16px;
                padding:28px 24px;text-align:center;">
      <div style="font-size:48px;margin-bottom:12px;">📄</div>
      <div style="font-size:15px;font-weight:700;color:#1a4f8a;margin-bottom:8px;">
        ${slide.popupLabel || slide.title}
      </div>
      <div style="font-size:13px;color:#5a6e82;margin-bottom:20px;line-height:1.6;">
        Klik tombol di bawah untuk membuka atau mendownload PDF.
      </div>
      <a href="${url}"
        ${isBase64 ? 'download="dokumen.pdf"' : 'target="_blank" rel="noopener"'}
        style="display:flex;align-items:center;justify-content:center;gap:8px;
               background:#1a4f8a;color:#fff;font-size:14px;font-weight:700;
               padding:12px 24px;border-radius:10px;text-decoration:none;width:100%;">
        📖 Buka / Download PDF
      </a>
    </div>`;
}

/* ─── Tutup popup ────────────────────────────────────────────────── */
function closePopup() {
  const overlay = document.getElementById('popupOverlay');
  overlay.classList.remove('open');
  _popupGroup = [];
  _popupIdx   = 0;
  setTimeout(() => {
    const inner = document.getElementById('popupInner');
    if (inner) inner.innerHTML = '';
  }, 250);
}

/* ─── Event listeners ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('popupClose')?.addEventListener('click', closePopup);

  document.getElementById('popupOverlay')?.addEventListener('click', e => {
    if (e.target.id === 'popupOverlay') closePopup();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closePopup(); return; }
    _handlePopupKey(e);
  });
});

/* ─── Style tombol navigasi (inject sekali) ──────────────────────── */
(function injectPopupNavStyle() {
  if (document.getElementById('popup-nav-style')) return;
  const style = document.createElement('style');
  style.id = 'popup-nav-style';
  style.textContent = `
    .popup-nav-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(0,0,0,.55);
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 44px;
      height: 44px;
      font-size: 20px;
      cursor: pointer;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background .2s, transform .2s;
      user-select: none;
    }
    .popup-nav-btn:hover {
      background: rgba(26,79,138,.85);
      transform: translateY(-50%) scale(1.1);
    }
    .popup-nav-prev { left: -22px; }
    .popup-nav-next { right: -22px; }

    @media (max-width: 600px) {
      .popup-nav-prev { left: 8px; }
      .popup-nav-next { right: 8px; }
    }

    .popup-nav-counter {
      position: absolute;
      bottom: -32px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,.5);
      color: #fff;
      font-size: 12px;
      padding: 3px 10px;
      border-radius: 20px;
      white-space: nowrap;
    }

    .popup-nav-caption {
      position: absolute;
      bottom: -60px;
      left: 50%;
      transform: translateX(-50%);
      color: rgba(255,255,255,.8);
      font-size: 13px;
      font-weight: 600;
      white-space: nowrap;
      max-width: 80vw;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .popup-img {
      padding-bottom: 70px;
    }

    /* PDF dalam group navigasi */
    .popup-pdf-wrap {
      position: relative;
    }
    .popup-pdf-wrap .popup-nav-btn {
      top: 50%;
    }
    .popup-pdf-wrap .popup-nav-counter {
      bottom: 8px;
      left: 50%;
    }
  `;
  document.head.appendChild(style);
})();
// ═══ Expose globals untuk Vite build ═══
window.openPopup = typeof openPopup !== 'undefined' ? openPopup : undefined;
window.closePopup = typeof closePopup !== 'undefined' ? closePopup : undefined;
window.navigateImagePopup = typeof navigateImagePopup !== 'undefined' ? navigateImagePopup : undefined;
