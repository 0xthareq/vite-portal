document.addEventListener('DOMContentLoaded', async () => {

  [1, 2].forEach(n => {
    const t = document.getElementById('track' + n);
    if (t) t.innerHTML = `
      <div class="slide">
        <div class="slide-bg" style="background:#e8f0fd"></div>
        <div class="slide-overlay"></div>
        <div class="slide-content" style="text-align:center;width:100%;">
          <p style="color:rgba(255,255,255,.8);font-size:13px;">⏳ Memuat...</p>
        </div>
      </div>`;
  });

  try {
    const data = await window.fetchPortalData();
    window.buildSliders(data.slides || []);
    window.buildNews(data.news || []);
    window.startAuto();

  } catch (err) {
    console.error('Gagal memuat data dari server:', err);
    try {
      const cached = localStorage.getItem('portal_v3_cache');
      if (cached) {
        const { data } = JSON.parse(cached);
        window.buildSliders(data.slides || []);
        window.buildNews(data.news || []);
        window.startAuto();
      }
    } catch (_) {}
  }
});