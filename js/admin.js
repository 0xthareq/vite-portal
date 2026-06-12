/**
 * Portal Informasi v3 – Admin JS
 * Upload file ke GitHub via Vercel Serverless Functions
 * Features: Hide/Show slide, Drag & Drop reorder
 */

let slides = [];
let news   = [];
let editing  = { slide: null, news: null };
let tempImgUrl = null;
let tempPdfUrl = null;
let isUploading = false;

// ── INIT ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  const session = await requireAuth();
  if (!session) return;

  el('sidebarUser').textContent = session.displayName;
  el('sidebarRole').textContent = session.role;

  await loadData();
  initUploads();
  initModals();
  initSidebarNav();

  document.querySelectorAll('input[name="popupType"]').forEach(r =>
    r.addEventListener('change', () => togglePdfSection(r.value))
  );
});

// ── SIDEBAR ACTIVE STATE ───────────────────────────────────
function initSidebarNav() {
  const navLinks = document.querySelectorAll('.sidebar-nav a[href^="#"]');

  function setActive(link) {
    navLinks.forEach(l => l.classList.remove('active'));
    if (link) link.classList.add('active');
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => setActive(link));
  });

  const scrollEl = document.querySelector('.main-wrap') || window;

  function onScroll() {
    const sections_ = [
      { el: el('sec1'),    link: document.querySelector('.sidebar-nav a[href="#sec1"]') },
      { el: el('sec2'),    link: document.querySelector('.sidebar-nav a[href="#sec2"]') },
      { el: el('secNews'), link: document.querySelector('.sidebar-nav a[href="#secNews"]') },
    ];
    let active = document.querySelector('.sidebar-nav a[href="#"]');
    sections_.forEach(s => {
      if (!s.el) return;
      if (s.el.getBoundingClientRect().top <= 120) active = s.link;
    });
    setActive(active);
  }

  scrollEl.addEventListener('scroll', onScroll, { passive: true });
  setActive(document.querySelector('.sidebar-nav a[href="#"]'));
}

// ── LOAD DATA dari API ────────────────────────────────
async function loadData() {
  showPageLoading(true);
  try {
    const data = await fetchPortalData(true);
    slides = data.slides || [];
    news   = data.news   || [];
    renderAll();
  } catch (err) {
    toastMsg('Gagal memuat data: ' + err.message, 'err');
  } finally {
    showPageLoading(false);
  }
}

function showPageLoading(show) {
  const spinner = el('pageSpinner');
  if (spinner) spinner.style.display = show ? 'flex' : 'none';
}

function renderAll() {
  renderSliders();
  renderNews();
  updateStats();
}

// ── STATS ─────────────────────────────────────────────
function updateStats() {
  el('sSl1').textContent  = slides.filter(s => s.slider === 1).length;
  el('sSl2').textContent  = slides.filter(s => s.slider === 2).length;
  el('sNews').textContent = news.length;
  el('sPdf').textContent  = slides.filter(s => s.popupType === 'pdf').length;
  const hiddenEl = el('sHidden');
  if (hiddenEl) hiddenEl.textContent = slides.filter(s => s.hidden === true).length;
}

// ── RENDER SLIDES ─────────────────────────────────────
function renderSliders() {
  [1, 2].forEach(num => {
    const container = el('list' + num);
    if (!container) return;
    const group = slides.filter(s => s.slider === num);
    container.innerHTML = group.length === 0
      ? `<div style="padding:24px;text-align:center;color:var(--text-muted);font-size:13px;">
           Belum ada slide. Klik <strong>+ Tambah Slide</strong>.
         </div>`
      : group.map(s => slideItemHTML(s)).join('');
    initDragSort(container, num);
  });
}

// ── SLIDE ITEM HTML ───────────────────────────────────
function slideItemHTML(s) {
  const tagClass = 'tag-' + s.tag.toLowerCase().replace(/\s/g, '');
  const isHidden = s.hidden === true;
  return `
  <div class="slider-item${isHidden ? ' slide-hidden' : ''}" data-id="${s.id}" draggable="true">
    <div class="s-drag-handle" title="Geser untuk mengubah urutan">⠿</div>
    <div class="s-thumb" onclick="previewImg('${s.imageUrl}')">
      <img src="${s.imageUrl}" alt="${s.title}"
           onerror="this.src='https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200'"/>
      <div class="s-thumb-ov">🔍</div>
      ${isHidden ? '<div class="s-thumb-hidden-ov">🚫</div>' : ''}
    </div>
    <div class="s-info">
      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
        <span class="s-tag ${tagClass}">${s.tag}</span>
        ${isHidden ? '<span class="badge-hidden">Tersembunyi</span>' : ''}
      </div>
      <div class="s-title">${s.title}</div>
      <div class="s-desc">${s.desc}</div>
      <span class="popup-badge ${s.popupType}">
        ${s.popupType === 'pdf' ? '📄 Popup PDF' : '🖼️ Popup Gambar'}
        ${s.popupUrl ? ' ✅' : ' ⚠️ belum ada file'}
      </span>
    </div>
    <div class="s-actions">
      <button class="btn btn-ghost btn-sm" onclick="openEditSlide('${s.id}')">✏️ Edit</button>
      <button class="btn btn-sm ${isHidden ? 'btn-success' : 'btn-warning'}" onclick="toggleHideSlide('${s.id}')">
        ${isHidden ? '👁️ Tampilkan' : '🙈 Sembunyikan'}
      </button>
      <button class="btn btn-danger btn-sm" onclick="deleteSlide('${s.id}')">🗑️</button>
    </div>
  </div>`;
}

// ── DRAG & DROP SORT ──────────────────────────────────
function initDragSort(container, sliderNum) {
  let dragEl      = null;
  let placeholder = null;

  function getItems() {
    return [...container.querySelectorAll('.slider-item[data-id]')];
  }

  container.querySelectorAll('.slider-item').forEach(item => {
    // Hanya trigger drag dari handle
    const handle = item.querySelector('.s-drag-handle');
    if (handle) {
      handle.addEventListener('mousedown', () => { item.draggable = true; });
      handle.addEventListener('mouseup',   () => { item.draggable = false; });
    }

    item.addEventListener('dragstart', e => {
      dragEl = item;
      placeholder = document.createElement('div');
      placeholder.className = 'drag-placeholder';
      placeholder.style.height = item.offsetHeight + 'px';
      item.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      // Tutup opacity setelah frame berikut agar drag image tidak kosong
      requestAnimationFrame(() => { item.style.opacity = '0.35'; });
    });

    item.addEventListener('dragend', async () => {
      if (!dragEl) return;
      dragEl.style.opacity = '';
      dragEl.classList.remove('dragging');
      if (placeholder && placeholder.parentNode) placeholder.remove();
      dragEl = null;
      placeholder = null;

      // Baca urutan baru dari DOM
      const newOrder = getItems().map(el => el.dataset.id);

      const otherSlides = slides.filter(s => s.slider !== sliderNum);
      const thisSlides  = slides.filter(s => s.slider === sliderNum);
      const reordered   = newOrder.map(id => thisSlides.find(s => s.id === id)).filter(Boolean);
      const missing     = thisSlides.filter(s => !newOrder.includes(s.id));
      slides = [...otherSlides, ...reordered, ...missing];

      try {
        await savePortalData(slides, news);
        toastMsg('✅ Urutan slide disimpan');
        updateStats();
      } catch (err) {
        toastMsg('Gagal menyimpan urutan: ' + err.message, 'err');
        renderSliders(); // rollback visual
      }
    });
  });

  container.addEventListener('dragover', e => {
    e.preventDefault();
    if (!dragEl) return;
    const target = e.target.closest('.slider-item');
    if (!target || target === dragEl) return;

    const rect = target.getBoundingClientRect();
    const mid  = rect.top + rect.height / 2;

    if (placeholder && placeholder.parentNode) placeholder.remove();
    placeholder = document.createElement('div');
    placeholder.className = 'drag-placeholder';
    placeholder.style.height = dragEl.offsetHeight + 'px';

    if (e.clientY < mid) {
      container.insertBefore(placeholder, target);
      container.insertBefore(dragEl, placeholder);
    } else {
      target.after(placeholder);
      placeholder.after(dragEl);
    }
  });

  container.addEventListener('dragleave', e => {
    if (!container.contains(e.relatedTarget) && placeholder) {
      placeholder.remove();
    }
  });
}

// ── TOGGLE HIDE SLIDE ─────────────────────────────────
async function toggleHideSlide(id) {
  const idx = slides.findIndex(s => s.id === id);
  if (idx === -1) return;
  const newHidden = !slides[idx].hidden;
  slides[idx] = { ...slides[idx], hidden: newHidden };
  try {
    await savePortalData(slides, news);
    renderAll();
    toastMsg(newHidden ? '🙈 Slide disembunyikan dari website' : '👁️ Slide ditampilkan kembali');
  } catch (err) {
    slides[idx] = { ...slides[idx], hidden: !newHidden }; // rollback
    toastMsg('Gagal mengubah visibilitas: ' + err.message, 'err');
  }
}

// ── ADD SLIDE ─────────────────────────────────────────
function openAddSlide(num) {
  editing.slide = null;
  tempImgUrl = null; tempPdfUrl = null;
  el('slideModalTitle').textContent = `➕ Tambah Slide – Slider ${num}`;
  el('editSliderNum').value = num;
  el('editTag').value   = 'Pengumuman';
  el('editTitle').value = '';
  el('editDesc').value  = '';
  document.querySelector('input[name="popupType"][value="image"]').checked = true;
  togglePdfSection('image');
  resetUploadUI();
  el('slideModal').classList.add('open');
}

// ── EDIT SLIDE ────────────────────────────────────────
function openEditSlide(id) {
  const s = slides.find(x => x.id === id);
  if (!s) return;
  editing.slide = id;
  tempImgUrl = null; tempPdfUrl = null;

  el('slideModalTitle').textContent = '✏️ Edit Slide';
  el('editSliderNum').value = s.slider;
  el('editTag').value   = s.tag;
  el('editTitle').value = s.title;
  el('editDesc').value  = s.desc;
  document.querySelector(`input[name="popupType"][value="${s.popupType}"]`).checked = true;
  togglePdfSection(s.popupType);

  if (s.imageUrl) {
    el('imgCurrentUrl').textContent = '✅ Gambar: ' + s.imageUrl.split('/').pop().slice(0, 40);
    el('imgCurrentUrl').style.display = 'block';
  }
  if (s.popupUrl && s.popupType === 'pdf') {
    el('pdfCurrentUrl').textContent = '✅ PDF: ' + s.popupUrl.split('/').pop().slice(0, 40);
    el('pdfCurrentUrl').style.display = 'block';
  }

  el('slideModal').classList.add('open');
}

// ── SAVE SLIDE ────────────────────────────────────────
async function saveSlide() {
  if (isUploading) { toastMsg('Masih ada upload yang berjalan...', 'err'); return; }

  const title = el('editTitle').value.trim();
  if (!title) { toastMsg('Judul slide wajib diisi', 'err'); return; }

  const sliderNum = +el('editSliderNum').value;
  const popupType = document.querySelector('input[name="popupType"]:checked').value;

  const btn = el('btnSaveSlide');
  btn.disabled = true; btn.textContent = '⏳ Menyimpan...';

  try {
    if (editing.slide) {
      const idx = slides.findIndex(s => s.id === editing.slide);
      if (idx === -1) throw new Error('Slide tidak ditemukan');
      slides[idx] = {
        ...slides[idx],
        tag:        el('editTag').value,
        title,
        desc:       el('editDesc').value.trim(),
        popupType,
        imageUrl:   tempImgUrl || slides[idx].imageUrl,
        popupUrl:   popupType === 'image'
                      ? (tempImgUrl || slides[idx].popupUrl)
                      : (tempPdfUrl || slides[idx].popupUrl),
        popupLabel: title
      };
    } else {
      slides.push({
        id:         genId('sl'),
        slider:     sliderNum,
        tag:        el('editTag').value,
        title,
        desc:       el('editDesc').value.trim(),
        imageUrl:   tempImgUrl || '',
        popupType,
        popupUrl:   popupType === 'image' ? (tempImgUrl || '') : (tempPdfUrl || ''),
        popupLabel: title,
        hidden:     false   // ← default visible
      });
    }

    await savePortalData(slides, news);
    renderAll();
    closeSlideModal();
    toastMsg('Slide berhasil disimpan ✅ — website akan update dalam ~1 menit');
  } catch (err) {
    toastMsg('Gagal menyimpan: ' + err.message, 'err');
  } finally {
    btn.disabled = false; btn.textContent = '💾 Simpan';
  }
}

// ── DELETE SLIDE ──────────────────────────────────────
async function deleteSlide(id) {
  if (!confirm('Hapus slide ini?')) return;
  slides = slides.filter(s => s.id !== id);
  try {
    await savePortalData(slides, news);
    renderAll();
    toastMsg('Slide dihapus', 'err');
  } catch (err) {
    toastMsg('Gagal hapus: ' + err.message, 'err');
  }
}

function closeSlideModal() {
  el('slideModal').classList.remove('open');
  editing.slide = null;
  resetUploadUI();
}

function togglePdfSection(type) {
  el('pdfSection').style.display = type === 'pdf' ? 'block' : 'none';
}

function resetUploadUI() {
  el('imgPre').classList.remove('show');
  el('pdfPre').classList.remove('show');
  el('imgCurrentUrl').style.display = 'none';
  el('pdfCurrentUrl').style.display = 'none';
  el('imgCurrentUrl').textContent = '';
  el('pdfCurrentUrl').textContent = '';
  el('imgUploadStatus').style.display = 'none';
  el('imgUploadStatus').textContent = '';
  el('pdfUploadStatus').style.display = 'none';
  el('pdfUploadStatus').textContent = '';
}

// ── FILE UPLOADS ──────────────────────────────────────
function initUploads() {
  setupZone('imgZone', 'imgFile', 'image/*', async file => {
    if (file.size > 5 * 1024 * 1024) { toastMsg('Ukuran gambar maks 5MB', 'err'); return; }

    el('imgUploadStatus').textContent = '⏳ Mengupload gambar...';
    el('imgUploadStatus').style.display = 'block';
    isUploading = true;

    try {
      const result = await uploadImage(file);
      tempImgUrl = result.url;
      el('imgPreview').src = tempImgUrl;
      el('imgPre').classList.add('show');
      el('imgUploadStatus').textContent = '✅ Gambar berhasil diupload ke GitHub';
      toastMsg('Gambar berhasil diupload ✅');
    } catch (err) {
      el('imgUploadStatus').textContent = '❌ ' + err.message;
      toastMsg(err.message, 'err');
    } finally {
      isUploading = false;
    }
  });

  setupZone('pdfZone', 'pdfFile', 'application/pdf', async file => {
    if (file.size > 10 * 1024 * 1024) { toastMsg('Ukuran PDF maks 10MB', 'err'); return; }

    el('pdfUploadStatus').textContent = '⏳ Mengupload PDF...';
    el('pdfUploadStatus').style.display = 'block';
    isUploading = true;

    try {
      const result = await uploadPdf(file);
      tempPdfUrl = result.url;
      el('pdfPreContent').innerHTML = `<div class="pdf-pre-box">📄 ${file.name} (${formatSize(file.size)})</div>`;
      el('pdfPre').classList.add('show');
      el('pdfUploadStatus').textContent = '✅ PDF berhasil diupload ke GitHub';
      toastMsg('PDF berhasil diupload ✅');
    } catch (err) {
      el('pdfUploadStatus').textContent = '❌ ' + err.message;
      toastMsg(err.message, 'err');
    } finally {
      isUploading = false;
    }
  });
}

function setupZone(zoneId, inputId, accept, handler) {
  const zone  = el(zoneId);
  const input = el(inputId);
  if (!zone || !input) return;
  zone.addEventListener('click', () => input.click());
  input.addEventListener('change', () => { if (input.files[0]) handler(input.files[0]); });
  zone.addEventListener('dragover',  e => { e.preventDefault(); zone.classList.add('over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('over'));
  zone.addEventListener('drop', e => {
    e.preventDefault(); zone.classList.remove('over');
    if (e.dataTransfer.files[0]) handler(e.dataTransfer.files[0]);
  });
}

// ── NEWS ──────────────────────────────────────────────
function renderNews() {
  const tbody = el('newsTbody');
  if (!tbody) return;
  tbody.innerHTML = news.length === 0
    ? `<tr><td colspan="3" style="text-align:center;padding:24px;color:var(--text-muted);">Belum ada berita.</td></tr>`
    : news.map((n, i) => `
      <tr>
        <td><span style="font-size:11px;background:#e8f0fd;color:#1a4f8a;padding:2px 8px;border-radius:4px;font-weight:700;">${n.date}</span></td>
        <td style="font-size:13px;">
          ${n.text}
          ${n.pdfLink
            ? `<br><span style="color:#d97706;font-weight:600;font-size:12px;">📄 PDF Link tersedia</span>`
            : n.link
              ? `<br><a href="${n.link}" target="_blank" style="color:#1a4f8a;font-weight:600;font-size:12px;">🔗 Lihat</a>`
              : ''}
        </td>
        <td><div style="display:flex;gap:6px;">
          <button class="btn btn-ghost btn-sm" onclick="openEditNews(${i})">✏️</button>
          <button class="btn btn-danger btn-sm" onclick="deleteNews(${i})">🗑️</button>
        </div></td>
      </tr>`).join('');
}

function openAddNews() {
  editing.news = null;
  el('newsModalTitle').textContent = '➕ Tambah Berita';
  el('newsDate').value = ''; el('newsText').value = '';
  el('newsLink').value = ''; el('newsPdfLink').value = '';
  el('newsModal').classList.add('open');
}

function openEditNews(idx) {
  editing.news = idx;
  el('newsModalTitle').textContent = '✏️ Edit Berita';
  el('newsDate').value    = news[idx].date;
  el('newsText').value    = news[idx].text;
  el('newsLink').value    = news[idx].link || '';
  el('newsPdfLink').value = news[idx].pdfLink || '';
  el('newsModal').classList.add('open');
}

async function saveNews_() {
  const date    = el('newsDate').value.trim();
  const text    = el('newsText').value.trim();
  const link    = el('newsLink').value.trim();
  const pdfLink = el('newsPdfLink').value.trim();

  if (!date || !text) { toastMsg('Tanggal dan isi berita wajib diisi', 'err'); return; }

  const btn = el('btnSaveNews');
  btn.disabled = true; btn.textContent = '⏳ Menyimpan...';

  try {
    if (editing.news !== null) {
      news[editing.news] = { ...news[editing.news], date, text, link, pdfLink };
    } else {
      news.unshift({ id: genId('n'), date, text, link, pdfLink });
    }
    await savePortalData(slides, news);
    renderNews(); updateStats();
    closeNewsModal();
    toastMsg('Berita berhasil disimpan ✅');
  } catch (err) {
    toastMsg('Gagal: ' + err.message, 'err');
  } finally {
    btn.disabled = false; btn.textContent = '💾 Simpan';
  }
}

async function deleteNews(idx) {
  if (!confirm('Hapus berita ini?')) return;
  news.splice(idx, 1);
  try {
    await savePortalData(slides, news);
    renderNews(); updateStats();
    toastMsg('Berita dihapus', 'err');
  } catch (err) {
    toastMsg('Gagal hapus: ' + err.message, 'err');
  }
}

function closeNewsModal() {
  el('newsModal').classList.remove('open');
  editing.news = null;
}

// ── PREVIEW IMAGE ─────────────────────────────────────
function previewImg(url) {
  if (!url) return;
  el('prevContent').innerHTML = `<img src="${url}" style="max-width:88vw;max-height:88vh;display:block;border-radius:12px;" />`;
  el('prevOv').classList.add('open');
}

// ── MODALS ────────────────────────────────────────────
function initModals() {
  ['slideModal', 'newsModal', 'prevOv'].forEach(id => {
    const o = el(id);
    if (o) o.addEventListener('click', e => {
      if (e.target !== o) return;
      if (id === 'slideModal') closeSlideModal();
      if (id === 'newsModal')  closeNewsModal();
      if (id === 'prevOv')     o.classList.remove('open');
    });
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    closeSlideModal(); closeNewsModal();
    el('prevOv')?.classList.remove('open');
  });
}

// ── TOAST ─────────────────────────────────────────────
function toastMsg(msg, type = 'ok') {
  const wrap = el('toastWrap');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${type === 'ok' ? '✅' : '❌'}</span> ${msg}`;
  wrap.appendChild(t);
  setTimeout(() => t.remove(), 4000);
}

// ── LOGOUT ────────────────────────────────────────────
function logout() {
  if (!confirm('Yakin ingin keluar?')) return;
  destroySession();
  window.location.href = 'login.html';
}

// ── HELPER ────────────────────────────────────────────
function el(id) { return document.getElementById(id); }
function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
function genId(prefix = 'id') {
  return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}