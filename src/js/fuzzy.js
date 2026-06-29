/**
 * fuzzy.js
 * Implementasi Fuzzy Logic Mamdani untuk sistem rekomendasi jurusan.
 * Diterjemahkan dari fuzzy_model.py ke JavaScript.
 */

const FUZZY_RULES = {
  "tinggi,tinggi,tinggi": 4.0,
  "sedang,tinggi,tinggi": 3.0,
  "tinggi,tinggi,sedang": 3.0,
  "tinggi,sedang,tinggi": 3.0,
  "sedang,sedang,sedang": 2.0,
  "tinggi,sedang,sedang": 2.5,
  "sedang,tinggi,sedang": 2.5,
  "rendah,rendah,rendah": 1.0,
  "rendah,sedang,rendah": 1.5,
  "rendah,rendah,sedang": 1.5,
};

/**
 * Fuzzifikasi nilai (0–100) ke derajat keanggotaan rendah/sedang/tinggi.
 * Fungsi keanggotaan trapesium/segitiga.
 */
function fuzzify(nilai) {
  // Fungsi keanggotaan RENDAH (turun dari 60 ke bawah)
  let rendah = 0;
  if (nilai <= 0)  rendah = 1;
  else if (nilai < 60) rendah = (60 - nilai) / 60;
  else rendah = 0;

  // Fungsi keanggotaan SEDANG (naik 50–65, plateau 65–80, turun 80–100)
  let sedang = 0;
  if (nilai <= 50)       sedang = 0;
  else if (nilai <= 65)  sedang = (nilai - 50) / 15;
  else if (nilai <= 80)  sedang = 1;
  else                   sedang = Math.max(0, (100 - nilai) / 20);

  // Fungsi keanggotaan TINGGI (naik dari 70 ke 100)
  let tinggi = 0;
  if (nilai <= 70)  tinggi = 0;
  else if (nilai <= 100) tinggi = (nilai - 70) / 30;
  else tinggi = 1;

  // Normalisasi
  const total = rendah + sedang + tinggi || 1;
  return {
    rendah: rendah / total,
    sedang: sedang / total,
    tinggi: tinggi / total
  };
}

/**
 * Tentukan kategori dominan dari nilai fuzzy.
 */
function kategoriDominan(nilai) {
  const f = fuzzify(nilai);
  return Object.entries(f).sort((a, b) => b[1] - a[1])[0][0];
}

/**
 * Hitung skor fuzzy untuk satu jurusan berdasarkan nilai akademik, TPA, dan minat.
 * @returns {object} { skor, persentase, kategori }
 */
function hitungSkorJurusan(akVal, tpaVal, minatVal) {
  const akK   = kategoriDominan(akVal);
  const tpaK  = kategoriDominan(tpaVal);
  const miK   = kategoriDominan(minatVal);
  const key   = `${akK},${tpaK},${miK}`;

  let skor = FUZZY_RULES[key];

  // Jika rule tidak ada → gunakan defuzzifikasi weighted average
  if (skor === undefined) {
    const fA = fuzzify(akVal);
    const fT = fuzzify(tpaVal);
    const fM = fuzzify(minatVal);
    const skorAk   = fA.tinggi * 4 + fA.sedang * 2.5 + fA.rendah * 1;
    const skorTpa  = fT.tinggi * 4 + fT.sedang * 2.5 + fT.rendah * 1;
    const skorMi   = fM.tinggi * 4 + fM.sedang * 2.5 + fM.rendah * 1;
    skor = (skorAk + skorTpa + skorMi) / 3;
  }

  skor = Math.round(skor * 100) / 100;
  const persentase = Math.round((skor / 4) * 100);

  return {
    skor,
    persentase,
    kategori: { ak: akK, tpa: tpaK, minat: miK }
  };
}

/**
 * Hitung nilai akademik per kategori dari nilai mapel.
 */
function hitungAkademikPerKategori(nilaiMapel, jurusanSMA) {
  const avg = (...keys) => {
    const vals = keys.filter(k => nilaiMapel[k] !== undefined).map(k => nilaiMapel[k]);
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  };

  if (jurusanSMA === "MIPA") {
    return {
      Teknologi:  avg("Matematika", "Fisika"),
      Kesehatan:  avg("Biologi", "Kimia"),
      Bisnis:     avg("Matematika"),
      Komunikasi: avg("Bahasa Inggris")
    };
  } else {
    return {
      Teknologi:  avg("Matematika"),
      Kesehatan:  0,
      Bisnis:     avg("Matematika", "Ekonomi"),
      Komunikasi: avg("Bahasa Inggris", "Sosiologi")
    };
  }
}

/**
 * Hitung skor semua jurusan dan urutkan.
 */
function hitungSemuaJurusan(nilaiMapel, jurusanSMA, tpaVals, minatVals) {
  const akPer = hitungAkademikPerKategori(nilaiMapel, jurusanSMA);
  const hasil = [];

  for (const [jurusan, def] of Object.entries(JURUSAN_DEF)) {
    if (jurusanSMA === "IPS" && def.ak === "Kesehatan") continue;

    const akVal    = akPer[def.ak]    || 0;
    const tpaVal   = tpaVals[def.tpa] || 0;
    const minatVal = minatVals[def.minat] || 0;

    const { skor, persentase, kategori } = hitungSkorJurusan(akVal, tpaVal, minatVal);

    hasil.push({
      jurusan,
      skor,
      persentase,
      kategori,
      akVal:    Math.round(akVal),
      tpaVal:   Math.round(tpaVal),
      minatVal: Math.round(minatVal)
    });
  }

  return hasil.sort((a, b) => b.skor - a.skor);
}

/**
 * Hitung nilai minat per kategori dari jawaban kuesioner.
 */
function hitungNilaiMinat(minatAnswers) {
  const hasil = {};
  for (const [kat, answers] of Object.entries(minatAnswers)) {
    const total = answers.reduce((a, b) => a + b, 0);
    const nilai = ((total - 5) / 15) * 100;
    hasil[kat] = Math.round(Math.max(0, Math.min(100, nilai)) * 10) / 10;
  }
  return hasil;
}

/**
 * Label kesesuaian berdasarkan skor.
 */
function labelSkor(skor) {
  if (skor >= 3.5) return { text: "Sangat Cocok",  cls: "label-sangat" };
  if (skor >= 2.5) return { text: "Cocok",          cls: "label-cocok"  };
  if (skor >= 1.5) return { text: "Cukup Cocok",    cls: "label-cukup"  };
  return              { text: "Kurang Cocok",    cls: "label-kurang" };
}