/**
 * app.js
 * Controller utama — mengelola alur langkah, render UI, dan memanggil fuzzy.js
 */

// ── State Aplikasi ──────────────────────────────────────────
const STATE = {
  currentStep:   0,
  nama:          "",
  jurusanSMA:    "",
  nilaiMapel:    {},
  minatAnswers:  {},   // { Teknologi: [3,4,2,...], ... }
  minatVals:     {},   // { Teknologi: 80, ... }
  tpaPhase:      0,    // 0=logika, 1=numerik, 2=verbal
  tpaAnswers:    { logika: [], numerik: [], verbal: [] },
  tpaVals:       { logika: 0, numerik: 0, verbal: 0 },
  curKategori:   Object.keys(PERNYATAAN_MINAT)[0],
};

const STEPS = ["step-profil","step-akademik","step-minat","step-tpa","step-hasil"];
const STEP_LABELS = [
  "Data Diri",
  "Nilai Akademik",
  "Kuesioner Minat",
  "Tes TPA",
  "Hasil Rekomendasi"
];
const TPA_PHASES  = ["logika","numerik","verbal"];
const TPA_LABELS  = { logika:"Logika", numerik:"Numerik", verbal:"Verbal" };
const TPA_SOAL    = { logika: SOAL_LOGIKA, numerik: SOAL_NUMERIK, verbal: SOAL_VERBAL };
const OPSI_HURUF  = ["A","B","C","D"];
const SKALA_LABEL = ["","Sangat\nTidak\nSetuju","Tidak\nSetuju","Setuju","Sangat\nSetuju"];

// ── Progress Bar ────────────────────────────────────────────
function updateProgress(step) {
  const pct = Math.round(((step + 1) / STEPS.length) * 100);
  document.getElementById("progressFill").style.width = pct + "%";
  document.getElementById("progressCount").textContent = pct + "%";
  document.getElementById("progressLabel").textContent =
    `Langkah ${step + 1} dari ${STEPS.length} — ${STEP_LABELS[step]}`;

  const dots = document.querySelectorAll(".step-dot");
  dots.forEach((d, i) => {
    d.classList.remove("done","active");
    if (i < step)  d.classList.add("done");
    if (i === step) d.classList.add("active");
  });
}

// ── Navigasi Step ───────────────────────────────────────────
function showStep(n) {
  STEPS.forEach((id, i) => {
    document.getElementById(id).classList.toggle("active", i === n);
  });
  STATE.currentStep = n;
  updateProgress(n);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function nextStep() {
  const s = STATE.currentStep;
  if (s === 0 && !validateProfil())    return;
  if (s === 1 && !validateAkademik())  return;
  if (s === 2 && !validateMinat())     return;
  if (s === 3) return; // handled by tpaNext()

  if (s === 1) renderMinat();
  if (s === 2) {
    STATE.minatVals = hitungNilaiMinat(STATE.minatAnswers);
    STATE.tpaPhase  = 0;
    renderTPA();
  }

  showStep(s + 1);
}

function prevStep() {
  if (STATE.currentStep > 0) showStep(STATE.currentStep - 1);
}

// ── STEP 0: Profil ──────────────────────────────────────────
function pilihJurusanSMA(val) {
  STATE.jurusanSMA = val;
  document.getElementById("card-mipa").classList.toggle("selected", val === "MIPA");
  document.getElementById("card-ips").classList.toggle("selected",  val === "IPS");
}

function validateProfil() {
  STATE.nama = document.getElementById("inputNama").value.trim() || "Peserta";
  if (!STATE.jurusanSMA) {
    alert("Pilih jurusan SMA terlebih dahulu.");
    return false;
  }
  renderAkademik();
  return true;
}

// ── STEP 1: Akademik ────────────────────────────────────────
function renderAkademik() {
  const mapelList = STATE.jurusanSMA === "MIPA" ? MAPEL_MIPA : MAPEL_IPS;
  const grid = document.getElementById("mapelGrid");
  grid.innerHTML = mapelList.map(m => `
    <div class="mapel-item">
      <label for="mapel_${esc(m)}">${m}</label>
      <input class="form-input" type="number" id="mapel_${esc(m)}"
        min="0" max="100" placeholder="0 – 100"
        value="${STATE.nilaiMapel[m] !== undefined ? STATE.nilaiMapel[m] : ''}" />
    </div>
  `).join("");
}

function validateAkademik() {
  const mapelList = STATE.jurusanSMA === "MIPA" ? MAPEL_MIPA : MAPEL_IPS;
  for (const m of mapelList) {
    const el  = document.getElementById("mapel_" + esc(m));
    const val = parseFloat(el.value);
    if (isNaN(val) || val < 0 || val > 100) {
      alert(`Nilai ${m} harus berupa angka antara 0 – 100.`);
      el.focus();
      return false;
    }
    STATE.nilaiMapel[m] = val;
  }
  return true;
}

// ── STEP 2: Minat ───────────────────────────────────────────
function renderMinat() {
  const kategoriList = Object.keys(PERNYATAAN_MINAT);

  // Inisialisasi jawaban jika belum ada
  for (const kat of kategoriList) {
    if (!STATE.minatAnswers[kat]) {
      STATE.minatAnswers[kat] = Array(PERNYATAAN_MINAT[kat].length).fill(0);
    }
  }

  // Tabs
  const tabsEl = document.getElementById("minatTabs");
  tabsEl.innerHTML = kategoriList.map(kat => `
    <div class="minat-tab ${kat === STATE.curKategori ? 'active' : ''}"
         onclick="switchMinatKategori('${kat}')">${kat}</div>
  `).join("");

  renderPernyataan();
}

function switchMinatKategori(kat) {
  STATE.curKategori = kat;
  document.querySelectorAll(".minat-tab").forEach(t =>
    t.classList.toggle("active", t.textContent === kat)
  );
  renderPernyataan();
}

function renderPernyataan() {
  const kat     = STATE.curKategori;
  const perny   = PERNYATAAN_MINAT[kat];
  const answers = STATE.minatAnswers[kat] || Array(perny.length).fill(0);
  const skala   = ["","STS","TS","S","SS"];
  const skalaFull = ["","Sangat Tidak Setuju","Tidak Setuju","Setuju","Sangat Setuju"];

  document.getElementById("pernyataanList").innerHTML = perny.map((p, i) => `
    <div class="pernyataan-item">
      <div class="pernyataan-text">${i + 1}. ${p}</div>
      <div class="likert-row">
        ${[1,2,3,4].map(v => `
          <div class="likert-btn ${answers[i] === v ? 'selected' : ''}"
               onclick="setMinatAnswer('${kat}',${i},${v})"
               title="${skalaFull[v]}">
            <span class="num">${v}</span>
            <span class="lbl">${skala[v]}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("");
}

function setMinatAnswer(kat, i, v) {
  if (!STATE.minatAnswers[kat]) STATE.minatAnswers[kat] = [];
  STATE.minatAnswers[kat][i] = v;
  renderPernyataan();
}

function validateMinat() {
  for (const [kat, perny] of Object.entries(PERNYATAAN_MINAT)) {
    const ans = STATE.minatAnswers[kat] || [];
    const missing = perny.map((_, i) => i).filter(i => !ans[i]);
    if (missing.length > 0) {
      alert(`Harap jawab semua pernyataan pada minat "${kat}" (nomor ${missing.map(x => x+1).join(", ")}).`);
      switchMinatKategori(kat);
      return false;
    }
  }
  return true;
}

// ── STEP 3: TPA ─────────────────────────────────────────────
function renderTPA() {
  const phase    = TPA_PHASES[STATE.tpaPhase];
  const soalList = TPA_SOAL[phase];
  const answers  = STATE.tpaAnswers[phase];
  const isLast   = STATE.tpaPhase === TPA_PHASES.length - 1;

  document.getElementById("btnTpaPrev").style.display =
    STATE.tpaPhase === 0 ? "none" : "";
  document.getElementById("btnTpaNext").innerHTML =
    isLast
      ? `Lihat Hasil <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8h10M9 4l4 4-4 4"/></svg>`
      : `Lanjut <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8h10M9 4l4 4-4 4"/></svg>`;

  const benar = soalList.filter((_, i) =>
    answers[i] !== undefined && answers[i] === soalList[i].jawaban
  ).length;

  document.getElementById("tpaCard").innerHTML = `
    <div class="tpa-header">
      <div class="tpa-phase-badge">📝 TPA ${TPA_LABELS[phase]}</div>
      <div class="tpa-score-chip">${soalList.length} soal</div>
    </div>
    ${soalList.map((s, i) => {
      const chosen   = answers[i];
      const answered = chosen !== undefined;
      return `
        <div class="soal-item">
          <div class="soal-number">Soal ${i + 1}</div>
          <div class="soal-text">${s.soal}</div>
          <div class="opsi-list">
            ${s.opsi.map((o, j) => {
              let cls = "opsi-btn";
              if (answered) {
                cls += " answered";
                if (j === s.jawaban)              cls += " show-correct";
                else if (j === chosen)            cls += " wrong";
              }
              return `
                <button class="${cls}"
                        onclick="pilihOpsiTPA('${phase}',${i},${j},${s.jawaban})">
                  <span class="opsi-letter">${OPSI_HURUF[j]}</span>
                  ${o}
                </button>`;
            }).join("")}
          </div>
          ${answered
            ? `<div class="feedback-text ${chosen === s.jawaban ? 'feedback-benar' : 'feedback-salah'}">
                 ${chosen === s.jawaban ? "✅ Benar!" : `❌ Salah — Jawaban: ${OPSI_HURUF[s.jawaban]}`}
               </div>`
            : ""}
        </div>`;
    }).join("")}
  `;
}

function pilihOpsiTPA(phase, i, j, jawaban) {
  if (STATE.tpaAnswers[phase][i] !== undefined) return; // sudah dijawab
  STATE.tpaAnswers[phase][i] = j;
  renderTPA();
}

function tpaPrev() {
  if (STATE.tpaPhase > 0) {
    STATE.tpaPhase--;
    renderTPA();
  } else {
    showStep(2);
  }
}

function tpaNext() {
  const phase    = TPA_PHASES[STATE.tpaPhase];
  const soalList = TPA_SOAL[phase];
  const answers  = STATE.tpaAnswers[phase];

  // Cek semua soal sudah dijawab
  const missing = soalList.map((_, i) => i + 1).filter(i => answers[i - 1] === undefined);
  if (missing.length) {
    alert(`Harap jawab soal nomor: ${missing.join(", ")}`);
    return;
  }

  // Hitung skor
  const benar = soalList.filter((s, i) => answers[i] === s.jawaban).length;
  STATE.tpaVals[phase] = (benar / soalList.length) * 100;

  if (STATE.tpaPhase < TPA_PHASES.length - 1) {
    STATE.tpaPhase++;
    renderTPA();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    renderHasil();
    showStep(4);
  }
}

// ── STEP 4: Hasil ───────────────────────────────────────────
function renderHasil() {
  const sorted = hitungSemuaJurusan(
    STATE.nilaiMapel,
    STATE.jurusanSMA,
    STATE.tpaVals,
    STATE.minatVals
  );
  const top3   = sorted.slice(0, 3);
  const medals = ["🥇","🥈","🥉"];
  const rankLabel = ["Rekomendasi Utama","Rekomendasi Kedua","Rekomendasi Ketiga"];

  const el = document.getElementById("hasilContent");

  el.innerHTML = `
    <div class="hasil-header">
      <img src="images/logo.png" alt="UNS" style="width:44px;margin:0 auto 10px;display:block;opacity:.9" />
      <h2>Hasil Rekomendasimu</h2>
      <p>Halo, <strong>${STATE.nama}</strong>! Berikut jurusan yang paling cocok untukmu berdasarkan analisis Fuzzy Logic.</p>
    </div>

    ${top3.map((d, i) => {
      const lbl = labelSkor(d.skor);
      return `
        <div class="rank-card rank-${i+1}">
          <div class="rank-top">
            <div class="rank-info">
              <div class="rank-eyebrow">${rankLabel[i]}</div>
              <div class="rank-jurusan">
                <span class="icon-jur">${ICON_JURUSAN[d.jurusan] || "🎓"}</span>
                ${d.jurusan}
              </div>
              <span class="kesesuaian-label ${lbl.cls}">${lbl.text}</span>
            </div>
            <div class="rank-medal">${medals[i]}</div>
          </div>

          <div class="skor-bar-wrap">
            <div class="skor-bar-track">
              <div class="skor-bar-fill" data-pct="${d.persentase}"></div>
            </div>
            <div class="skor-pct">${d.persentase}%</div>
          </div>

          <div class="stat-row">
            <span class="stat-pill">🎓 Akademik: ${d.akVal}</span>
            <span class="stat-pill">📝 TPA: ${d.tpaVal}</span>
            <span class="stat-pill">💡 Minat: ${d.minatVal}</span>
            <span class="stat-pill">Skor: ${d.skor.toFixed(2)} / 4.00</span>
          </div>

          <div class="prospek-box">
            <strong>Prospek Kerja</strong>
            ${PROSPEK_KERJA[d.jurusan] || "—"}
          </div>
        </div>`;
    }).join("")}

    <div class="all-jurusan">
      <div class="all-jurusan-title">Semua Jurusan (Urutan Terbaik)</div>
      ${sorted.map((d, i) => `
        <div class="all-row">
          <div class="all-rank">${i + 1}</div>
          <div class="all-nama">${ICON_JURUSAN[d.jurusan] || "🎓"} ${d.jurusan}</div>
          <div class="all-bar-track">
            <div class="all-bar-fill" data-pct="${d.persentase}"></div>
          </div>
          <div class="all-pct">${d.persentase}%</div>
        </div>
      `).join("")}
    </div>
  `;

  // Animasikan bar setelah render
  requestAnimationFrame(() => {
    setTimeout(() => {
      document.querySelectorAll(".skor-bar-fill, .all-bar-fill").forEach(b => {
        b.style.width = b.dataset.pct + "%";
      });
    }, 100);
  });
}

// ── Ulang ───────────────────────────────────────────────────
function mulaiUlang() {
  if (!confirm("Mulai ulang dari awal? Semua jawaban akan dihapus.")) return;
  Object.assign(STATE, {
    currentStep:  0,
    nama:         "",
    jurusanSMA:   "",
    nilaiMapel:   {},
    minatAnswers: {},
    minatVals:    {},
    tpaPhase:     0,
    tpaAnswers:   { logika: [], numerik: [], verbal: [] },
    tpaVals:      { logika: 0, numerik: 0, verbal: 0 },
    curKategori:  Object.keys(PERNYATAAN_MINAT)[0],
  });
  document.getElementById("inputNama").value = "";
  document.getElementById("card-mipa").classList.remove("selected");
  document.getElementById("card-ips").classList.remove("selected");
  showStep(0);
}

// ── Init ────────────────────────────────────────────────────
updateProgress(0);