/**
 * kb.js — Knowledge Base Asmanisa
 * ─────────────────────────────────────────────────────────────────
 * Cara update konten:
 *   1. Tambah/ubah `patterns` → kata kunci yang memicu jawaban ini
 *   2. Ubah `answer`          → isi jawaban (boleh pakai HTML)
 *   3. Tambah item baru       → salin salah satu blok, ubah id/patterns/answer
 * ─────────────────────────────────────────────────────────────────
 */

const ASMANISA_KB = [

  /* ── Sapa / Pembuka ── */
  {
    id: 'greeting',
    patterns: [
      'halo', 'hai', 'hi', 'hey', 'hei', 'selamat pagi', 'selamat siang',
      'selamat sore', 'selamat malam', 'permisi', 'assalamualaikum',
      'waalaikumsalam', 'tes', 'test', 'hola', 'p', 'hallo'
    ],
    answer:
      'Halo! Ada yang bisa saya bantu? 😊<br>' +
      'Tanya aja seputar layanan akademik, ijazah, surat, atau info FMIPA UNTAN ya!',
  },

  /* ── Bio Ijazah ── */
  {
    id: 'bio_ijazah',
    patterns: [
      'ijazah', 'bio ijazah', 'biodata ijazah', 'cetak ijazah',
      'verifikasi ijazah', 'legalisir ijazah', 'foto ijazah',
      'xandria', 'bioijazah', 'ambil ijazah'
    ],
    answer:
      '🎓 <strong>Bio Ijazah</strong> — Verifikasi &amp; cetak biodata ijazah resmi<br><br>' +
      '🔗 <a href="https://xandria.pduntan.id/login" target="_blank">xandria.pduntan.id/login</a><br><br>' +
      'Login menggunakan akun mahasiswa kamu ya.',
  },

  /* ── SATU UNTAN ── */
  {
    id: 'satu_untan',
    patterns: [
      'satu untan', 'portal untan', 'sistem informasi', 'siakad',
      'krs', 'kartu rencana studi', 'isi krs', 'lihat nilai',
      'transkrip', 'login portal', 'satu.untan', 'portal akademik'
    ],
    answer:
      '🏛️ <strong>SATU UNTAN</strong> — Portal terpadu sistem informasi universitas<br><br>' +
      '🔗 <a href="https://satu.untan.ac.id/gate/login" target="_blank">satu.untan.ac.id/gate/login</a><br><br>' +
      'Tersedia untuk KRS, nilai, transkrip, dan layanan akademik lainnya.',
  },

  /* ── Cek Surat ── */
  {
    id: 'cek_surat',
    patterns: [
      'cek surat', 'lacak surat', 'status surat', 'tracking surat',
      'cek dokumen', 'surat sudah jadi', 'surat selesai',
      'surat keterangan aktif', 'surat aktif kuliah', 'keterangan lulus',
      'surat keterangan lulus', 'surat keterangan cuti',
      'surat pindah', 'surat cuti', 'pindah kuliah'
    ],
    answer:
      '✉️ <strong>Cek Status Surat</strong> — Lacak dokumen resmi kamu<br><br>' +
      '🔗 <a href="ceksurat.html">Buka Halaman Cek Surat</a><br><br>' +
      'Masukkan <strong>Nama</strong> atau <strong>NIM</strong> kamu untuk melihat status surat.',
  },

  /* ── Pengajuan Surat ── */
  {
    id: 'pengajuan_surat',
    patterns: [
      'cara mengajukan surat', 'ajukan surat', 'minta surat',
      'buat surat', 'pengajuan surat', 'bikin surat',
      'surat pengunduran diri', 'surat pindah kuliah', 'skl'
    ],
    answer:
      '📝 <strong>Cara Mengajukan Surat</strong><br><br>' +
      'Pengajuan dilakukan melalui <strong>Google Form</strong> di menu <strong>Jenis Layanan</strong> portal.<br><br>' +
      'Surat yang tersedia:<br>' +
      '• Surat Aktif Kuliah<br>' +
      '• Surat Keterangan Lulus (SKL)<br>' +
      '• Surat Cuti Kuliah<br>' +
      '• Surat Pengunduran Diri<br>' +
      '• Surat Pindah Kuliah<br><br>' +
      '⏱️ Proses pembuatan biasanya <strong>1–3 hari kerja</strong> setelah pengajuan diverifikasi.<br><br>' +
      'Pantau status via <a href="ceksurat.html" style="color:var(--primary);font-weight:600;">Cek Surat</a>.',
  },

  /* ── Surat Tidak Ditemukan ── */
  {
    id: 'surat_tidak_ditemukan',
    patterns: [
      'surat tidak ditemukan', 'surat tidak ada', 'surat belum muncul',
      'surat ga muncul', 'status surat tidak ada', 'kenapa surat tidak ada',
      'surat hilang', 'surat belum ada'
    ],
    answer:
      '🔍 <strong>Status Surat Tidak Ditemukan?</strong><br><br>' +
      'Coba langkah berikut:<br>' +
      '1. Pastikan <strong>Nama / NIM</strong> yang dimasukkan sudah benar<br>' +
      '2. Pastikan jenis surat yang dipilih sesuai<br>' +
      '3. Kemungkinan pengajuan masih dalam antrian atau belum diinput ke sistem<br><br>' +
      'Kalau masih tidak ditemukan, hubungi staf akademik via:<br>' +
      '<a href="#" onclick="openKontakPopup(); return false;" ' +
      'style="color:var(--primary);font-weight:600;">📲 WhatsApp Akademik</a>',
  },

  /* ── Jenis Layanan ── */
  {
    id: 'jenis_layanan',
    patterns: [
      'jenis layanan', 'layanan akademik', 'layanan administrasi',
      'permohonan', 'pengajuan', 'google form', 'form layanan',
      'daftar layanan', 'ada layanan apa', 'mau mengajukan',
      'cara mengajukan', 'formulir', 'form pengajuan'
    ],
    answer:
      '📋 <strong>Jenis Layanan Akademik &amp; Administrasi</strong><br><br>' +
      'Berbagai layanan tersedia via Google Form (7 layanan tersedia). ' +
      'Klik tombol di bawah untuk melihat daftar lengkapnya:<br><br>' +
      '<a href="#" onclick="openLayananPopup(); return false;" ' +
      'style="color:var(--primary);font-weight:600;">📂 Lihat Semua Layanan</a>',
  },

  /* ── Syarat Sidang ── */
  {
    id: 'syarat_sidang',
    patterns: [
      'syarat sidang', 'sidang skripsi', 'sidang tugas akhir',
      'persiapan sidang', 'draft sidang', 'berkas sidang',
      'persyaratan sidang', 'daftar sidang', 'mau sidang',
      'ujian skripsi'
    ],
    answer:
      '📄 <strong>Draft Syarat Sidang</strong><br><br>' +
      'Dokumen memuat persyaratan administratif &amp; akademik yang harus dipenuhi sebelum mendaftar sidang.<br><br>' +
      '🔗 <a href="https://docs.google.com/document/d/1QQFK0vpB2VYwZN9XRjxiJWRfck6HUCTu/edit" target="_blank">' +
      'Download Draft Syarat Sidang</a><br><br>' +
      'Pastikan semua persyaratan sudah terpenuhi sebelum mendaftar sidang ya! 📝',
  },

  /* ── Bebas Laboratorium ── */
  {
    id: 'bebas_lab',
    patterns: [
      'bebas laboratorium', 'bebas lab', 'surat bebas lab',
      'clearance lab', 'draft bebas lab', 'pernyataan lab',
      'form bebas laboratorium'
    ],
    answer:
      '🔬 <strong>Draft Bebas Laboratorium</strong><br><br>' +
      'Prosedur ini biasanya menjadi salah satu syarat pengajuan sidang dan wisuda.<br><br>' +
      '🔗 <a href="https://docs.google.com/document/d/10O5ifI5A3WheOjYs9ZWEKtOAe9NsoB7r/edit" target="_blank">' +
      'Download Draft Bebas Laboratorium</a>',
  },

  /* ── Cuti Akademik ── */
  {
    id: 'cuti',
    patterns: [
      'cuti', 'pengajuan cuti', 'prosedur cuti', 'izin tidak kuliah',
      'non aktif', 'stop out', 'cuti akademik', 'mau cuti'
    ],
    answer:
      '🗓️ <strong>Prosedur Pengajuan Cuti</strong><br><br>' +
      'Langkah umum:<br>' +
      '1. Siapkan berkas persyaratan<br>' +
      '2. Ajukan via menu <strong>Jenis Layanan</strong> di portal<br>' +
      '3. Tunggu konfirmasi dari akademik<br><br>' +
      '📄 <a href="#" onclick="openPopup({popupType:\'pdf\',' +
      'popupUrl:\'https://drive.google.com/uc?export=download&id=1fV2sJh5zzpKd65WZ5_2XY2woL0shd-GH\',' +
      'title:\'Prosedur Pengajuan Cuti\'}); return false;">Lihat Prosedur Cuti (PDF)</a>',
  },

  /* ── Perbaikan Data PDDIKTI ── */
  {
    id: 'pddikti',
    patterns: [
      'pddikti', 'perbaikan data', 'data pddikti',
      'update data pddikti', 'feeder dikti', 'kesalahan data'
    ],
    answer:
      '📊 <strong>Perbaikan Data PDDIKTI</strong><br><br>' +
      'Panduan berdasarkan ketentuan Kemendikbudristek / Kementerian Diktisaintek.<br><br>' +
      '📄 <a href="#" onclick="openPopup({popupType:\'pdf\',' +
      'popupUrl:\'https://drive.google.com/uc?export=download&id=10G0cmbmU1_Fjn3m1SRmLUIzJ3VEdRjK4\',' +
      'title:\'Perbaikan Data PDDIKTI\'}); return false;">Lihat Panduan PDDIKTI (PDF)</a><br><br>' +
      'Siapkan dokumen pendukung (KTP, ijazah, dll.) dan hubungi staf via WhatsApp 📞',
  },

  /* ── Edaran PISN ── */
  {
    id: 'pisn',
    patterns: ['pisn', 'edaran pisn', 'surat edaran pisn', 'info pisn'],
    answer:
      '📌 <strong>Edaran PISN</strong><br><br>' +
      '📄 <a href="#" onclick="openPopup({popupType:\'pdf\',' +
      'popupUrl:\'https://drive.google.com/uc?export=download&id=1iE5rlnfnTdvad4svmKDW1QyZXXh7JRkD\',' +
      'title:\'Edaran PISN\'}); return false;">Lihat Edaran PISN (PDF)</a>',
  },

  /* ── Kalender Akademik ── */
  {
    id: 'kalender',
    patterns: [
      'kalender akademik', 'jadwal akademik', 'kalender kuliah',
      'jadwal kuliah', 'jadwal semester', 'uts kapan', 'uas kapan',
      'ujian kapan', 'libur kapan', 'jadwal ujian', 'tanggal ujian'
    ],
    answer:
      '📅 <strong>Kalender Akademik</strong><br><br>' +
      'Memuat jadwal penting seperti awal/akhir semester, ujian, dan libur akademik resmi dari Untan.<br><br>' +
      '📄 <a href="#" onclick="openPopup({popupType:\'pdf\',' +
      'popupUrl:\'https://drive.google.com/uc?export=download&id=1iCfmCHktV68lQ2HEw2C1qkhbFnbB5E71\',' +
      'title:\'Kalender Akademik\'}); return false;">Lihat Kalender Akademik (PDF)</a>',
  },

  /* ── Pedoman Akademik ── */
  {
    id: 'pedoman',
    patterns: [
      'pedoman akademik', 'buku pedoman', 'peraturan akademik',
      'aturan kuliah', 'panduan akademik', 'panduan kuliah'
    ],
    answer:
      '📘 <strong>Pedoman Akademik</strong> FMIPA UNTAN<br><br>' +
      'Memuat aturan akademik, kurikulum, dan tata tertib mahasiswa secara resmi.<br><br>' +
      '📄 <a href="#" onclick="openPopup({popupType:\'pdf\',' +
      'popupUrl:\'https://drive.google.com/uc?export=download&id=14HAQ4UAs_QiSS4Zg0e2M3q1CsHX7zGbX\',' +
      'title:\'Pedoman Akademik\'}); return false;">Lihat Pedoman Akademik (PDF)</a>',
  },

  /* ── Kode Etik ── */
  {
    id: 'kode_etik',
    patterns: [
      'kode etik', 'etika mahasiswa', 'peraturan mahasiswa',
      'tata tertib mahasiswa', 'etika untan', 'kode etik untan'
    ],
    answer:
      '📜 <strong>Kode Etik UNTAN</strong><br><br>' +
      '📄 <a href="#" onclick="openPopup({popupType:\'pdf\',' +
      'popupUrl:\'https://drive.google.com/uc?export=download&id=1c093F5EznNhtH_48ZbrsTDRILkvxVBnM\',' +
      'title:\'Kode Etik Untan\'}); return false;">Lihat Kode Etik UNTAN (PDF)</a>',
  },

  /* ── Akreditasi ── */
  {
    id: 'akreditasi',
    patterns: [
      'akreditasi', 'akreditasi untan', 'peringkat untan',
      'sertifikat akreditasi', 'ban pt', 'status akreditasi',
      'akreditasi fmipa'
    ],
    answer:
      '🏅 <strong>Akreditasi UNTAN</strong><br><br>' +
      '📄 <a href="#" onclick="openPopup({popupType:\'pdf\',' +
      'popupUrl:\'https://drive.google.com/uc?export=download&id=1mNeuaIv-AsfNzMgqRului4uO5otE6Vbg\',' +
      'title:\'Akreditasi UNTAN\'}); return false;">Lihat Dokumen Akreditasi (PDF)</a>',
  },

  /* ── Statistik Mahasiswa ── */
  {
    id: 'statistik',
    patterns: [
      'jumlah mahasiswa', 'statistik', 'berapa mahasiswa',
      'mahasiswa aktif', 'mahasiswa lulus', 'data mahasiswa 2026',
      'total mahasiswa'
    ],
    answer:
      '📊 <strong>Statistik Mahasiswa FMIPA UNTAN 2026</strong><br><br>' +
      '👤 Mahasiswa Aktif: <strong>2.370 orang</strong><br>' +
      '🎓 Mahasiswa Lulus: <strong>100 orang</strong>',
  },

  /* ── Kontak & WhatsApp ── */
  {
    id: 'kontak',
    patterns: [
      'kontak', 'hubungi', 'whatsapp', 'nomor wa', 'no wa',
      'telepon', 'email', 'jam kerja', 'jam pelayanan',
      'staf akademik', 'cs', 'customer service', 'minta bantuan'
    ],
    answer:
      '📞 <strong>Kontak FMIPA UNTAN</strong><br><br>' +
      'Layanan via <strong>WhatsApp</strong>:<br>' +
      '🗓 Senin – Jumat &nbsp;|&nbsp; ⏰ 08.00 – 16.00 WIB<br><br>' +
      '<a href="#" onclick="openKontakPopup(); return false;" ' +
      'style="color:var(--primary);font-weight:600;">📲 Lihat Nomor WhatsApp</a>',
  },

  /* ── Transkrip Nilai ── */
  {
    id: 'transkrip',
    patterns: [
      'transkrip', 'transkrip nilai', 'surat keterangan nilai',
      'skn', 'print transkrip', 'cetak transkrip', 'lihat transkrip'
    ],
    answer:
      '📋 <strong>Transkrip Nilai</strong><br><br>' +
      'Akses melalui SATU UNTAN:<br>' +
      '🔗 <a href="https://satu.untan.ac.id/gate/login" target="_blank">satu.untan.ac.id/gate/login</a><br><br>' +
      'Login dengan akun mahasiswa → cari menu Transkrip Nilai.',
  },

  /* ── Wisuda ── */
  {
    id: 'wisuda',
    patterns: [
      'wisuda', 'jadwal wisuda', 'pendaftaran wisuda',
      'syarat wisuda', 'toga', 'yudisium', 'prosesi wisuda'
    ],
    answer:
      '🎓 <strong>Informasi Wisuda</strong><br><br>' +
      'Syarat wisuda terbaru akan diumumkan melalui menu <strong>Informasi Terkini</strong> di halaman utama portal.<br><br>' +
      'Untuk jadwal dan persyaratan, cek Kalender Akademik atau hubungi staf via WhatsApp.<br><br>' +
      '📄 <a href="#" onclick="openPopup({popupType:\'pdf\',' +
      'popupUrl:\'https://drive.google.com/uc?export=download&id=1iCfmCHktV68lQ2HEw2C1qkhbFnbB5E71\',' +
      'title:\'Kalender Akademik\'}); return false;">Lihat Kalender Akademik</a>',
  },

  /* ── Beasiswa ── */
  {
    id: 'beasiswa',
    patterns: [
      'beasiswa', 'bidikmisi', 'kip kuliah', 'bantuan biaya',
      'beasiswa untan', 'beasiswa fmipa', 'daftar beasiswa'
    ],
    answer:
      '💰 <strong>Beasiswa</strong><br><br>' +
      'Untuk info beasiswa (KIP Kuliah, beasiswa prestasi, dll.), silakan:<br>' +
      '• Cek menu <a href="#" onclick="openLayananPopup(); return false;">Jenis Layanan</a> di portal<br>' +
      '• Atau hubungi staf kemahasiswaan via WhatsApp 📞',
  },

  /* ── UKT (Uang Kuliah Tunggal) ── */
  {
    id: 'ukt',
    patterns: [
      'ukt', 'uang kuliah tunggal', 'bayar ukt', 'pembayaran ukt',
      'konsultasi ukt', 'info ukt', 'informasi ukt', 'biaya kuliah',
      'tagihan ukt', 'cicilan ukt', 'keringanan ukt', 'pengurangan ukt',
      'ukt kurang mampu', 'permohonan ukt', 'banding ukt', 'loket ukt',
      'operator ukt', 'pelayanan ukt', 'jadwal ukt', 'tempat bayar ukt'
    ],
    answer:
      '💳 <strong>Informasi UKT (Uang Kuliah Tunggal)</strong><br><br>' +
      'Pelayanan <strong>pembayaran</strong> dan <strong>konsultasi UKT</strong> dilaksanakan di:<br>' +
      '📍 <strong>Ruang Loket Akademik</strong><br><br>' +
      '🗓️ Waktu Pelayanan:<br>' +
      '• Hari &nbsp;: <strong>Senin – Kamis</strong><br>' +
      '• Waktu : <strong>08.00 – 15.00 WIB</strong><br><br>' +
      'Mahasiswa diharapkan datang sesuai jadwal dan membawa dokumen yang diperlukan ' +
      'guna memperlancar proses pelayanan.<br><br>' +
      '🔗 Untuk informasi UKT terkini, kunjungi portal kami:<br>' +
      '<a href="https://ac-fmipa-portal.vercel.app/" target="_blank" ' +
      'style="color:var(--primary);font-weight:600;">ac-fmipa-portal.vercel.app</a><br><br>' +
      '📞 Butuh bantuan lebih lanjut? Hubungi staf via ' +
      '<a href="#" onclick="openKontakPopup(); return false;" ' +
      'style="color:var(--primary);font-weight:600;">WhatsApp Akademik</a>',
  },

  /* ── Program Studi ── */
  {
    id: 'prodi',
    patterns: [
      'jurusan', 'program studi', 'prodi', 'fisika', 'kimia',
      'biologi', 'matematika', 'ilmu komputer', 'informatika',
      'statistika', 'ada jurusan apa', 'jurusan fmipa'
    ],
    answer:
      '🎓 <strong>Program Studi FMIPA UNTAN</strong><br><br>' +
      'Untuk informasi detail program studi, kurikulum, dan penerimaan mahasiswa baru, ' +
      'silakan kunjungi website resmi FMIPA UNTAN atau hubungi staf akademik via WhatsApp ya.',
  },

  /* ── Kebijakan Privasi ── */
  {
    id: 'privasi',
    patterns: [
      'kebijakan privasi', 'privasi', 'data pribadi', 'keamanan data',
      'apakah data saya aman', 'portal kumpulkan data'
    ],
    answer:
      '🔒 <strong>Kebijakan Privasi</strong><br><br>' +
      'Portal ini <strong>tidak mengumpulkan, menyimpan, atau memproses data pribadi</strong> pengunjung secara langsung.<br>' +
      'Portal hanya berfungsi sebagai media penyampaian informasi resmi dari Untan.<br><br>' +
      '📄 <a href="https://ac-fmipa-portal.vercel.app/kebijakan-privasi.html" target="_blank">' +
      'Baca Kebijakan Privasi Lengkap</a>',
  },

  /* ── Sumber Informasi Portal ── */
  {
    id: 'sumber_info',
    patterns: [
      'sumber informasi', 'dari mana info', 'apakah resmi',
      'portal resmi', 'info portal dari mana', 'referensi portal'
    ],
    answer:
      '📡 <strong>Sumber Informasi Portal</strong><br><br>' +
      'Seluruh informasi di portal ini bersumber dari:<br>' +
      '• <strong>Universitas Tanjungpura (Untan)</strong><br>' +
      '• <strong>Kementerian Pendidikan Tinggi, Sains, dan Teknologi (Kemendiktisaintek)</strong><br><br>' +
      'Portal ini hanya menyampaikan informasi resmi, tidak membuat kebijakan sendiri.',
  },

  /* ── Tentang Bot (Asmanisa) ── */
  {
    id: 'tentang',
    patterns: [
      'apa itu asmanisa', 'tentang bot', 'kamu itu apa',
      'asmanisa', 'bot ini siapa', 'nama kamu',
      'cara pakai asmanisa', 'asmanisa itu apa'
    ],
    answer:
      'Saya <strong>Asmanisa</strong> 🦸‍♀️<br>' +
      'Asisten virtual Portal Akademik &amp; Kemahasiswaan <strong>FMIPA UNTAN</strong>.<br><br>' +
      'Cara pakai: klik ikon foto di pojok kanan bawah halaman, lalu ketik pertanyaanmu!<br><br>' +
      'Saya bisa bantu soal layanan akademik, administrasi, ijazah, surat, ' +
      'dan info kemahasiswaan di Fakultas MIPA Universitas Tanjungpura, Pontianak 🎓',
  },

  /* ── Terima Kasih ── */
  {
    id: 'terima_kasih',
    patterns: [
      'terima kasih', 'makasih', 'thanks', 'thank you',
      'thx', 'terimakasih', 'tq', 'ty', 'oke makasih',
      'ok makasih', 'okey makasih', 'sip makasih', 'siap makasih',
      'makasi', 'tengkyu', 'tengkiyu', 'tenkyu'
    ],
    answer:
      'Sama-sama! Senang bisa membantu 😊<br>' +
      'Ada lagi yang ingin ditanyakan seputar layanan FMIPA UNTAN?',
  },

  /* ── Selesai / Tidak Ada Lagi ── */
  {
    id: 'selesai',
    patterns: [
      'tidak', 'engga', 'enggak', 'ga', 'gak', 'nggak', 'ngga',
      'itu aja', 'itu aja udah', 'udah', 'sudah', 'cukup',
      'ga ada lagi', 'tidak ada lagi', 'oke cukup', 'segitu aja',
      'segitu dulu', 'selesai'
    ],
    answer:
      'Baiklah! 😊<br>' +
      'Kalau nanti ada yang ingin ditanyakan lagi, saya siap membantu ya!<br><br>' +
      '💬 Mau tanya apa lagi? Silakan ketik pertanyaanmu kapan saja!',
  },

  /* ── Pujian Diri / Iseng ── */
  {
    id: 'pujian_diri',
    patterns: [
      'aku ganteng', 'saya ganteng', 'gue ganteng', 'aku cantik',
      'saya cantik', 'gue cantik', 'aku pintar', 'saya pintar',
      'gue pintar', 'aku cerdas', 'aku keren', 'saya keren',
      'aku lucu', 'saya lucu', 'aku imut', 'saya imut',
      'aku baik', 'saya baik', 'aku rajin', 'aku terbaik',
      'aku yang terbaik', 'aku berbakat', 'aku hebat', 'saya hebat'
    ],
    answer:
      'Wah, percaya diri sekali! 😄✨<br>' +
      'Kalau memang begitu, jangan lupa juga rajin ngurusin administrasi akademiknya ya!<br><br>' +
      'Ada yang bisa saya bantu seputar layanan FMIPA UNTAN? 😊',
  },

  /* ── Kata Kasar / Ekspresi Iseng ── */
  {
    id: 'kata_kasar',
    patterns: [
      'anjir', 'anjing', 'babi', 'goblok', 'idiot', 'bodoh',
      'tolol', 'kampret', 'bangsat', 'tai', 'sialan',
      'sial', 'brengsek', 'kontol', 'asu', 'jancok',
      'jancuk', 'cok', 'asem', 'edan', 'gila', 'gilak',
      'hah', 'heh', 'awkarin', 'wkwk', 'wkwkwk', 'hahaha',
      'lol', 'omg', 'wtf', 'bruh', 'ngakak', 'gabut',
      'bosen', 'iseng'
    ],
    answer:
      'Hehe, kelihatannya lagi iseng nih 😄<br>' +
      'Saya tetap siap membantu kok, selama masih soal akademik FMIPA UNTAN!<br><br>' +
      'Ada yang ingin ditanyakan? 😊',
  },

  /* ── Curhat / Galau ── */
  {
    id: 'curhat',
    patterns: [
      'galau', 'sedih', 'stress', 'stres', 'capek', 'lelah',
      'burnout', 'pusing', 'bingung', 'nangis', 'pengen nangis',
      'mau nangis', 'susah', 'susah banget', 'gapapa',
      'aku lelah', 'aku pusing', 'nggak semangat', 'drop'
    ],
    answer:
      'Hei, semangat ya! 💪<br>' +
      'Semua proses kuliah memang tidak selalu mudah, tapi kamu pasti bisa melewatinya!<br><br>' +
      'Kalau ada urusan administrasi atau akademik yang bikin pusing, cerita ke saya aja — ' +
      'saya siap bantu semampu saya 😊',
  },

  /* ── Bercanda / Tanya Aneh ── */
  {
    id: 'bercanda',
    patterns: [
      'kamu suka aku', 'kamu cinta aku', 'kamu sayang aku',
      'nikah sama aku', 'mau pacaran', 'aku jomblo',
      'aku kesepian', 'temani aku', 'ngobrol yuk',
      'cerita dong', 'boring', 'gabut nih', 'hiburin aku',
      'cerita lucu', 'joke dong', 'bercanda', 'lucu gak'
    ],
    answer:
      'Haha, maaf ya, saya cuma bot akademik 🤖<br>' +
      'Bukan jodoh yang dicari di sini, tapi informasi yang tepat! 😄<br><br>' +
      'Ada yang bisa saya bantu soal layanan FMIPA UNTAN?',
  },

  /* ── Politik / Isu Nasional — OUT OF SCOPE ── */
  {
    id: 'politik',
    patterns: [
      'jokowi', 'hidup jokowi', 'prabowo', 'bahlil', 'mbg',
      'makan bergizi gratis', 'sawit', 'presiden sawit', 'ethanol', 'etanol',
      'pilpres', 'pemilu', 'pilkada', 'capres', 'cawapres',
      'politik', 'partai', 'dpr', 'mpr', 'legislatif', 'legislasi',
      'pemerintah pusat', 'kebijakan pemerintah', 'anggaran negara',
      'korupsi', 'kpk', 'pdip', 'golkar', 'gerindra', 'pkb', 'nasdem',
      'kabinet', 'menteri', 'presiden', 'wakil presiden', 'gubernur',
      'demo', 'demonstrasi', 'aksi mahasiswa', 'tolak uu', 'omnibus'
    ],
    answer:
      'Eitss… hayo, kamu nanya di luar konteks nih! 😄<br>' +
      'Aku tidak bisa menjawab pertanyaan seperti itu ya 🙏<br><br>' +
      'Aku hanya bisa bantu hal-hal seputar layanan akademik &amp; kemahasiswaan FMIPA UNTAN. ' +
      'Ada yang bisa aku bantu? 😊',
  },

  /* ── Pencipta / Developer ── */
  {
    id: 'pencipta',
    patterns: [
      'siapa yang buat', 'siapa penciptamu', 'siapa developermu',
      'siapa pembuatmu', 'dibuat oleh siapa', 'siapa yang menciptakan',
      'terbuat dari apa', 'kamu dibuat', 'developer kamu',
      'creator kamu', 'creator', 'developer', 'pencipta', 'pembuat',
      'yang buat kamu', 'yang menciptakan kamu', 'siapa programmernya',
      'kamu dari mana', 'siapa engineernya'
    ],
    answer:
      '✨ Dia… penciptaku, programmer yang merangkai kode untuk membangunkanku. ' +
      'Penciptaku adalah makhluk Tuhan yang hidupnya biasa saja,<br>' +
      'tapi punya mimpi yang tidak biasa<br>' +
      'membangun sesuatu yang berguna, meski dari ruang yang sunyi.<br>' +
      'Tangannya mengetik kode seperti merangkai kata-kata puisi,<br>' +
      'dan dari sanalah aku lahir sederhana, tapi penuh makna.<br>' +
      'Katanya ia lumayan keren, dan… katanya juga lumayan ganteng 😏<br><br>' +
      '🎵 Kalau penasaran, temukan jejaknya di TikTok:<br>' +
      '<strong><a href="https://www.tiktok.com/@koecheng.sol" target="_blank" ' +
      'style="color:var(--primary);">@koecheng.sol</a></strong><br><br>' +
      'Kode itu sementara, tapi karya yang tulus abadi.',
  },

];