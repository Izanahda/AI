/**
 * data.js
 * Semua konstanta data: soal TPA, pernyataan minat,
 * definisi jurusan, prospek kerja, dan ikon.
 * Tidak mengandung logika — hanya data murni.
 */

// ── Mata pelajaran per jurusan SMA ─────────────────────────
const MAPEL_MIPA = ['Matematika', 'Biologi', 'Kimia', 'Fisika', 'Bahasa Inggris'];
const MAPEL_IPS  = ['Matematika', 'Sosiologi', 'Ekonomi', 'Bahasa Inggris'];

// ── Soal TPA Logika (10 soal) ──────────────────────────────
const SQ_LOG = [
  {q:"Semua siswa rajin. Budi adalah siswa. Kesimpulan yang tepat adalah...",o:["A. Budi tidak rajin","B. Budi rajin","C. Budi mungkin rajin","D. Tidak dapat disimpulkan"],j:"B"},
  {q:"Jika hari hujan maka jalanan basah. Jalanan basah. Maka...",o:["A. Pasti hari hujan","B. Belum tentu hari hujan","C. Hari tidak hujan","D. Jalanan kering"],j:"B"},
  {q:"Semua A adalah B. Semua B adalah C. Maka...",o:["A. Semua C adalah A","B. Sebagian A adalah C","C. Semua A adalah C","D. Tidak ada A adalah C"],j:"C"},
  {q:"Ani lebih tinggi dari Budi. Budi lebih tinggi dari Caca. Siapa yang paling pendek?",o:["A. Ani","B. Budi","C. Caca","D. Tidak dapat ditentukan"],j:"C"},
  {q:"Deret: 2, 4, 8, 16, ... Bilangan selanjutnya adalah...",o:["A. 24","B. 28","C. 30","D. 32"],j:"D"},
  {q:"Deret: 3, 6, 11, 18, 27, ... Bilangan selanjutnya adalah...",o:["A. 36","B. 38","C. 40","D. 42"],j:"B"},
  {q:"Jika P maka Q. Tidak Q. Maka...",o:["A. P","B. Tidak P","C. Mungkin P","D. Tidak dapat disimpulkan"],j:"B"},
  {q:"Semua guru adalah sarjana. Pak Rudi bukan sarjana. Maka...",o:["A. Pak Rudi adalah guru","B. Pak Rudi bukan guru","C. Mungkin Pak Rudi guru","D. Tidak bisa disimpulkan"],j:"B"},
  {q:"Deret: 1, 1, 2, 3, 5, 8, ... Bilangan selanjutnya adalah...",o:["A. 11","B. 12","C. 13","D. 14"],j:"C"},
  {q:"Semua hewan adalah makhluk hidup. Pohon adalah makhluk hidup. Maka...",o:["A. Pohon adalah hewan","B. Pohon mungkin hewan","C. Pohon bukan hewan","D. Tidak bisa disimpulkan"],j:"D"},
];

// ── Soal TPA Numerik (10 soal) ─────────────────────────────
const SQ_NUM = [
  {q:"Tentukan angka berikutnya: 3, 6, 12, 24, ...",o:["A. 36","B. 42","C. 48","D. 56"],j:"C"},
  {q:"Hasil dari 15% × 200 adalah...",o:["A. 25","B. 30","C. 35","D. 40"],j:"B"},
  {q:"Perbandingan A dan B adalah 2:3, jumlah mereka 50. Nilai A adalah...",o:["A. 15","B. 20","C. 25","D. 30"],j:"B"},
  {q:"Diskon 20% pada harga Rp200.000. Harga setelah diskon adalah...",o:["A. Rp140.000","B. Rp150.000","C. Rp160.000","D. Rp180.000"],j:"C"},
  {q:"Rata-rata dari 10, 20, 30, 40, 50 adalah...",o:["A. 25","B. 30","C. 35","D. 40"],j:"B"},
  {q:"Jika 3x = 21, maka nilai x² adalah...",o:["A. 7","B. 14","C. 49","D. 21"],j:"C"},
  {q:"Deret: 2, 6, 12, 20, ... Bilangan selanjutnya adalah...",o:["A. 28","B. 30","C. 32","D. 36"],j:"B"},
  {q:"Harga naik 20% menjadi Rp120.000. Harga awal adalah...",o:["A. Rp90.000","B. Rp96.000","C. Rp100.000","D. Rp110.000"],j:"C"},
  {q:"5 buku harganya Rp75.000. Harga 8 buku adalah...",o:["A. Rp100.000","B. Rp110.000","C. Rp115.000","D. Rp120.000"],j:"D"},
  {q:"Persegi panjang 12×8 cm. Kelilingnya adalah...",o:["A. 36 cm","B. 40 cm","C. 44 cm","D. 48 cm"],j:"B"},
];

// ── Soal TPA Verbal (10 soal) ──────────────────────────────
const SQ_VER = [
  {q:"Sinonim dari kata ABADI adalah...",o:["A. Sementara","B. Kekal","C. Singkat","D. Hilang"],j:"B"},
  {q:"Antonim dari kata OPTIMIS adalah...",o:["A. Semangat","B. Realistis","C. Pesimis","D. Dinamis"],j:"C"},
  {q:"Dokter : Rumah Sakit = Guru : ...",o:["A. Buku","B. Murid","C. Sekolah","D. Papan tulis"],j:"C"},
  {q:"Kata yang TIDAK berhubungan: Mawar, Melati, Anggrek, Mangga",o:["A. Mawar","B. Melati","C. Anggrek","D. Mangga"],j:"D"},
  {q:"Sinonim dari kata MEWAH adalah...",o:["A. Sederhana","B. Megah","C. Murah","D. Biasa"],j:"B"},
  {q:"Antonim dari kata KONSISTEN adalah...",o:["A. Tetap","B. Stabil","C. Berubah-ubah","D. Taat"],j:"C"},
  {q:"Pena : Menulis = Pisau : ...",o:["A. Tajam","B. Memotong","C. Besi","D. Dapur"],j:"B"},
  {q:"Kalimat dengan ejaan paling tepat adalah...",o:["A. Kami pergi ke-sekolah hari ini.","B. Kami pergi kesekolah hari ini.","C. Kami pergi ke sekolah hari ini.","D. Kami pergi Ke Sekolah hari ini."],j:"C"},
  {q:"Sinonim dari kata INOVASI adalah...",o:["A. Tradisi","B. Pembaruan","C. Warisan","D. Konservatif"],j:"B"},
  {q:"Buku : Membaca = Lagu : ...",o:["A. Nada","B. Musik","C. Mendengarkan","D. Radio"],j:"C"},
];

// ── Pernyataan Minat (5 kategori × 5 pernyataan) ───────────
const PM = {
  "Teknologi": [
    "Saya tertarik mempelajari cara kerja komputer dan perangkat digital.",
    "Saya tertarik mencoba aplikasi atau teknologi baru.",
    "Saya tertarik belajar pemrograman atau pengembangan aplikasi.",
    "Saya suka memecahkan masalah yang membutuhkan logika.",
    "Saya tertarik dengan perkembangan AI dan teknologi masa depan."
  ],
  "Kesehatan": [
    "Saya tertarik mempelajari tubuh manusia dan cara kerjanya.",
    "Saya senang membantu orang yang sedang sakit.",
    "Saya tertarik mempelajari obat-obatan dan dunia medis.",
    "Saya tertarik dengan materi biologi dan kesehatan.",
    "Saya ingin berkontribusi meningkatkan kualitas kesehatan masyarakat."
  ],
  "Bisnis": [
    "Saya tertarik mempelajari cara mengelola keuangan.",
    "Saya tertarik membangun atau mengembangkan usaha sendiri.",
    "Saya senang merencanakan untuk mencapai keuntungan.",
    "Saya tertarik mempelajari pemasaran dan strategi bisnis.",
    "Saya senang menganalisis peluang dan risiko dalam usaha."
  ],
  "Komunikasi": [
    "Saya senang berbicara dan menyampaikan ide kepada orang lain.",
    "Saya mudah beradaptasi saat berinteraksi dengan orang baru.",
    "Saya tertarik membuat presentasi atau berbicara di depan umum.",
    "Saya senang menulis, membuat konten, atau menyampaikan informasi.",
    "Saya tertarik mempelajari media, komunikasi, dan hubungan masyarakat."
  ],
  "Sosial": [
    "Saya tertarik memahami perilaku dan karakter manusia.",
    "Saya senang membantu menyelesaikan masalah orang lain.",
    "Saya tertarik mempelajari fenomena sosial di masyarakat.",
    "Saya senang bekerja dalam kelompok.",
    "Saya tertarik melakukan kegiatan pelayanan masyarakat."
  ]
};

// ── Definisi Jurusan (mapping ke kategori) ─────────────────
const JURUSAN = {
  'Informatika':         {ak:'Teknologi',  tpa:'logika',  mi:'Teknologi'},
  'Sistem Informasi':    {ak:'Teknologi',  tpa:'verbal',  mi:'Teknologi'},
  'Kedokteran':          {ak:'Kesehatan',  tpa:'logika',  mi:'Kesehatan'},
  'Keperawatan':         {ak:'Kesehatan',  tpa:'verbal',  mi:'Kesehatan'},
  'Gizi':                {ak:'Kesehatan',  tpa:'numerik', mi:'Kesehatan'},
  'Akuntansi':           {ak:'Bisnis',     tpa:'numerik', mi:'Bisnis'},
  'Manajemen':           {ak:'Bisnis',     tpa:'verbal',  mi:'Bisnis'},
  'Ilmu Komunikasi':     {ak:'Komunikasi', tpa:'verbal',  mi:'Komunikasi'},
  'Psikologi':           {ak:'Komunikasi', tpa:'verbal',  mi:'Sosial'},
  'Administrasi Publik': {ak:'Komunikasi', tpa:'logika',  mi:'Sosial'},
};

// ── Prospek Karier & Alasan per Jurusan ────────────────────
const PROSPEK = {
  'Informatika': {
    p: ['Software Engineer','Data Scientist','AI Engineer','DevOps Engineer','Cybersecurity Analyst','Mobile Developer'],
    a: ['Nilai Matematika & Fisika mendukung logika komputasi','TPA logika sesuai dengan pola pikir pemrograman','Minat teknologi menjadi fondasi motivasi belajar']
  },
  'Sistem Informasi': {
    p: ['Business Analyst','IT Project Manager','System Analyst','ERP Consultant','Database Admin','IT Consultant'],
    a: ['Kemampuan analisis cocok menjembatani bisnis & teknologi','TPA verbal mendukung komunikasi dalam tim proyek','Minat teknologi berpadu dengan pemahaman bisnis']
  },
  'Kedokteran': {
    p: ['Dokter Umum','Dokter Spesialis','Peneliti Medis','Dosen Kedokteran','Medical Advisor'],
    a: ['Nilai Biologi & Kimia sangat kuat untuk dasar ilmu kedokteran','Kemampuan logika mendukung proses diagnosis klinis','Minat kesehatan menjadi motivasi jangka panjang']
  },
  'Keperawatan': {
    p: ['Perawat Klinis','Nurse Manager','Perawat ICU','Pendidik Keperawatan','Community Health Nurse'],
    a: ['Nilai sains mendukung pemahaman keperawatan','TPA verbal penting untuk komunikasi dengan pasien','Minat membantu orang lain sangat relevan']
  },
  'Gizi': {
    p: ['Ahli Gizi Klinik','Konsultan Nutrisi','Food Scientist','Peneliti Pangan','Dietisien'],
    a: ['Dasar sains mendukung biokimia dan nutrisi','TPA numerik penting untuk kalkulasi kebutuhan gizi','Minat kesehatan memastikan motivasi belajar kuat']
  },
  'Akuntansi': {
    p: ['Akuntan Publik','Auditor','Tax Consultant','Financial Analyst','CFO'],
    a: ['Kemampuan matematika kuat untuk analisis keuangan','TPA numerik adalah inti pekerjaan akuntansi','Minat bisnis membuat paham konteks keuangan']
  },
  'Manajemen': {
    p: ['Marketing Manager','HR Manager','Business Development','Entrepreneur','Operations Manager'],
    a: ['Kemampuan verbal mendukung kepemimpinan','Minat bisnis sangat relevan','Nilai akademik mendukung pemahaman manajerial']
  },
  'Ilmu Komunikasi': {
    p: ['Jurnalis','Public Relations','Content Creator','Brand Strategist','Media Planner'],
    a: ['Kemampuan verbal sangat baik untuk bercerita & persuasi','Minat komunikasi menjadi modal utama','Nilai Bahasa Inggris mendukung komunikasi global']
  },
  'Psikologi': {
    p: ['Psikolog Klinis','HRD Specialist','Konselor','Peneliti Perilaku','Life Coach'],
    a: ['Kemampuan empati & komunikasi mendukung interaksi klien','TPA verbal penting memahami narasi & perilaku','Minat sosial menjadi motivasi membantu orang']
  },
  'Administrasi Publik': {
    p: ['PNS/ASN','Policy Analyst','Konsultan Pemerintah','NGO Manager','Diplomat'],
    a: ['Kemampuan logika mendukung pembuatan kebijakan','Minat sosial & pelayanan masyarakat sangat relevan','Nilai akademik mendukung pemahaman tata kelola']
  },
};

// ── Ikon per Jurusan ───────────────────────────────────────
const ICON_JURUSAN = {
  "Informatika":         "💻",
  "Sistem Informasi":    "🖥️",
  "Kedokteran":          "🩺",
  "Keperawatan":         "🏥",
  "Gizi":                "🥗",
  "Akuntansi":           "📊",
  "Manajemen":           "📋",
  "Ilmu Komunikasi":     "📢",
  "Psikologi":           "🧠",
  "Administrasi Publik": "🏛️"
};
