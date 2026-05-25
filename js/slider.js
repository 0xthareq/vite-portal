/**
 * slider.js — Infinite loop slider dengan pause on hover,
 * restart delay setelah klik manual, dan stagger start.
 *
 * FIXES:
 *  - White flash: tambah loading placeholder + inline bg-cover on slide-bg
 *  - Popup navigasi: kirim (group, index) ke openPopup untuk image slides
 */

const sliderState = {
  1: { current: 1, total: 0 },
  2: { current: 1, total: 0 }
};

const sliderTimers = {
  1: { interval: null, restartTimeout: null },
  2: { interval: null, restartTimeout: null }
};

const SLIDER_INTERVAL = { 1: 5500, 2: 7000 };
const RESTART_DELAY   = 700;
const STAGGER_DELAY   = { 1: 0, 2: 2500 };

function setTrackPosition(num, animate) {
  const track = document.getElementById('track' + num);
  if (!track) return;
  if (!animate) track.style.transition = 'none';
  track.style.transform = `translateX(-${sliderState[num].current * 100}%)`;
  if (!animate) { track.offsetHeight; track.style.transition = ''; }
}

function updateDots(num) {
  const s = sliderState[num];
  const dotIndex = ((s.current - 1) % s.total + s.total) % s.total;
  document.querySelectorAll(`#dots${num} .dot`).forEach((d, i) =>
    d.classList.toggle('active', i === dotIndex)
  );
}

function goTo(num, idx) {
  const s = sliderState[num];
  if (!s.total) return;
  s.current = idx;
  setTrackPosition(num, true);
  updateDots(num);
}

function handleTransitionEnd(num) {
  const s = sliderState[num];
  if (s.current <= 0) {
    s.current = s.total; setTrackPosition(num, false);
  } else if (s.current >= s.total + 1) {
    s.current = 1; setTrackPosition(num, false);
  }
}

function startInterval(num) {
  const t = sliderTimers[num];
  clearInterval(t.interval);
  t.interval = setInterval(() => goTo(num, sliderState[num].current + 1), SLIDER_INTERVAL[num]);
}

function stopInterval(num) {
  clearInterval(sliderTimers[num].interval);
  sliderTimers[num].interval = null;
}

function resetInterval(num) {
  const t = sliderTimers[num];
  stopInterval(num);
  if (t.restartTimeout) clearTimeout(t.restartTimeout);
  t.restartTimeout = setTimeout(() => { startInterval(num); t.restartTimeout = null; }, RESTART_DELAY);
}

/* ─── FIX #1: Pasang loading placeholder agar slider tidak putih ─── */
function initSliderPlaceholder(num) {
  const track    = document.getElementById('track' + num);
  const viewport = track ? track.parentElement : null;
  if (viewport) {
    // Beri background gelap sementara agar tidak putih kosong
    viewport.style.background = 'linear-gradient(135deg, #1a3a6a 0%, #2d6cb0 100%)';
  }
  if (track) {
    track.innerHTML = `
      <div class="slide" style="display:flex;align-items:center;justify-content:center;">
        <div style="text-align:center;color:rgba(255,255,255,.5);font-size:13px;letter-spacing:.5px;">
          ⏳ Memuat...
        </div>
      </div>`;
  }
}

function buildSliders(slides) {
  [1, 2].forEach(num => {
    const group = slides.filter(s => s.slider === num);
    sliderState[num].total = group.length;

    const track = document.getElementById('track' + num);
    const dots  = document.getElementById('dots' + num);
    if (!track || !dots) return;
    track.innerHTML = ''; dots.innerHTML = '';

    // Reset placeholder background setelah data ada
    const viewport = track.parentElement;
    if (viewport) viewport.style.background = '';

    if (!group.length) {
      track.innerHTML = `<div class="slide"><div class="slide-bg" style="background:#e8f0fd"></div>
        <div class="slide-overlay"></div><div class="slide-content" style="text-align:center;width:100%;">
        <p style="color:rgba(255,255,255,.7);font-size:13px;">Belum ada slide. Tambahkan via Admin Panel.</p>
        </div></div>`;
      return;
    }

    const slideEls = group.map((slide, i) => {
      const hint = slide.popupType === 'pdf' ? '📄 Lihat PDF' : '🔍 Lihat Gambar';
      const el = document.createElement('div');
      el.className = 'slide';
      el.innerHTML = `
        <div class="slide-bg" style="
          background-image: url('${slide.imageUrl}');
          background-size: cover;
          background-position: center;
          position: absolute;
          inset: 0;
        "></div>
        <div class="slide-overlay"></div>
        <div class="slide-hint">${hint}</div>
        <div class="slide-content">
          <span class="slide-tag">${slide.tag}</span>
          <h2>${slide.title}</h2>
          <p>${slide.desc}</p>
        </div>`;

      /* ─── FIX #2: Kirim group + index agar popup bisa navigasi ─── */
      el.addEventListener('click', () => openPopup(slide, group, i));

      return el;
    });

    group.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', e => {
        e.stopPropagation();
        goTo(num, i + 1);
        resetInterval(num);
      });
      dots.appendChild(dot);
    });

    const cloneFirst = slideEls[0].cloneNode(true);
    const cloneLast  = slideEls[slideEls.length - 1].cloneNode(true);
    track.appendChild(cloneLast);
    slideEls.forEach(el => track.appendChild(el));
    track.appendChild(cloneFirst);

    sliderState[num].current = 1;
    setTrackPosition(num, false);
    updateDots(num);

    if (track._sliderHandler) track.removeEventListener('transitionend', track._sliderHandler);
    const handler = e => {
      if (e.target !== track || e.propertyName !== 'transform') return;
      handleTransitionEnd(num);
    };
    track._sliderHandler = handler;
    track.addEventListener('transitionend', handler);

    // Pause on hover
    const wrapper = track.closest('.slider-card') || track.parentElement;
    if (wrapper && !wrapper._hoverBound) {
      wrapper._hoverBound = true;
      wrapper.addEventListener('mouseenter', () => {
        stopInterval(num);
        const t = sliderTimers[num];
        if (t.restartTimeout) { clearTimeout(t.restartTimeout); t.restartTimeout = null; }
      });
      wrapper.addEventListener('mouseleave', () => {
        const t = sliderTimers[num];
        if (t.restartTimeout) clearTimeout(t.restartTimeout);
        t.restartTimeout = setTimeout(() => { startInterval(num); t.restartTimeout = null; }, 500);
      });
    }
  });
}

function startAuto() {
  [1, 2].forEach(num => {
    stopInterval(num);
    setTimeout(() => startInterval(num), STAGGER_DELAY[num]);
  });
}

function initSliderBtns() {
  // Pasang placeholder agar tidak putih saat data belum datang
  [1, 2].forEach(num => initSliderPlaceholder(num));

  document.querySelectorAll('.slider-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const num = +btn.dataset.slider;
      goTo(num, sliderState[num].current + +btn.dataset.dir);
      resetInterval(num);
    });
  });
}

document.addEventListener('DOMContentLoaded', initSliderBtns);
