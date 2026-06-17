/* ================================================================
   kb.js — Asmanisa Knowledge Base
   Data statis FMIPA UNTAN untuk konteks AI Asmanisa
   Update: Juni 2026
   ================================================================ */

/* ── CATATAN PENGGUNAAN ───────────────────────────────────────
   KB ini hanya sebagai DATA REFERENSI untuk AI, bukan template jawaban.
   AI bebas menjawab dengan natural berdasarkan konteks percakapan.
   Tidak ada pola (patterns) yang dipakai sebagai trigger — semua
   keputusan menjawab diserahkan ke model AI.
   ─────────────────────────────────────────────────────────── */

const ASMANISA_KB = [

  /* ── Layanan Portal ── */
  {
    id: 'bio_ijazah',
    answer:
      'Bio Ijazah adalah layanan verifikasi dan cetak biodata ijazah resmi Untan. ' +
      'Akses melalui xandria.pduntan.id/login menggunakan akun mahasiswa.',
  },

  {
    id: 'satu_untan',
    answer:
      'SATU UNTAN adalah portal terpadu sistem informasi Universitas Tanjungpura. ' +
      'Tersedia di satu.untan.ac.id untuk KRS, nilai, transkrip, dan layanan akademik lainnya.',
  },

  {
    id: 'cek_surat',
    answer:
      'Cek status surat bisa dilakukan di halaman Cek Surat portal. ' +
      'Masukkan Nama atau NIM untuk melihat status dokumen.',
  },

  {
    id: 'pengajuan_surat',
    answer:
      'Pengajuan surat dilakukan melalui Google Form di menu Jenis Layanan portal. ' +
      'Surat yang tersedia: Aktif Kuliah, SKL, Cuti Kuliah, Pengunduran Diri, Pindah Kuliah. ' +
      'Proses pembuatan 1-3 hari kerja setelah diverifikasi.',
  },

  {
    id: 'sekar',
    answer:
      'SEKAR (Sistem Informasi Ruangan) adalah aplikasi peminjaman ruangan FMIPA Untan. ' +
      'Akses di sekarfmipa.vercel.app.',
  },

  {
    id: 'kontak_layanan',
    answer:
      'Layanan akademik FMIPA Untan:\n' +
      '- Loket Akademik: Senin-Kamis 08.00-15.00 WIB (Jumat WFH via online/WhatsApp)\n' +
      '- Konsultasi & pembayaran UKT: Ruang Loket Akademik, Senin-Kamis 08.00-15.00 WIB\n' +
      '- Kontak via WhatsApp tersedia di menu Kontak portal (Senin-Jumat)',
  },

  /* ── UKT & Keuangan ── */
  {
    id: 'ukt_info',
    answer:
      'Informasi UKT FMIPA Untan:\n\n' +
      'KONSULTASI & PEMBAYARAN UKT\n' +
      'Dilaksanakan di Ruang Loket Akademik.\n' +
      'Hari: Senin - Kamis | Waktu: 08.00 - 15.00 WIB\n\n' +
      'PENGURANGAN UKT 50% (Mahasiswa Tahap Kuliah Akhir)\n' +
      'Syarat:\n' +
      '- Mahasiswa S1 minimal semester 9 ATAU D3 minimal semester 7\n' +
      '- Sisa mata kuliah yang belum ditempuh maksimal 6 SKS\n' +
      '- Tidak berlaku jika sisa SKS lebih dari 6\n' +
      '- SKS perbaikan nilai tetap dihitung dalam akumulasi total SKS\n' +
      '- Jika sudah membayar 50%, wajib melunasi sisa 50% sebelum Ujian Akhir Semester\n\n' +
      'DOKUMEN YANG DIPERLUKAN:\n' +
      '1. Surat Permohonan Pengurangan Pembayaran UKT (format sesuai lampiran)\n' +
      '2. Transkrip nilai terakhir\n' +
      '3. Lembar Isian Rencana Studi (LIRS)\n' +
      '4. Surat Pernyataan Tidak Sedang Menerima Beasiswa\n' +
      '5. Surat Pernyataan Tanggung Jawab Mutlak (SPTJM)\n\n' +
      'TATA CARA PENGAJUAN:\n' +
      '1. Isi formulir permohonan sesuai format\n' +
      '2. Lengkapi bukti pendukung\n' +
      '3. Ajukan maksimal 2 minggu sebelum daftar ulang\n' +
      '4. Disampaikan ke fakultas melalui Wakil Dekan Bidang Keuangan dan Umum\n' +
      '5. WD Keuangan akan verifikasi dan terbitkan Surat Rekomendasi\n\n' +
      'PEMBEBASAN DARI KEWAJIBAN UKT\n' +
      'Diberikan kepada mahasiswa yang telah menyelesaikan seluruh beban studi yang diwajibkan.\n\n' +
      'PENINJAUAN KEMBALI TARIF UKT\n' +
      'Bisa diajukan jika terjadi:\n' +
      '- Perubahan kemampuan ekonomi mahasiswa/orang tua\n' +
      '- Ketidaksesuaian data ekonomi\n' +
      'Tidak berlaku bagi penerima beasiswa.',
  },

  {
    id: 'ukt_penanggung_jawab',
    answer:
      'Urusan UKT di FMIPA Untan ditangani oleh:\n' +
      '- Wakil Dekan Bidang Keuangan dan Umum: Dr. Evi Noviani, S.Si., M.Si.\n' +
      '- Bagian Keuangan: Rinny Yusnita Absari, S.E., M.M. (Pengelola Data)\n' +
      '- Bendahara: Rachmat Jamaluddin, A.Md. (BPP)\n' +
      '- Loket Akademik: Senin-Kamis 08.00-15.00 WIB',
  },

  /* ── Data Pegawai & Dosen ── */
  {
    id: 'pejabat_struktural',
    answer:
      'PEJABAT STRUKTURAL FMIPA UNTAN (per Juni 2026):\n\n' +
      'DEKANAT:\n' +
      '- Dekan: Prof. Dr. Gusrizal, S.Si., M.Si. (Gol. IV/c)\n' +
      '- Wakil Dekan Bid. Akademik: Yudha Arman, S.Si, M.Si., D.Sc. (Gol. III/d)\n' +
      '- Wakil Dekan Bid. Keuangan & Umum: Dr. Evi Noviani, S.Si., M.Si. (Gol. IV/a)\n' +
      '- Wakil Dekan Bid. Kemahasiswaan & Alumni: Tedy Rismawan, S.Kom., M.Cs. (Gol. III/d)\n\n' +
      'KETUA JURUSAN:\n' +
      '- Ketua Jurusan Matematika: Dr. Yundari, S.Si., M.Sc.\n' +
      '- Sekretaris Jurusan Matematika: Dr. Nilamsari Kusumastuti, S.Si., M.Sc.\n' +
      '- Ketua Jurusan Biologi: Dr. Kustiati, S.Si., M.Si.\n' +
      '- Sekretaris Jurusan Biologi: Siti Ifadatin, S.Si., M.Si.\n' +
      '- Ketua Jurusan Fisika: Dr. Bintoro Siswo Nugroho, S.Si., M.Si.\n' +
      '- Sekretaris Jurusan Fisika: Hasanuddin, S.Si., M.Si., Ph.D.\n' +
      '- Ketua Jurusan Kimia: Dr. Rini Muharini, S.Si., M.Si.\n' +
      '- Sekretaris Jurusan Kimia: Winda Rahmalia, S.Si., M.Si.\n' +
      '- Ketua Jurusan Ilmu Kelautan: Dr. Ari Hepi Yanti, S.Si., M.Sc.\n' +
      '- Ketua Jurusan RSK & Sisfo: Arif Bijaksana Putra Negara, S.Kom., M.Kom.\n' +
      '- Sekretaris Jurusan RSK & Sisfo: Dara Islamie, M.Kom.\n\n' +
      'KOORDINATOR PRODI:\n' +
      '- Prodi Matematika: Dr. Bayu Prihandono, S.Si., M.Sc.\n' +
      '- Prodi Statistika: Dr. Evy Sulistianingsih, S.Si., M.Sc.\n' +
      '- Prodi Fisika: Dr. Azrul Azwar, S.Si., M.Si.\n' +
      '- Prodi Kimia: Winda Rahmalia, S.Si., M.Si.\n' +
      '- Prodi Biologi: Dr. Zulfa Zakiah, S.Si., M.Si.\n' +
      '- Prodi Ilmu Kelautan: Dr. Ari Hepi Yanti, S.Si., M.Sc.\n' +
      '- Prodi Siskom: Arif Bijaksana Putra Negara, S.Kom., M.Kom.\n' +
      '- Prodi Sisfo: Dara Islamie, M.Kom.\n\n' +
      'KEPALA BAGIAN ADMINISTRASI:\n' +
      '- Kepala Bagian Umum: Eva Novianti Hestivera, S.T., S.E., M.M. (Gol. IV/a)\n' +
      '- Pengadministrasi Akademik: Sakdiana (Gol. III/a)',
  },

  {
    id: 'dosen_fmipa',
    answer: "=== DATA DOSEN FMIPA UNTAN (per Juni 2026) ===\n\n[Biologi]\n  • Dr. Kustiati, S.Si., M.Si. | NIP: 197212102000032001 | Lektor Kepala | Gol. IV / c | Jabatan Tambahan: Ketua Jurusan Biologi\n  • Siti Ifadatin, S.Si., M.Si. | NIP: 197103272000032001 | Lektor | Gol. III / d | Jabatan Tambahan: Sekretaris Jurusan Biologi\n  • Mukarlina, S.Si., M.Si. | NIP: 196804062000032001 | Lektor | Gol. III / d | Jabatan Tambahan: Kepala Laboratorium Biologi\n  • Dr. Junardi, S.Si., M.Si. | NIP: 197206132000031001 | Lektor Kepala | Gol. IV / a | Jabatan Tambahan: Kepala Laboratorium Zoologi\n  • Prof. Dr. Dra. Siti Khotimah, M.Si. | NIP: 196702021997022001 | Guru Besar | Gol. IV / d\n  • Prof. Dr. Rafdinal, S.Si., M.Si. | NIP: 197108311999031002 | Guru Besar | Gol. IV / c\n  • Dr. Elvi Rusmiyanto Pancaning Wardoyo, S.Si., M.Si. | NIP: 197109012000031003 | Lektor Kepala | Gol. IV / b\n  • Masnur Turnip, S.Si., M.Sc. | NIP: 197208181998022001 | Lektor | Gol. III / d\n  • Dr. Zulfa Zakiah, S.Si., M.Si. | NIP: 197306242000032001 | Lektor | Gol. III / d\n  • Irwan Lovadi, S.Si., M.App.Sc., Ph.D. | NIP: 197803192001121002 | Lektor | Gol. III / d\n  • Riza Linda, S.Si., M.Si. | NIP: 197005071999032001 | Lektor Kepala | Gol. IV / a\n  • Ari Hepi Yanti, S.Si., M.Sc. | NIP: 198404152008012008 | Lektor Kepala | Gol. III / d\n  • Dr. Dwi Gusmalawati, S.Si., M.Si. | NIP: 198408072014042002 | Lektor | Gol. III / c\n  • Rahmawati, S.Si., M.Sc. | NIP: 198404092008122002 | Lektor | Gol. III / c\n  • Diah Wulandari Rousdy, S.Si., M.Sc. | NIP: 198510212008122003 | Lektor | Gol. III / c\n  • Riyandi, S.Si., M.Si. | NIP: 198606182015041001 | Asisten Ahli | Gol. III / b\n  • Firman Saputra, S.Si., M.Sc. | NIP: 198302112008121003 | Asisten Ahli | Gol. III / b\n  • Kartika Prabasari, M.Si. | NIP: 199612272024062004 | - | Gol. III / b\n  • Rikhsan Kurniatuhadi, S.Si, M.Si | NIP: 198903042023211018 | Asisten Ahli | Gol. X\n\n[Fisika]\n  • Yudha Arman, S.Si, M.Si., D.Sc. | NIP: 197805132003121002 | Lektor Kepala | Gol. III / d | Jabatan Tambahan: Wakil Dekan Bidang Akademik\n  • Dr. Bintoro Siswo Nugroho, S.Si., M.Si. | NIP: 198102062006041003 | Lektor Kepala | Gol. IV / b | Jabatan Tambahan: Ketua Jurusan Fisika\n  • Hasanuddin, S.Si., M.Si., Ph.D. | NIP: 198412162008121003 | Lektor | Gol. III / d | Jabatan Tambahan: Sekretaris Jurusan Fisika\n  • Dr. Azrul Azwar, S.Si., M.Si. | NIP: 198107302005011002 | Lektor | Gol. III / d | Jabatan Tambahan: Koordinator Program Studi Fisika\n  • Dr. Dwiria Wahyuni, S.Si., M.Sc. | NIP: 198206082008122001 | Lektor | Gol. III / d | Jabatan Tambahan: Kepala Laboratorium Fisika Lanjut Dan Komputasi\n  • Boni Pahlanop Lapanporo, S.Si., M.Sc. | NIP: 198011102005011002 | Lektor | Gol. III / d\n  • Mariana Bara'allo Malino, S.Si., M.Sc. | NIP: 197603082002122001 | Lektor | Gol. III / c\n  • Dr. Nurhasanah, S.Si., M.Si. | NIP: 198011252006042002 | Lektor | Gol. III / d\n  • Dr. Abdul Muid, S.Si., M.Si. | NIP: 198012172008121001 | Asisten Ahli | Gol. III / b\n  • Asifa Asri, S.Si., M.Si. | NIP: 199006052022032010 | Asisten Ahli | Gol. III / b\n  • Yuris Sutanto, M.Sc. | NIP: 199008272022031008 | Asisten Ahli | Gol. III / b\n  • Retna Arilasita, S.Si., M.Si. | NIP: 199603232024062002 | Asisten Ahli | Gol. III / b\n  • Mega Nurhanisa, S.Si, M.Si. | NIP: 198801192024212001 | Asisten Ahli | Gol. X\n\n[Geofisika]\n  • Dr.Yoga Satria Putra, S.Si., M.Si. | NIP: 197910252005011002 | Lektor Kepala | Gol. IV / a | Jabatan Tambahan: Koordinator Program Studi Geofisika\n  • Muliadi, S.Si., M.Si. | NIP: 197005101999031003 | Lektor Kepala | Gol. IV / a | Jabatan Tambahan: Kepala Laboratorium Fisika Dasar\n  • Dr. Joko Sampurno, S.Si., M.Si. | NIP: 198408252008011004 | Lektor Kepala | Gol. III / d | Jabatan Tambahan: Kepala Laboratorium Geofisika dan Sistem Informasi Geografis\n  • Dr. Andi Ihwan, S.Si., M.Si. | NIP: 197310082002121001 | Lektor Kepala | Gol. IV / c\n  • Dr. Muhammad Ishak Jumarang, S.Si., M.Si. | NIP: 197409212003121004 | Lektor Kepala | Gol. IV / c\n  • Irfana Diah Faryuni, S.Si., M.Si. | NIP: 198510132008122004 | Asisten Ahli | Gol. III / b\n  • Zulfian, S.Si., M.Si. | NIP: 198812142020121005 | Lektor | Gol. III / c\n  • Radhitya Perdhana, S.Si., M.Sc. | NIP: 198911142019031011 | Asisten Ahli | Gol. III / b\n\n[Ilmu Kelautan]\n  • Dr. Apriansyah, S.Si., M.Si. | NIP: 198609072015041001 | Lektor | Gol. III / c | Jabatan Tambahan: Ketua Jurusan Ilmu Kelautan\n  • Yusuf Arief Nurrahman, S.Kel., M.Si. | NIP: 198903172018031001 | Asisten Ahli | Gol. III / b | Jabatan Tambahan: Sekretaris Jurusan Ilmu Kelautan\n  • Warsidah, S.Si., M.Si., Apt. | NIP: 197304122000032001 | Lektor | Gol. III / d | Jabatan Tambahan: Kepala Laboratorium Ilmu Kelautan\n  • Arie Antasari Kushadiwijayanto, S.Si., M.Si. | NIP: 198604292014041001 | Lektor | Gol. III / c\n  • Mega Sari Juane Sofiana, S.Si., M.Sc. | NIP: 198606242019032017 | Lektor | Gol. III / c\n  • Sukal Minsas, S.Si., M.Si. | NIP: 198507192019032007 | Lektor | Gol. III / b\n  • Shifa Helena, S.Kel., M.Si | NIP: 199101312024062002 | Asisten Ahli | Gol. III / b\n  • Tia Nuraya, M.Si. | NIP: 199308192024062001 | Asisten Ahli | Gol. III / b\n  • Syarif Irwan Nurdiansyah, S.Si., M.Si | NIP: 198606272023211014 | Asisten Ahli | Gol. X\n  • Ikha Safitri, S.Pi., M.Si. | NIP: 198905072024212035 | Asisten Ahli | Gol. X\n  • Dr. Dwi Imam Prayitno. S.Kel., M.Si. | NIP: 198210072025211050 | Lektor | Gol. XII\n\n[Kimia]\n  • Dr. Endah Sayekti, S.Si., M.Si. | NIP: 197206222000122001 | Lektor Kepala | Gol. IV / c | Jabatan Tambahan: Sekretaris Jurusan Kimia\n  • Dr. Winda Rahmalia, S.Si., M.Si. | NIP: 198402272008122004 | Lektor Kepala | Gol. IV / a | Jabatan Tambahan: Koordinator Program Studi S1 Kimia\n  • Dr. Lia Destiarti, S.Si., M.Si. | NIP: 198312022008122002 | Lektor Kepala | Gol. IV / a | Jabatan Tambahan: Koordinator Program Studi Magister Kimia\n  • Adhitiyawarman, S.Si., M.Si., Ph.D. | NIP: 198409192008121001 | Lektor | Gol. III / d | Jabatan Tambahan: Kepala Laboratorium Kimia\n  • Dr. Nelly Wahyuni, S.Si., M.Si. | NIP: 197506022000032001 | Lektor Kepala | Gol. IV / c\n  • H. Afghani Jayuska, S.Si., M.Si. | NIP: 197107072000121001 | Lektor Kepala | Gol. IV / c\n  • Titin Anita Zaharah, S.Si., M.Sc. | NIP: 196904191996012002 | Lektor Kepala | Gol. IV / c\n  • Puji Ardiningsih, S.Si., M.Si. | NIP: 197201271998022001 | Lektor Kepala | Gol. IV / c\n  • Berlian Sitorus , S.Si., M.Si., M.Sc., Ph.D. | NIP: 197410102000122006 | Guru Besar | Gol. IV / b\n  • Dr. Anthoni Batahan Aritonang, S.Si., M.Si. | NIP: 196803082000031001 | Lektor Kepala | Gol. IV / a\n  • Dr. Nurlina, S.Si., M.Sc. | NIP: 198510232012122002 | Lektor | Gol. III / d\n  • Ferdinand Hidayat, S.Si., M.Si. | NIP: 199002022024061001 | - | Gol. III / b\n  • Elliska Murni Harfinda, S.Si., M.Si. | NIP: 198901052024062001 | - | Gol. III / b\n  • Firman Shantya Budi, M.Sc. | NIP: 198905292023211027 | Asisten Ahli | Gol. X\n  • Risya Sasri, S.Si., M.Sc. | NIP: 199003102023212041 | Asisten Ahli | Gol. X\n\n[Magister Kimia (S2)]\n  • Prof. Dr. Gusrizal, S.Si., M.Si. | NIP: 197108022000031001 | Guru Besar | Gol. IV / c | Jabatan Tambahan: Dekan\n  • Dr. Andi Hairil Alimuddin, S.Si., M.Si. | NIP: 197109202000121001 | Lektor Kepala | Gol. IV / c | Jabatan Tambahan: Ketua Jurusan Kimia\n  • Prof. Rudiyansyah, S.Si., M.Si., Ph.D. | NIP: 197201242000121001 | Guru Besar | Gol. IV / c | Jabatan Tambahan: Kepala Laboratorium Bioteknologi dan Riset\n  • Prof. Dr. H. Thamrin Usman, DEA. | NIP: 196211101988111001 | Guru Besar | Gol. IV / e\n  • Prof. Risa Nofiani, S.Si., M.Si., Ph.D. | NIP: 197411152000122001 | Guru Besar | Gol. IV / d\n  • Dr. Muhamad Agus Wibowo, S.Si., M.Si. | NIP: 197301092000031002 | Lektor Kepala | Gol. IV / c\n  • Dr. Ari Widiyantoro, S.Si., M.Si. | NIP: 197304012000121001 | Lektor Kepala | Gol. IV / a\n  • Dr. Anis Shofiyani, S.Si., M.Si. | NIP: 197311152000122001 | Lektor | Gol. III / d\n\n[Matematika]\n  • Dr. Evi Noviani, S.Si., M.Si. | NIP: 198402292006042001 | Lektor Kepala | Gol. IV / a | Jabatan Tambahan: Wakil Dekan Bidang Keuangan dan Umum\n  • Dr. Yundari, S.Si., M.Sc. | NIP: 198310202008012012 | Lektor Kepala | Gol. IV / a | Jabatan Tambahan: Ketua Jurusan Matematika\n  • Dr. Nilamsari Kusumastuti, S.Si., M.Sc. | NIP: 198105102005012003 | Lektor | Gol. III / d | Jabatan Tambahan: Sekretaris Jurusan Matematika\n  • Dr. Bayu Prihandono, S.Si., M.Sc. | NIP: 197911152005011003 | Lektor | Gol. III / d | Jabatan Tambahan: Koordinator Program Studi Matematika\n  • Yudhi, S.Si., M.Si. | NIP: 198504072019031004 | Asisten Ahli | Gol. III / b | Jabatan Tambahan: Kepala Laboratorium Matematika\n  • Drs. Helmi, M.Si. | NIP: 196410171998021001 | Lektor | Gol. III / d\n  • Fransiskus Fran, S.Si., M.Si. | NIP: 198804152019031014 | Lektor | Gol. III / c\n  • Nur’ainul Miftahul Huda, S.Si., M.Si. | NIP: 199411142020122014 | Lektor | Gol. III / c\n  • Meliana Pasaribu, S.Pd., M.Sc. | NIP: 198710192019032006 | Asisten Ahli | Gol. III / b\n  • Asri Rahmawati, M.Mat. | NIP: 199509062024062001 | Asisten Ahli | Gol. III / b\n  • Onelia Rochmah, S.Si., M.Sc. | NIP: 199502112024062003 | - | Gol. III / b\n\n[Rekayasa Sistem Komputer]\n  • Tedy Rismawan, S.Kom., M.Cs. | NIP: 198609222014041002 | Lektor | Gol. III / d | Jabatan Tambahan: Wakil Dekan Bidang Kemahasiswaan dan Alumni\n  • Syamsul Bahri, S.Kom., M.Cs. | NIP: 198802272015041001 | Lektor | Gol. III / c | Jabatan Tambahan: Ketua Jurusan Rekayasa Sistem Komputer\n  • Dwi Marisa Midyanti, ST., M.Cs. | NIP: 198003192015042001 | Lektor Kepala | Gol. IV / a | Jabatan Tambahan: Sekretaris Jurusan Rekayasa Sistem Komputer\n  • Suhardi, ST., M.Eng. | NIP: 198606182020121006 | Asisten Ahli | Gol. III / b | Jabatan Tambahan: Kepala Laboratorium Pemrograman dan Komputasi\n  • Drs. Cucu Suhery, MA. | NIP: 196108291989031002 | Lektor | Gol. III / d\n  • Dedi Triyanto, ST., MT. | NIP: 198112242009121003 | Lektor | Gol. III / d\n  • Rahmi Hidayati, S.Kom., M.Cs. | NIP: 198607202015042001 | Lektor | Gol. III / d\n  • Ikhwan Ruslianto, S.Kom., M.Cs. | NIP: 198607012014041001 | Lektor | Gol. III / d\n  • Irma Nirmala, ST., MT. | NIP: 198404052019032015 | Lektor | Gol. III / c\n  • Uray Ristian, S.Kom., M.Kom. | NIP: 199012012019031017 | Lektor | Gol. III / c\n  • Hirzen Hasfani, M.Cs. | NIP: 199305032022031003 | Asisten Ahli | Gol. III / b\n  • Kartika Sari, M.Cs. | NIP: 199206162022032014 | Asisten Ahli | Gol. III / b\n  • Kasliono, S.Mat., M.Cs. | NIP: 199306202022031005 | Asisten Ahli | Gol. III / b\n  • Hafiz Muhardi, S.T., M.Kom. | NIP: 199007232023211017 | Asisten Ahli | Gol. X\n\n[Sistem Informasi]\n  • Renny Puspita Sari, ST., MT. | NIP: 198704182015042001 | Lektor | Gol. III / d | Jabatan Tambahan: Ketua Jurusan Sistem Informasi\n  • Ibnur Rusi, S.Kom., MM. | NIP: 198907282019031008 | Lektor | Gol. III / c | Jabatan Tambahan: Sekretaris Jurusan Sistem Informasi\n  • Ferdy Febriyanto, S.Kom., M.Kom. | NIP: 198902012019031008 | Asisten Ahli | Gol. III / b | Jabatan Tambahan: Kepala Laboratorium Sistem Informasi\n  • Ilhamsyah, S.Si., M.Cs. | NIP: 198405102012121001 | Lektor | Gol. III / d\n  • Nurul Mutiah, ST., MT. | NIP: 198711182015042002 | Lektor | Gol. III / d\n  • Dian Prawira, ST., M.Eng. | NIP: 198411132015041001 | Lektor | Gol. III / c\n  • Syahru Rahmayuda, S.Kom., M.Kom. | NIP: 198306172025211055 | Asisten Ahli | Gol. X\n\n[Statistika]\n  • Dr. Evy Sulistianingsih, S.Si., M.Sc. | NIP: 198502172008122006 | Lektor | Gol. III / d | Jabatan Tambahan: Koordinator Program Studi Statistika\n  • Shantika Martha, S.Si., M.Si. | NIP: 198403082008122003 | Lektor | Gol. III / d | Jabatan Tambahan: Kepala Laboratorium Statistika\n  • Neva Satyahadewi, S.Si., M.Sc. | NIP: 198212042005012001 | Lektor Kepala | Gol. IV / a\n  • Nurfitri Imro'ah, S.Si., M.Si. | NIP: 198907182019032021 | Lektor | Gol. III / c\n  • Hendra Perdana, S.Si., M.Sc. | NIP: 198810102019031020 | Asisten Ahli | Gol. III / b\n  • Wirda Andani, M.Si. | NIP: 199411152022032016 | Asisten Ahli | Gol. III / b\n  • Yuyun Eka Pratiwi, S.Si., M.Aktr. | NIP: 199403072024062003 | Asisten Ahli | Gol. III / b\n  • Ray Tamtama, M.Si. | NIP: 199103152024061002 | - | Gol. III / b\n\n=== PEJABAT STRUKTURAL FMIPA UNTAN ===\n  • Dekan: Prof. Dr. Gusrizal, S.Si., M.Si. (Magister Kimia (S2))\n  • Wakil Dekan Bidang Akademik: Yudha Arman, S.Si, M.Si., D.Sc. (Fisika)\n  • Wakil Dekan Bidang Keuangan dan Umum: Dr. Evi Noviani, S.Si., M.Si. (Matematika)\n  • Wakil Dekan Bidang Kemahasiswaan dan Alumni: Tedy Rismawan, S.Kom., M.Cs. (Rekayasa Sistem Komputer)\n  • Ketua Jurusan Matematika: Dr. Yundari, S.Si., M.Sc. (Matematika)\n  • Sekretaris Jurusan Matematika: Dr. Nilamsari Kusumastuti, S.Si., M.Sc. (Matematika)\n  • Koordinator Program Studi Matematika: Dr. Bayu Prihandono, S.Si., M.Sc. (Matematika)\n  • Koordinator Program Studi Statistika: Dr. Evy Sulistianingsih, S.Si., M.Sc. (Statistika)\n  • Kepala Laboratorium Matematika: Yudhi, S.Si., M.Si. (Matematika)\n  • Kepala Laboratorium Statistika: Shantika Martha, S.Si., M.Si. (Statistika)\n  • Ketua Jurusan Fisika: Dr. Bintoro Siswo Nugroho, S.Si., M.Si. (Fisika)\n  • Sekretaris Jurusan Fisika: Hasanuddin, S.Si., M.Si., Ph.D. (Fisika)\n  • Koordinator Program Studi Fisika: Dr. Azrul Azwar, S.Si., M.Si. (Fisika)\n  • Koordinator Program Studi Geofisika: Dr.Yoga Satria Putra, S.Si., M.Si. (Geofisika)\n  • Kepala Laboratorium Fisika Dasar: Muliadi, S.Si., M.Si. (Geofisika)\n  • Kepala Laboratorium Fisika Lanjut Dan Komputasi: Dr. Dwiria Wahyuni, S.Si., M.Sc. (Fisika)\n  • Kepala Laboratorium Geofisika dan Sistem Informasi Geografis: Dr. Joko Sampurno, S.Si., M.Si. (Geofisika)\n  • Ketua Jurusan Kimia: Dr. Andi Hairil Alimuddin, S.Si., M.Si. (Magister Kimia (S2))\n  • Sekretaris Jurusan Kimia: Dr. Endah Sayekti, S.Si., M.Si. (Kimia)\n  • Koordinator Program Studi S1 Kimia: Dr. Winda Rahmalia, S.Si., M.Si. (Kimia)\n  • Koordinator Program Studi Magister Kimia: Dr. Lia Destiarti, S.Si., M.Si. (Kimia)\n  • Kepala Laboratorium Kimia: Adhitiyawarman, S.Si., M.Si., Ph.D. (Kimia)\n  • Kepala Laboratorium Bioteknologi dan Riset: Prof. Rudiyansyah, S.Si., M.Si., Ph.D. (Magister Kimia (S2))\n  • Ketua Jurusan Biologi: Dr. Kustiati, S.Si., M.Si. (Biologi)\n  • Sekretaris Jurusan Biologi: Siti Ifadatin, S.Si., M.Si. (Biologi)\n  • Kepala Laboratorium Biologi: Mukarlina, S.Si., M.Si. (Biologi)\n  • Kepala Laboratorium Zoologi: Dr. Junardi, S.Si., M.Si. (Biologi)\n  • Ketua Jurusan Rekayasa Sistem Komputer: Syamsul Bahri, S.Kom., M.Cs. (Rekayasa Sistem Komputer)\n  • Sekretaris Jurusan Rekayasa Sistem Komputer: Dwi Marisa Midyanti, ST., M.Cs. (Rekayasa Sistem Komputer)\n  • Kepala Laboratorium Pemrograman dan Komputasi: Suhardi, ST., M.Eng. (Rekayasa Sistem Komputer)\n  • Ketua Jurusan Ilmu Kelautan: Dr. Apriansyah, S.Si., M.Si. (Ilmu Kelautan)\n  • Sekretaris Jurusan Ilmu Kelautan: Yusuf Arief Nurrahman, S.Kel., M.Si. (Ilmu Kelautan)\n  • Kepala Laboratorium Ilmu Kelautan: Warsidah, S.Si., M.Si., Apt. (Ilmu Kelautan)\n  • Ketua Jurusan Sistem Informasi: Renny Puspita Sari, ST., MT. (Sistem Informasi)\n  • Sekretaris Jurusan Sistem Informasi: Ibnur Rusi, S.Kom., MM. (Sistem Informasi)\n  • Kepala Laboratorium Sistem Informasi: Ferdy Febriyanto, S.Kom., M.Kom. (Sistem Informasi)\n\n=== TENAGA KEPENDIDIKAN PNS & PPPK ===\n  • Eva Novianti Hestivera, S.T., S.E., M.M. | NIP: 197907142006042001 | Gol. IV/a | Kepala Bagian Umum FMIPA UNTAN | Kepala Bagian Tata Usaha\n  • Rinny Yusnita Absari, S.E., M.M. | NIP: 197706192005012003 | Gol. IV/a | Pengelola Data | Bag. Keuangan\n  • Rachmat Jamaluddin, A.Md. | NIP: 197810202000121002 | Gol. III/c | Pengelola Keuangan / Bendahara Pengeluaran Pembantu (BPP) | Bag. Keuangan\n  • Eko Sri Haryati, A.Md. | NIP: 196912172007012001 | Gol. III/b | Pengelola Data | Bag. Keuangan\n  • Sakdiana | NIP: 198307072009102001 | Gol. III/a | Pengadministrasi Akademik | Bag. Akademik\n  • Megawati June, S.Mat. | NIP: 199506222025062004 | Gol. III/a | Pranata Laboratorium Pendidikan Ahli Pertama | Lab. Statistika\n  • Muhammad Hariski, S.Mat. | NIP: 200006172025061004 | Gol. III/a | Pranata Laboratorium Pendidikan Ahli Pertama | Lab. Sistem Informasi\n  • Tiara Nusa Putri, S.Si. | NIP: 200008242025062012 | Gol. III/a | Pranata Laboratorium Pendidikan Ahli Pertama | Lab. Geofisika dan Sistem Informasi Geografis\n  • Apriliandi, S.Mat. | NIP: 199504082025061005 | Gol. III/a | Pranata Laboratorium Pendidikan Ahli Pertama | Lab. Matematika\n  • Asterina, S.Si. | NIP: 199910092025062015 | Gol. III/a | Pranata Laboratorium Pendidikan Ahli Pertama | Lab. Fisika Dasar\n  • Filza Buana Putra, S.Mat. | NIP: 199611192025061007 | Gol. III/a | Pranata Laboratorium Pendidikan Ahli Pertama | Lab. Pemrograman dan Komputasi\n  • Yoga Pratama, S.Si. | NIP: 199408032023211018 | Gol. IX | Ahli Pertama - Pranata Laboratorium Pendidikan | Lab. Bioteknologi dan Riset\n  • Toni | NIP: 197901112025211030 | Gol. V | Pengadministrasi Perkantoran | Bag. Kepegawaian\n  • Wiwid Widyana, S.Si. | NIP: 199002132025212046 | Gol. IX | Penata Layanan Operasional | Bag. Kepegawaian\n  • Riyo Riadi, S.Mat. | NIP: 199612122025211053 | Gol. IX | Penata Layanan Operasional | Bag. Kepegawaian\n  • Budi Suryadarma | NIP: 198410012025211057 | Gol. V | Pengadministrasi Perkantoran | Bag. Keuangan\n  • Suandi, S.Si. | NIP: 199112122025211081 | Gol. IX | Penata Layanan Operasional | Bag. Keuangan\n  • Nayla Afifah, S.Hut. | NIP: 198307052025212044 | Gol. IX | Penata Layanan Operasional | Bag. Umum\n  • Supriani,S.Hut. | NIP: 197508242025212010 | Gol. IX | Penata Layanan Operasional | Bag. Umum\n  • Peri Suhendra | NIP: 198202202025211034 | Gol. V | Operator Layanan Operasional | Bag. Umum\n  • Sahroni | NIP: 198109202025211041 | Gol. V | Operator Layanan Operasional | Bag. Umum\n  • Susanti, S.Pd. | NIP: 199201022025212066 | Gol. IX | Penata Layanan Operasional | Bag. Umum/ Staf Dekan\n  • Hajjar | NIP: 198707212025211061 | Gol. V | Operator Layanan Operasional | Bag. Umum\n  • Onny Suryana | NIP: 197610132025211022 | Gol. V | Pengadministrasi Perkantoran | Bag. Akademik\n  • Primanita Putri Darmanto, S.Pd., M.Pd. | NIP: 199308132025212055 | Gol. IX | Penata Layanan Operasional | Bag. Akademik\n  • Agung Setyowahyu, A.Md.Kesling. | NIP: 198806212025211049 | Gol. VII | Pengelola Layanan Operasional | Bag. Akademik\n  • Thareq Abdul Aziz. A.Md. | NIP: 199612232025211037 | Gol. VII | Pengelola Layanan Operasional | Bag. Akademik\n  • Prima, S.S.T. | NIP: 199307262025211042 | Gol. IX | Penata Layanan Operasional | Administrasi Jurusan Matematika\n  • Surya Darma, A.Md. | NIP: 199505132025211043 | Gol. VII | Pengelola Layanan Operasional | Administrasi Jurusan Ilmu Kelautan dan Fisika\n  • Warsi Kurnia Rahayu, S.Si | NIP: 198804062025212049 | Gol. IX | Penata Layanan Operasional | Administrasi Jurusan Kimia\n  • M. Khairuddin, A.Md. | NIP: 198404192025211055 | Gol. VII | Pengelola Layanan Operasional | Administrasi Jurusan Biologi\n  • Agus Setiawan, S.Si. | NIP: 199108182025211052 | Gol. IX | Penata Layanan Operasional | Lab. Fisika Dasar\n  • Emma Khairiah, S.Si | NIP: 198806112025212048 | Gol. IX | Penata Layanan Operasional | Lab. Biologi\n  • Harianto, S.Si. | NIP: 199503132025211050 | Gol. IX | Penata Layanan Operasional | Lab. Ilmu Kelautan\n\n=== TENAGA KONTRAK & PHL ===\n  • Sri Rahayu, S.Si | Tenaga Laboran | Lab. Zoologi\n  • Margie Surahman, S.Si. | Tenaga Laboran | Lab. Biologi\n  • Titik Lestari, S.Si. | Laboran Kimia | Lab. Kimia\n  • Muhammad Raymount Abdahu, S.Kom. | Tenaga Administrasi | Jurusan Rekayasa Sistem Komputer dan Sistem Informasi\n  • Hamdi, S.Kom. | TIK | Bag. Akademik",
  },

  /* ── Info Akademik ── */
  {
    id: 'program_studi',
    answer:
      'Program Studi di FMIPA Untan:\n' +
      'S-1: Matematika, Fisika, Kimia, Biologi, Rekayasa Sistem Komputer (Siskom), ' +
      'Sistem Informasi (Sisfo), Statistika, Ilmu Kelautan, Geofisika\n' +
      'S-2: Kimia\n\n' +
      'Mahasiswa Aktif (2026): 2.370 | Lulus: 100\n' +
      'Yudisium Periode III: 27 April 2026 | Wisuda: 29-30 April 2026',
  },

  {
    id: 'kalender_akademik',
    answer:
      'Kalender akademik FMIPA Untan mengikuti kalender Universitas Tanjungpura. ' +
      'Info terbaru tersedia di slider portal atau hubungi bagian akademik.',
  },

];

// Expose ke window untuk diakses ai-search.js
if (typeof window !== 'undefined') window.ASMANISA_KB = ASMANISA_KB;
