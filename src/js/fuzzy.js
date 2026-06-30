/**
 * fuzzy.js
 * Core engine Fuzzy Logic Mamdani.
 * File ini adalah acuan utama — jangan ubah logika di dalamnya
 * kecuali ada perubahan metode yang disengaja.
 *
 * Dependensi: data.js (JURUSAN, PROSPEK) harus dimuat lebih dulu.
 */

// ── Engine Fuzzy (object) ───────────────────────────────────
const Fuzzy = {

  /**
   * Fuzzifikasi nilai (0–100) ke derajat keanggotaan.
   * @param {number} n - nilai input
   * @returns {{rendah, sedang, tinggi}} derajat keanggotaan ternormalisasi
   */
  fuzzify(n) {
    // Fungsi keanggotaan RENDAH
    const r = n <= 60 ? Math.max(0, Math.min(1, (60 - n) / 60)) : 0;

    // Fungsi keanggotaan SEDANG
    let s = 0;
    if      (n <= 50) s = 0;
    else if (n <= 65) s = (n - 50) / 15;
    else if (n <= 80) s = 1;
    else              s = Math.max(0, (100 - n) / 20);

    // Fungsi keanggotaan TINGGI
    const t = n <= 70 ? 0 : Math.min(1, (n - 70) / 30);

    const sum = r + s + t || 1;
    return { rendah: r / sum, sedang: s / sum, tinggi: t / sum };
  },

  /**
   * Kategori dominan dari nilai input.
   * @param {number} n - nilai input
   * @returns {'rendah'|'sedang'|'tinggi'}
   */
  dom(n) {
    const f = this.fuzzify(n);
    return Object.entries(f).sort((a, b) => b[1] - a[1])[0][0];
  },

  /**
   * Tabel aturan Mamdani (IF-THEN rules).
   * Key: "kategori_ak,kategori_tpa,kategori_minat"
   * Value: skor output (1–4)
   */
  RULES: {
    "tinggi,tinggi,tinggi": 4,
    "sedang,tinggi,tinggi": 3,
    "tinggi,tinggi,sedang": 3,
    "sedang,sedang,sedang": 2,
    "rendah,rendah,rendah": 1,
  },

  /**
   * Hitung skor fuzzy untuk satu kombinasi nilai input.
   * Jika rule tidak ditemukan → weighted average (defuzzifikasi fallback).
   *
   * @param {number} ak    - nilai akademik (0–100)
   * @param {number} tp    - nilai TPA (0–100)
   * @param {number} mi    - nilai minat (0–100)
   * @returns {{skor, pct, combo}}
   */
  skor(ak, tp, mi) {
    const key = `${this.dom(ak)},${this.dom(tp)},${this.dom(mi)}`;
    let s = this.RULES[key];

    if (s === undefined) {
      // Defuzzifikasi: weighted average
      const fa = this.fuzzify(ak);
      const ft = this.fuzzify(tp);
      const fm = this.fuzzify(mi);
      s = (
        fa.tinggi * 4 + fa.sedang * 2.5 + fa.rendah * 1 +
        ft.tinggi * 4 + ft.sedang * 2.5 + ft.rendah * 1 +
        fm.tinggi * 4 + fm.sedang * 2.5 + fm.rendah * 1
      ) / 3;
    }

    return {
      skor:  Math.round(s * 100) / 100,
      pct:   Math.round((s / 4) * 100),
      combo: [this.dom(ak), this.dom(tp), this.dom(mi)]
    };
  }
};

// ── Fungsi Akademik ─────────────────────────────────────────
/**
 * Hitung nilai akademik per kategori dari nilai mapel.
 * @param {object} mapel - { "Matematika": 80, "Fisika": 75, ... }
 * @param {'MIPA'|'IPS'} sma
 * @returns {object} nilai per kategori { Teknologi, Kesehatan, Bisnis, Komunikasi, Sosial }
 */
function hitungAkademik(mapel, sma) {
  const avg = (...k) => {
    const v = k.map(x => parseFloat(mapel[x] || 0));
    return v.reduce((a, b) => a + b, 0) / v.length;
  };

  return sma === 'MIPA'
    ? {
        Teknologi:  avg('Matematika', 'Fisika'),
        Kesehatan:  avg('Biologi', 'Kimia'),
        Bisnis:     avg('Matematika'),
        Komunikasi: avg('Bahasa Inggris'),
        Sosial:     avg('Bahasa Inggris')
      }
    : {
        Teknologi:  avg('Matematika'),
        Kesehatan:  0,
        Bisnis:     avg('Matematika', 'Ekonomi'),
        Komunikasi: avg('Bahasa Inggris', 'Sosiologi'),
        Sosial:     avg('Sosiologi')
      };
}

// ── Fungsi Hitung Semua Jurusan ─────────────────────────────
/**
 * Hitung skor semua jurusan dan kembalikan urutan terbaik.
 * @param {object} akPerKat  - output hitungAkademik()
 * @param {object} tpaVals   - { logika: 80, numerik: 60, verbal: 70 }
 * @param {object} minatVals - { Teknologi: 85, Kesehatan: 50, ... }
 * @param {'MIPA'|'IPS'} sma
 * @returns {Array} array hasil jurusan terurut dari skor tertinggi
 */
function hitungSemua(akPerKat, tpaVals, minatVals, sma) {
  return Object.entries(JURUSAN)
    .filter(([, d]) => !(sma === 'IPS' && d.ak === 'Kesehatan'))
    .map(([jurusan, d]) => {
      const ak = akPerKat[d.ak]  || 0;
      const tp = tpaVals[d.tpa]  || 0;
      const mi = minatVals[d.mi] || 0;
      const { skor, pct, combo } = Fuzzy.skor(ak, tp, mi);
      return {
        jurusan,
        skor,
        pct,
        combo,
        akVal:    Math.round(ak),
        tpaVal:   Math.round(tp),
        minatVal: Math.round(mi),
        // Sebar data prospek & alasan dari PROSPEK
        ...PROSPEK[jurusan]
      };
    })
    .sort((a, b) => b.skor - a.skor);
}

// ── Label Kesesuaian ────────────────────────────────────────
/**
 * Kembalikan label teks dan class CSS berdasarkan skor.
 * @param {number} s - skor (0–4)
 * @returns {{t: string, c: string}}
 */
function labelSkor(s) {
  if (s >= 3.5) return { t: 'Sangat Cocok ✨', c: 'l-sv' };
  if (s >= 2.5) return { t: 'Cocok ✅',        c: 'l-co' };
  if (s >= 1.5) return { t: 'Cukup Cocok',     c: 'l-ck' };
  return              { t: 'Kurang Cocok',     c: 'l-ku' };
}
