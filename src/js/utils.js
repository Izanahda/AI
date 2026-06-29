/**
 * utils.js
 * Fungsi-fungsi helper kecil yang dipakai di seluruh aplikasi.
 * Tidak bergantung pada file JS lain — bisa dipakai mandiri.
 */

/**
 * Bersihkan string menjadi ID yang aman untuk HTML.
 * Contoh: "Bahasa Inggris" → "Bahasa_Inggris"
 */
function esc(str) {
  return str.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
}

/**
 * Format angka desimal dengan jumlah digit tertentu.
 * Contoh: fmt(3.1415, 2) → "3.14"
 */
function fmt(num, digits = 2) {
  return Number(num).toFixed(digits);
}

/**
 * Clamp nilai agar berada dalam rentang [min, max].
 * Contoh: clamp(150, 0, 100) → 100
 */
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

/**
 * Hitung rata-rata dari array angka.
 * Mengembalikan 0 jika array kosong.
 */
function average(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

/**
 * Validasi nilai rapor: harus angka antara 0–100.
 * Mengembalikan { valid: bool, pesan: string }
 */
function validasiNilai(nilai, namaMapel) {
  const n = parseFloat(nilai);
  if (isNaN(n))      return { valid: false, pesan: `Nilai ${namaMapel} harus berupa angka.` };
  if (n < 0 || n > 100) return { valid: false, pesan: `Nilai ${namaMapel} harus antara 0 – 100.` };
  return { valid: true, pesan: "" };
}

/**
 * Tampilkan notifikasi toast ringan di pojok layar.
 * Otomatis hilang setelah `durasi` ms.
 */
function showToast(pesan, tipe = "info", durasi = 3000) {
  // Buat elemen toast jika belum ada container-nya
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.style.cssText = `
      position: fixed; bottom: 24px; right: 24px;
      display: flex; flex-direction: column; gap: 8px;
      z-index: 9999; pointer-events: none;
    `;
    document.body.appendChild(container);
  }

  const warna = { info: "#0085C8", sukses: "#16A34A", error: "#DC2626", warn: "#D97706" };
  const ikon  = { info: "ℹ️", sukses: "✅", error: "❌", warn: "⚠️" };

  const toast = document.createElement("div");
  toast.style.cssText = `
    background: ${warna[tipe] || warna.info};
    color: #fff;
    padding: 10px 16px;
    border-radius: 10px;
    font-size: 13px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    opacity: 0;
    transform: translateY(8px);
    transition: all .25s ease;
    pointer-events: auto;
    max-width: 280px;
  `;
  toast.textContent = `${ikon[tipe] || ""} ${pesan}`;
  container.appendChild(toast);

  // Animasi masuk
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });

  // Animasi keluar
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(8px)";
    setTimeout(() => toast.remove(), 300);
  }, durasi);
}

/**
 * Scroll halus ke elemen tertentu.
 * Contoh: scrollTo("step-hasil")
 */
function scrollToEl(id, offset = 140) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
}

/**
 * Animasikan progress bar dari 0 ke nilai target.
 * @param {HTMLElement} el - elemen bar
 * @param {number} targetPct - persentase target (0–100)
 * @param {number} delay - delay awal dalam ms
 */
function animateBar(el, targetPct, delay = 100) {
  setTimeout(() => {
    el.style.width = clamp(targetPct, 0, 100) + "%";
  }, delay);
}

/**
 * Deteksi apakah perangkat layar kecil (mobile).
 */
function isMobile() {
  return window.innerWidth < 540;
}