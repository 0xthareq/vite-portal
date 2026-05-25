

document.addEventListener('DOMContentLoaded', async () => {

  // Tampilkan loading sementara data diambil dari server
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
    // Ambil data terbaru dari GitHub via /api/save-data
    const data = await fetchPortalData();
    buildSliders(data.slides || []);
    buildNews(data.news || []);
    startAuto();

  } catch (err) {
    console.error('Gagal memuat data dari server:', err);

    // Fallback: coba dari cache localStorage jika API gagal
    try {
      const cached = localStorage.getItem('portal_v3_cache');
      if (cached) {
        const { data } = JSON.parse(cached);
        buildSliders(data.slides || []);
        buildNews(data.news || []);
        startAuto();
        console.info('Data dimuat dari cache.');
      }
    } catch (_) {
      console.warn('Cache juga tidak tersedia.');
    }
  }
});
