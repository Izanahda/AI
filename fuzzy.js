const Fuzzy = {
  fuzzify(n) {
    const r = n<=60 ? Math.max(0,Math.min(1,(60-n)/60)) : 0;
    let s = 0;
    if(n<=50) s=0;
    else if(n<=65) s=(n-50)/15;
    else if(n<=80) s=1;
    else s=Math.max(0,(100-n)/20);
    const t = n<=70 ? 0 : Math.min(1,(n-70)/30);
    const sum = r+s+t||1;
    return {rendah:r/sum,sedang:s/sum,tinggi:t/sum};
  },
  dom(n){ const f=this.fuzzify(n); return Object.entries(f).sort((a,b)=>b[1]-a[1])[0][0]; },
  RULES: {"tinggi,tinggi,tinggi":4,"sedang,tinggi,tinggi":3,"tinggi,tinggi,sedang":3,"sedang,sedang,sedang":2,"rendah,rendah,rendah":1},
  skor(ak,tp,mi) {
    const k=`${this.dom(ak)},${this.dom(tp)},${this.dom(mi)}`;
    let s=this.RULES[k];
    if(s===undefined){
      const fa=this.fuzzify(ak),ft=this.fuzzify(tp),fm=this.fuzzify(mi);
      s=(fa.tinggi*4+fa.sedang*2.5+fa.rendah*1+ft.tinggi*4+ft.sedang*2.5+ft.rendah*1+fm.tinggi*4+fm.sedang*2.5+fm.rendah*1)/3;
    }
    return {skor:Math.round(s*100)/100, pct:Math.round((s/4)*100), combo:[this.dom(ak),this.dom(tp),this.dom(mi)]};
  }
};

function hitungAkademik(mapel,sma){
  const avg=(...k)=>{const v=k.map(x=>parseFloat(mapel[x]||0));return v.reduce((a,b)=>a+b,0)/v.length;};
  return sma==='MIPA'
    ?{Teknologi:avg('Matematika','Fisika'),Kesehatan:avg('Biologi','Kimia'),Bisnis:avg('Matematika'),Komunikasi:avg('Bahasa Inggris'),Sosial:avg('Bahasa Inggris')}
    :{Teknologi:avg('Matematika'),Kesehatan:0,Bisnis:avg('Matematika','Ekonomi'),Komunikasi:avg('Bahasa Inggris','Sosiologi'),Sosial:avg('Sosiologi')};
}

const JURUSAN={
  'Informatika':         {ak:'Teknologi', tpa:'logika', mi:'Teknologi'},
  'Sistem Informasi':    {ak:'Teknologi', tpa:'verbal', mi:'Teknologi'},
  'Kedokteran':          {ak:'Kesehatan', tpa:'logika', mi:'Kesehatan'},
  'Keperawatan':         {ak:'Kesehatan', tpa:'verbal', mi:'Kesehatan'},
  'Gizi':                {ak:'Kesehatan', tpa:'numerik',mi:'Kesehatan'},
  'Akuntansi':           {ak:'Bisnis',    tpa:'numerik',mi:'Bisnis'},
  'Manajemen':           {ak:'Bisnis',    tpa:'verbal', mi:'Bisnis'},
  'Ilmu Komunikasi':     {ak:'Komunikasi',tpa:'verbal', mi:'Komunikasi'},
  'Psikologi':           {ak:'Komunikasi',tpa:'verbal', mi:'Sosial'},
  'Administrasi Publik': {ak:'Komunikasi',tpa:'logika', mi:'Sosial'},
};

const PROSPEK={
  'Informatika':         {p:['Software Engineer','Data Scientist','AI Engineer','DevOps Engineer','Cybersecurity Analyst','Mobile Developer'],a:['Nilai Matematika & Fisika mendukung logika komputasi','TPA logika sesuai dengan pola pikir pemrograman','Minat teknologi menjadi fondasi motivasi belajar']},
  'Sistem Informasi':    {p:['Business Analyst','IT Project Manager','System Analyst','ERP Consultant','Database Admin','IT Consultant'],a:['Kemampuan analisis cocok menjembatani bisnis & teknologi','TPA verbal mendukung komunikasi dalam tim proyek','Minat teknologi berpadu dengan pemahaman bisnis']},
  'Kedokteran':          {p:['Dokter Umum','Dokter Spesialis','Peneliti Medis','Dosen Kedokteran','Medical Advisor'],a:['Nilai Biologi & Kimia sangat kuat untuk dasar ilmu kedokteran','Kemampuan logika mendukung proses diagnosis klinis','Minat kesehatan menjadi motivasi jangka panjang']},
  'Keperawatan':         {p:['Perawat Klinis','Nurse Manager','Perawat ICU','Pendidik Keperawatan','Community Health Nurse'],a:['Nilai sains mendukung pemahaman keperawatan','TPA verbal penting untuk komunikasi dengan pasien','Minat membantu orang lain sangat relevan']},
  'Gizi':                {p:['Ahli Gizi Klinik','Konsultan Nutrisi','Food Scientist','Peneliti Pangan','Dietisien'],a:['Dasar sains mendukung biokimia dan nutrisi','TPA numerik penting untuk kalkulasi kebutuhan gizi','Minat kesehatan memastikan motivasi belajar kuat']},
  'Akuntansi':           {p:['Akuntan Publik','Auditor','Tax Consultant','Financial Analyst','CFO'],a:['Kemampuan matematika kuat untuk analisis keuangan','TPA numerik adalah inti pekerjaan akuntansi','Minat bisnis membuat paham konteks keuangan']},
  'Manajemen':           {p:['Marketing Manager','HR Manager','Business Development','Entrepreneur','Operations Manager'],a:['Kemampuan verbal mendukung kepemimpinan','Minat bisnis sangat relevan','Nilai akademik mendukung pemahaman manajerial']},
  'Ilmu Komunikasi':     {p:['Jurnalis','Public Relations','Content Creator','Brand Strategist','Media Planner'],a:['Kemampuan verbal sangat baik untuk bercerita & persuasi','Minat komunikasi menjadi modal utama','Nilai Bahasa Inggris mendukung komunikasi global']},
  'Psikologi':           {p:['Psikolog Klinis','HRD Specialist','Konselor','Peneliti Perilaku','Life Coach'],a:['Kemampuan empati & komunikasi mendukung interaksi klien','TPA verbal penting memahami narasi & perilaku','Minat sosial menjadi motivasi membantu orang']},
  'Administrasi Publik': {p:['PNS/ASN','Policy Analyst','Konsultan Pemerintah','NGO Manager','Diplomat'],a:['Kemampuan logika mendukung pembuatan kebijakan','Minat sosial & pelayanan masyarakat sangat relevan','Nilai akademik mendukung pemahaman tata kelola']},
};

function hitungSemua(akPerKat,tpaVals,minatVals,sma){
  return Object.entries(JURUSAN).filter(([j,d])=>!(sma==='IPS'&&d.ak==='Kesehatan')).map(([jurusan,d])=>{
    const ak=akPerKat[d.ak]||0, tp=tpaVals[d.tpa]||0, mi=minatVals[d.mi]||0;
    const {skor,pct,combo}=Fuzzy.skor(ak,tp,mi);
    return {jurusan,skor,pct,combo,akVal:ak,tpaVal:tp,minatVal:mi,...PROSPEK[jurusan]};
  }).sort((a,b)=>b.skor-a.skor);
}

function labelSkor(s){
  if(s>=3.5) return {t:'Sangat Cocok ✨',c:'l-sv'};
  if(s>=2.5) return {t:'Cocok ✅',c:'l-co'};
  if(s>=1.5) return {t:'Cukup Cocok',c:'l-ck'};
  return {t:'Kurang Cocok',c:'l-ku'};
}
