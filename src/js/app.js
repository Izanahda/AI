/**
 * app.js
 * Controller untuk form.html — mengelola alur langkah TPA dan minat,
 * lalu menyimpan hasil ke localStorage sebelum redirect ke hasil.html
 *
 * Dependensi (harus dimuat sebelum file ini):
 *   src/js/data.js   → MAPEL_MIPA, MAPEL_IPS, SQ_LOG, SQ_NUM, SQ_VER, PM, JURUSAN, PROSPEK
 *   src/js/fuzzy.js  → Fuzzy, hitungAkademik(), hitungSemua(), labelSkor()
 *   src/js/utils.js  → esc(), showToast()
 */

// ── State ───────────────────────────────────────────────────
let step       = 0;
let timerInt   = null;
let timerSec   = 600;
let timerMax   = 600;
let activeTPA  = '';
const tpaAns   = { logika: {}, numerik: {}, verbal: {} };

// ── Progress ────────────────────────────────────────────────
function updProg() {
  document.querySelectorAll('.prog-step').forEach((el, i) => {
    el.classList.remove('active', 'done');
    if (i < step)  el.classList.add('done');
    if (i === step) el.classList.add('active');
  });
}

// ── Navigasi ────────────────────────────────────────────────
function showStep(n) {
  document.querySelectorAll('.fsec').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('s' + n);
  if (el) el.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  updProg();
}

function goNext() {
  if (!validate()) return;
  if (step === 0) buildMapel();
  if (step === 1) buildMinat();
  step++;
  showStep(step);
}

function goPrev() {
  step = Math.max(0, step - 1);
  showStep(step);
}

// ── Validasi per step ───────────────────────────────────────
function validate() {
  if (step === 0) {
    const nama = document.getElementById('nama');
    const sma  = document.getElementById('sma');
    const okNama = nama.value.trim() !== '';
    const okSma  = sma.value !== '';
    document.getElementById('f-nama').classList.toggle('err', !okNama);
    document.getElementById('f-sma').classList.toggle('err', !okSma);
    return okNama && okSma;
  }

  if (step === 1) {
    let ok = true;
    document.querySelectorAll('#mapelBox input').forEach(inp => {
      const v = parseFloat(inp.value);
      const err = isNaN(v) || v < 0 || v > 100 || inp.value === '';
      inp.closest('.field').classList.toggle('err', err);
      if (err) ok = false;
    });
    return ok;
  }

  if (step === 2) {
    let miss = 0;
    Object.entries(PM).forEach(([kat, ps]) => {
      ps.forEach((_, i) => {
        if (!document.querySelector(`.sk-btn.on[data-kat="${kat}"][data-idx="${i}"]`)) miss++;
      });
    });
    if (miss > 0) {
      showToast(`Masih ada ${miss} pernyataan belum dijawab!`, 'warn', 3000);
      return false;
    }
    return true;
  }

  return true;
}

// ── Build mapel inputs ──────────────────────────────────────
function buildMapel() {
  const sma = document.getElementById('sma').value;
  const ms  = sma === 'MIPA' ? MAPEL_MIPA : MAPEL_IPS;
  document.getElementById('mapelBox').innerHTML =
    '<div class="fgrid2">' +
    ms.map(m => `
      <div class="field" id="fm-${esc(m)}">
        <label>${m}</label>
        <input type="number" id="v-${esc(m)}" min="0" max="100" placeholder="0–100">
        <div class="field-err-msg">Nilai harus 0–100.</div>
      </div>`
    ).join('') +
    '</div>';
}

// ── Build minat questionnaire ───────────────────────────────
function buildMinat() {
  document.getElementById('minatBox').innerHTML = Object.entries(PM).map(([kat, ps]) => `
    <div class="minat-cat">
      <div class="minat-hd">${kat}</div>
      ${ps.map((p, i) => `
        <div class="prow">
          <div class="prow-txt">${i + 1}. ${p}</div>
          <div class="skala">
            ${[1,2,3,4].map(n =>
              `<button class="sk-btn" data-kat="${kat}" data-idx="${i}" data-val="${n}" onclick="pickSk(this)">${n}</button>`
            ).join('')}
          </div>
        </div>`
      ).join('')}
    </div>`
  ).join('');
}

function pickSk(btn) {
  const k = btn.dataset.kat;
  const i = btn.dataset.idx;
  document.querySelectorAll(`.sk-btn[data-kat="${k}"][data-idx="${i}"]`).forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
}

// ── TPA ─────────────────────────────────────────────────────
function startTPA(type) {
  activeTPA = type;
  const sq = { logika: SQ_LOG, numerik: SQ_NUM, verbal: SQ_VER }[type];

  document.getElementById('tpaTag').textContent =
    'TPA ' + type.charAt(0).toUpperCase() + type.slice(1);
  document.getElementById('tpaTitle').textContent =
    { logika: 'Soal Logika', numerik: 'Soal Numerik', verbal: 'Soal Verbal' }[type];

  document.getElementById('soalBox').innerHTML = sq.map((s, si) => `
    <div class="soal" id="sq${si}">
      <div class="soal-num">Soal ${si + 1} dari ${sq.length}</div>
      <div class="soal-txt">${s.q}</div>
      <div class="opsi-list">
        ${s.o.map(o => `
          <label class="opsi" onclick="pickOpsi(this,'${type}-${si}')">
            <input type="radio" name="${type}-${si}" value="${o[0]}">
            <div class="opsi-radio"></div>${o}
          </label>`
        ).join('')}
      </div>
    </div>`
  ).join('');

  // Aktifkan panel TPA, sembunyikan panel lain
  document.getElementById('s-tpa').classList.add('active');
  document.querySelectorAll('.fsec:not(#s-tpa)').forEach(s => s.classList.remove('active'));

  // Mulai timer
  timerSec = 600; timerMax = 600;
  clearInterval(timerInt);
  updFloatTimer();
  document.getElementById('floatTimer').classList.add('show');
  timerInt = setInterval(() => {
    timerSec--;
    updFloatTimer();
    if (timerSec <= 0) { clearInterval(timerInt); selesaiTPA(); }
  }, 1000);
}

function updFloatTimer() {
  const m    = Math.floor(timerSec / 60);
  const s    = timerSec % 60;
  const pct  = (timerSec / timerMax) * 100;
  const val  = document.getElementById('ftVal');
  const fill = document.getElementById('ftFill');
  val.textContent = `${m}:${s.toString().padStart(2, '0')}`;
  fill.style.width = pct + '%';
  val.className   = 'ft-val' + (timerSec <= 60 ? ' danger' : timerSec <= 120 ? ' warn' : '');
  fill.style.background = timerSec <= 60 ? '#dc2626' : timerSec <= 120 ? '#d97706' : '#C2456A';
}

function pickOpsi(el, name) {
  document.querySelectorAll(`[onclick="pickOpsi(this,'${name}')"]`).forEach(l => l.classList.remove('picked'));
  el.classList.add('picked');
  el.closest('.soal').classList.add('answered');
}

function selesaiTPA() {
  clearInterval(timerInt);
  document.getElementById('floatTimer').classList.remove('show');

  const sq = { logika: SQ_LOG, numerik: SQ_NUM, verbal: SQ_VER }[activeTPA];
  let benar = 0;
  sq.forEach((s, i) => {
    const sel = document.querySelector(`input[name="${activeTPA}-${i}"]:checked`);
    if (sel && sel.value === s.j) benar++;
  });
  tpaAns[activeTPA] = (benar / sq.length) * 100;

  document.getElementById('s-tpa').classList.remove('active');
  step++;
  if (step > 5) submitAll();
  else showStep(step);
}

// ── Submit & simpan ke localStorage ────────────────────────
function submitAll() {
  const nama = document.getElementById('nama').value.trim();
  const sma  = document.getElementById('sma').value;

  // Kumpulkan nilai mapel
  const mapel = {};
  document.querySelectorAll('#mapelBox input').forEach(inp => {
    const key = inp.id.replace('v-', '').replace(/_/g, ' ');
    mapel[key] = parseFloat(inp.value) || 0;
  });

  // Hitung akademik per kategori
  const akPerKat = hitungAkademik(mapel, sma);

  // Kumpulkan jawaban minat
  const minatRaw = {};
  document.querySelectorAll('.sk-btn.on').forEach(btn => {
    const k = btn.dataset.kat;
    if (!minatRaw[k]) minatRaw[k] = [];
    minatRaw[k].push(parseInt(btn.dataset.val));
  });

  // Hitung nilai minat per kategori (skala 0–100)
  const minatVals = {};
  Object.keys(PM).forEach(kat => {
    const v = minatRaw[kat] || [];
    minatVals[kat] = v.length
      ? ((v.reduce((a, b) => a + b, 0) - v.length) / (v.length * 3)) * 100
      : 50;
  });

  // Hitung semua jurusan dengan fuzzy
  const hasil = hitungSemua(akPerKat, tpaAns, minatVals, sma);

  // Simpan riwayat (maks 10)
  const hist = JSON.parse(localStorage.getItem('pf_history') || '[]');
  hist.unshift({
    nama,
    tanggal: new Date().toLocaleDateString('id'),
    top1: hasil[0].jurusan,
    pct:  hasil[0].pct
  });
  localStorage.setItem('pf_history', JSON.stringify(hist.slice(0, 10)));

  // Simpan hasil lengkap
  localStorage.setItem('pf_nama',  nama);
  localStorage.setItem('pf_hasil', JSON.stringify(hasil));

  // Redirect ke halaman hasil
  window.location.href = 'hasil.html';
}

// ── Init ────────────────────────────────────────────────────
updProg();
