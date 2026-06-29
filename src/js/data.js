const SOAL_LOGIKA = [
  {
    soal: "Semua siswa rajin. Budi adalah siswa. Kesimpulan yang tepat adalah...",
    opsi: ["Budi tidak rajin", "Budi rajin", "Budi mungkin rajin", "Tidak bisa disimpulkan"],
    jawaban: 1
  },
  {
    soal: "Jika hari hujan maka jalanan basah. Jalanan basah. Maka...",
    opsi: ["Pasti hari hujan", "Belum tentu hari hujan", "Hari tidak hujan", "Jalanan kering"],
    jawaban: 1
  },
  {
    soal: "Deret: 2, 4, 8, 16, ... Bilangan selanjutnya adalah...",
    opsi: ["24", "30", "32", "28"],
    jawaban: 2
  },
  {
    soal: "Semua A adalah B. Semua B adalah C. Maka...",
    opsi: ["Semua C adalah A", "Sebagian A adalah C", "Semua A adalah C", "Tidak ada A adalah C"],
    jawaban: 2
  },
  {
    soal: "Deret: 3, 6, 11, 18, 27, ... Bilangan selanjutnya adalah...",
    opsi: ["36", "38", "40", "48"],
    jawaban: 1
  }
];

const SOAL_NUMERIK = [
  {
    soal: "Hasil dari 15% × 200 adalah...",
    opsi: ["25", "30", "35", "40"],
    jawaban: 1
  },
  {
    soal: "Jika x + 5 = 12, maka nilai x adalah...",
    opsi: ["5", "6", "7", "8"],
    jawaban: 2
  },
  {
    soal: "Rata-rata dari 10, 20, 30, 40, 50 adalah...",
    opsi: ["25", "30", "35", "40"],
    jawaban: 1
  },
  {
    soal: "Sebuah persegi panjang memiliki panjang 8 dan lebar 5. Luasnya adalah...",
    opsi: ["13", "26", "40", "45"],
    jawaban: 2
  },
  {
    soal: "Jika 3x = 21, maka x² adalah...",
    opsi: ["7", "14", "49", "21"],
    jawaban: 2
  }
];

const SOAL_VERBAL = [
  {
    soal: "Antonim dari kata 'OPTIMIS' adalah...",
    opsi: ["Semangat", "Pesimis", "Realistis", "Dinamis"],
    jawaban: 1
  },
  {
    soal: "Sinonim dari kata 'ABADI' adalah...",
    opsi: ["Sementara", "Singkat", "Kekal", "Hilang"],
    jawaban: 2
  },
  {
    soal: "Dokter : Rumah Sakit = Guru : ...",
    opsi: ["Buku", "Sekolah", "Murid", "Papan tulis"],
    jawaban: 1
  },
  {
    soal: "Kata yang tidak berhubungan: Mawar, Melati, Anggrek, Mangga",
    opsi: ["Mawar", "Melati", "Anggrek", "Mangga"],
    jawaban: 3
  },
  {
    soal: "Kalimat dengan ejaan paling tepat adalah...",
    opsi: [
      "Kami pergi ke-sekolah hari ini.",
      "Kami pergi kesekolah hari ini.",
      "Kami pergi ke sekolah hari ini.",
      "Kami pergi Ke Sekolah hari ini."
    ],
    jawaban: 2
  }
];

const PERNYATAAN_MINAT = {
  Teknologi: [
    "Saya tertarik mempelajari cara kerja komputer dan perangkat digital.",
    "Saya tertarik mencoba aplikasi atau teknologi baru.",
    "Saya tertarik belajar pemrograman atau pengembangan aplikasi.",
    "Saya suka memecahkan masalah yang membutuhkan logika dan analisis.",
    "Saya tertarik dengan perkembangan AI dan teknologi masa depan."
  ],
  Kesehatan: [
    "Saya tertarik mempelajari tubuh manusia dan cara kerjanya.",
    "Saya senang membantu orang yang sakit atau membutuhkan bantuan kesehatan.",
    "Saya tertarik mempelajari obat-obatan dan dunia medis.",
    "Saya tertarik dengan materi biologi dan kesehatan.",
    "Saya ingin berkontribusi meningkatkan kualitas kesehatan masyarakat."
  ],
  Bisnis: [
    "Saya tertarik mempelajari cara mengelola keuangan.",
    "Saya tertarik membangun atau mengembangkan usaha sendiri.",
    "Saya senang membuat perencanaan untuk mencapai keuntungan.",
    "Saya tertarik mempelajari pemasaran dan strategi bisnis.",
    "Saya senang menganalisis peluang dan risiko dalam kegiatan usaha."
  ],
  Komunikasi: [
    "Saya senang berbicara dan menyampaikan ide kepada orang lain.",
    "Saya mudah beradaptasi saat berinteraksi dengan orang baru.",
    "Saya tertarik membuat presentasi atau berbicara di depan umum.",
    "Saya senang menulis, membuat konten, atau menyampaikan informasi.",
    "Saya tertarik mempelajari media, komunikasi, dan hubungan masyarakat."
  ],
  Sosial: [
    "Saya tertarik memahami perilaku dan karakter manusia.",
    "Saya senang membantu menyelesaikan masalah yang dihadapi orang lain.",
    "Saya tertarik mempelajari fenomena sosial di masyarakat.",
    "Saya senang bekerja dalam kelompok dan berinteraksi dengan banyak orang.",
    "Saya tertarik melakukan kegiatan yang berkaitan dengan pelayanan masyarakat."
  ]
};

const MAPEL_MIPA = ["Matematika", "Fisika", "Biologi", "Kimia", "Bahasa Inggris"];
const MAPEL_IPS  = ["Matematika", "Ekonomi", "Sosiologi", "Bahasa Inggris"];

const JURUSAN_DEF = {
  "Informatika":         { ak: "Teknologi",  tpa: "logika",   minat: "Teknologi" },
  "Sistem Informasi":    { ak: "Teknologi",  tpa: "verbal",   minat: "Teknologi" },
  "Kedokteran":          { ak: "Kesehatan",  tpa: "logika",   minat: "Kesehatan" },
  "Keperawatan":         { ak: "Kesehatan",  tpa: "verbal",   minat: "Kesehatan" },
  "Gizi":                { ak: "Kesehatan",  tpa: "numerik",  minat: "Kesehatan" },
  "Akuntansi":           { ak: "Bisnis",     tpa: "numerik",  minat: "Bisnis"    },
  "Manajemen":           { ak: "Bisnis",     tpa: "verbal",   minat: "Bisnis"    },
  "Ilmu Komunikasi":     { ak: "Komunikasi", tpa: "verbal",   minat: "Komunikasi"},
  "Psikologi":           { ak: "Komunikasi", tpa: "verbal",   minat: "Sosial"    },
  "Administrasi Publik": { ak: "Komunikasi", tpa: "logika",   minat: "Sosial"    }
};

const PROSPEK_KERJA = {
  "Informatika":         "Software engineer, data engineer, AI developer, cybersecurity analyst",
  "Sistem Informasi":    "System analyst, business analyst, IT consultant, project coordinator",
  "Kedokteran":          "Dokter spesialis, dokter umum, peneliti medis, tenaga kesehatan",
  "Keperawatan":         "Perawat klinis, perawat ICU, perawat komunitas, edukator kesehatan",
  "Gizi":                "Ahli gizi rumah sakit, konsultan gizi, nutritionist, food service manager",
  "Akuntansi":           "Akuntan, auditor, analis keuangan, konsultan pajak",
  "Manajemen":           "Manager operasional, entrepreneur, marketing manager, HR officer",
  "Ilmu Komunikasi":     "Public relations, content creator, broadcaster, corporate communicator",
  "Psikologi":           "Psikolog klinis, konselor, HR specialist, peneliti perilaku",
  "Administrasi Publik": "Analis kebijakan, pegawai negeri, staf pemerintah, project officer"
};

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