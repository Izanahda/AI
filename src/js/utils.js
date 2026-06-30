/**
 * utils.js
 * Fungsi helper kecil. Tidak bergantung pada file JS lain.
 */

/** Bersihkan string jadi ID aman HTML. "Bahasa Inggris" → "Bahasa_Inggris" */
function esc(str) {
  return str.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
}

/** Format angka desimal. fmt(3.1415, 2) → "3.14" */
function fmt(num, digits = 2) {
  return Number(num).toFixed(digits);
}

/** Batasi nilai dalam rentang [min, max]. */
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

/** Rata-rata array angka. Kembalikan 0 jika kosong. */
function average(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

/**
 * Toast notifikasi ringan di pojok kanan bawah.
 * @param {string} pesan
 * @param {'info'|'sukses'|'error'|'warn'} tipe
 * @param {number} durasi ms
 */
function showToast(pesan, tipe = 'info', durasi = 3000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;bottom:24px;right:24px;display:flex;flex-direction:column;gap:8px;z-index:9999;pointer-events:none;';
    document.body.appendChild(container);
  }
  const warna = { info:'#0085C8', sukses:'#16A34A', error:'#DC2626', warn:'#D97706' };
  const ikon  = { info:'ℹ️', sukses:'✅', error:'❌', warn:'⚠️' };
  const toast = document.createElement('div');
  toast.style.cssText = `background:${warna[tipe]||warna.info};color:#fff;padding:10px 16px;border-radius:10px;font-size:13px;font-weight:600;box-shadow:0 4px 12px rgba(0,0,0,.15);opacity:0;transform:translateY(8px);transition:all .25s ease;pointer-events:auto;max-width:280px;`;
  toast.textContent = `${ikon[tipe]||''} ${pesan}`;
  container.appendChild(toast);
  requestAnimationFrame(() => { toast.style.opacity='1'; toast.style.transform='translateY(0)'; });
  setTimeout(() => {
    toast.style.opacity='0'; toast.style.transform='translateY(8px)';
    setTimeout(() => toast.remove(), 300);
  }, durasi);
}

/** Animasikan bar ke persentase target. */
function animateBar(el, targetPct, delay = 100) {
  if (!el) return;
  setTimeout(() => { el.style.width = clamp(targetPct, 0, 100) + '%'; }, delay);
}

/** Cek apakah layar mobile (<540px). */
function isMobile() {
  return window.innerWidth < 540;
}
