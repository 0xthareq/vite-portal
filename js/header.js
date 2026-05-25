/**
 * header.js
 * Glassmorphism header dengan scroll shrink ke floating pill
 */

// ── Scroll: tambah/hapus class .scrolled ──
(function initScrollHeader() {
  const header = document.querySelector('header');
  if (!header) return;

  const THRESHOLD = 80;

  function onScroll() {
    if (window.scrollY > THRESHOLD) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // cek posisi awal
})();

// ── Hamburger mobile ──
function initHamburger() {
  const ham = document.getElementById('hamburger');
  const nav = document.getElementById('mobileNav');
  if (!ham || !nav) return;

  ham.addEventListener('click', (e) => {
    e.stopPropagation();
    ham.classList.toggle('open');
    nav.classList.toggle('open');
  });

  // Tutup saat klik link
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      ham.classList.remove('open');
      nav.classList.remove('open');
    });
  });

  // Tutup saat klik di luar
  document.addEventListener('click', (e) => {
    if (!ham.contains(e.target) && !nav.contains(e.target)) {
      ham.classList.remove('open');
      nav.classList.remove('open');
    }
  });
}

// ── Dropdown desktop (click) ──
function initDropdowns() {
  document.querySelectorAll('.dropdown > span').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const menu = btn.parentElement.querySelector('.dropdown-menu');
      if (!menu) return;
      const isOpen = menu.style.display === 'block';
      document.querySelectorAll('.dropdown-menu').forEach(m => m.style.display = 'none');
      menu.style.display = isOpen ? 'none' : 'block';
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu').forEach(m => m.style.display = 'none');
  });
}

// ── Mobile dropdown accordion ──
function initMobileDropdowns() {
  document.querySelectorAll('.mobile-title').forEach(title => {
    title.addEventListener('click', () => {
      title.parentElement.classList.toggle('active');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHamburger();
  initDropdowns();
  initMobileDropdowns();
  setActiveNav();
});

// ── Auto-set nav aktif berdasarkan halaman saat ini ──
function setActiveNav() {
  // Ambil nama file dari URL (misal: "ceksurat.html" atau "" untuk index)
  const path     = window.location.pathname;
  const page     = path.split('/').pop() || 'index.html';

  // Hapus semua class active dulu dari nav desktop & mobile
  document.querySelectorAll('.main-nav > a, #mobileNav a').forEach(a => {
    a.classList.remove('active');
  });

  // Tandai link yang href-nya cocok dengan halaman saat ini
  document.querySelectorAll('.main-nav > a, #mobileNav a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    if (!href) return;

    const isHome    = (page === '' || page === 'index.html') && (href === 'index.html' || href === '');
    const isMatch   = href === page;

    if (isHome || isMatch) {
      a.classList.add('active');
    }
  });
}
