import os
import time

# =============================================
#   HELPER FUNCTIONS
# =============================================

def clear():
    os.system('cls' if os.name == 'nt' else 'clear')

def garis(char="=", n=55):
    print(char * n)

def judul(teks):
    garis()
    print(f"  {teks}")
    garis()

def input_valid(prompt, min_val, max_val):
    while True:
        try:
            nilai = float(input(prompt))
            if min_val <= nilai <= max_val:
                return nilai
            else:
                print(f"  ⚠  Masukkan angka antara {min_val} dan {max_val}.")
        except ValueError:
            print("  ⚠  Input tidak valid. Masukkan angka.")

def input_pilihan(prompt, opsi):
    while True:
        val = input(prompt).strip().upper()
        if val in opsi:
            return val
        print(f"  ⚠  Pilih salah satu: {'/'.join(opsi)}")

# =============================================
#   FUZZY MEMBERSHIP
# =============================================

def fuzzify(nilai):
    """
    Menentukan derajat keanggotaan Rendah, Sedang, Tinggi
    berdasarkan range yang ditetapkan:
      Rendah  : 0-60
      Sedang  : 50-80
      Tinggi  : 70-100
    """
    rendah = max(0.0, min(1.0, (60 - nilai) / 60)) if nilai <= 60 else 0.0
    if nilai <= 50:
        sedang = 0.0
    elif nilai <= 65:
        sedang = (nilai - 50) / 15
    elif nilai <= 80:
        sedang = 1.0
    else:
        sedang = max(0.0, (100 - nilai) / 20)

    tinggi = 0.0 if nilai <= 70 else min(1.0, (nilai - 70) / 30)

    total = rendah + sedang + tinggi
    if total == 0:
        return {"rendah": 0, "sedang": 0, "tinggi": 1}
    return {
        "rendah": rendah / total,
        "sedang": sedang / total,
        "tinggi": tinggi / total,
    }

def kategori_dominan(nilai):
    f = fuzzify(nilai)
    return max(f, key=f.get)

# =============================================
#   RULES ENGINE
# =============================================

RULES = {
    # format: (akademik, tpa, minat) -> skor
    ("tinggi", "tinggi", "tinggi"): 4,   # Sangat cocok
    ("sedang", "tinggi", "tinggi"): 3,   # Cocok
    ("tinggi", "tinggi", "sedang"): 3,   # Cocok
    ("sedang", "sedang", "sedang"): 2,   # Cukup cocok
    ("rendah", "rendah", "rendah"): 1,   # Kurang cocok
}

def hitung_skor_jurusan(akademik_val, tpa_val, minat_val):
    ak = kategori_dominan(akademik_val)
    tp = kategori_dominan(tpa_val)
    mi = kategori_dominan(minat_val)
    key = (ak, tp, mi)
    skor = RULES.get(key, None)
    if skor is None:
        # Jika kombinasi tidak ada di rule, hitung rata-rata fuzzy
        f_ak = fuzzify(akademik_val)
        f_tp = fuzzify(tpa_val)
        f_mi = fuzzify(minat_val)
        skor = (
            f_ak["tinggi"] * 4 + f_ak["sedang"] * 2.5 + f_ak["rendah"] * 1 +
            f_tp["tinggi"] * 4 + f_tp["sedang"] * 2.5 + f_tp["rendah"] * 1 +
            f_mi["tinggi"] * 4 + f_mi["sedang"] * 2.5 + f_mi["rendah"] * 1
        ) / 3
    return round(skor, 2), (ak, tp, mi)

LABEL_SKOR = {4: "Sangat Cocok", 3: "Cocok", 2: "Cukup Cocok", 1: "Kurang Cocok"}

def label_skor(skor):
    if skor >= 3.5:
        return "Sangat Cocok ✨"
    elif skor >= 2.5:
        return "Cocok ✅"
    elif skor >= 1.5:
        return "Cukup Cocok 🔹"
    else:
        return "Kurang Cocok ❌"

# =============================================
#   SOAL TPA
# =============================================

SOAL_LOGIKA = [
    {
        "soal": "Semua siswa rajin. Budi adalah siswa. Kesimpulan yang tepat adalah...",
        "opsi": ["A. Budi tidak rajin", "B. Budi rajin", "C. Budi mungkin rajin", "D. Tidak bisa disimpulkan"],
        "jawaban": "B"
    },
    {
        "soal": "Jika hari hujan maka jalanan basah. Jalanan basah. Maka...",
        "opsi": ["A. Pasti hari hujan", "B. Belum tentu hari hujan", "C. Hari tidak hujan", "D. Jalanan kering"],
        "jawaban": "B"
    },
    {
        "soal": "Deret: 2, 4, 8, 16, ... Bilangan selanjutnya adalah...",
        "opsi": ["A. 24", "B. 30", "C. 32", "D. 28"],
        "jawaban": "C"
    },
    {
        "soal": "Semua A adalah B. Semua B adalah C. Maka...",
        "opsi": ["A. Semua C adalah A", "B. Sebagian A adalah C", "C. Semua A adalah C", "D. Tidak ada A adalah C"],
        "jawaban": "C"
    },
    {
        "soal": "Deret: 3, 6, 11, 18, 27, ... Bilangan selanjutnya adalah...",
        "opsi": ["A. 36", "B. 38", "C. 40", "D. 38"],
        "jawaban": "B"
    },
]

SOAL_NUMERIK = [
    {
        "soal": "Hasil dari 15% × 200 adalah...",
        "opsi": ["A. 25", "B. 30", "C. 35", "D. 40"],
        "jawaban": "B"
    },
    {
        "soal": "Jika x + 5 = 12, maka nilai x adalah...",
        "opsi": ["A. 5", "B. 6", "C. 7", "D. 8"],
        "jawaban": "C"
    },
    {
        "soal": "Rata-rata dari 10, 20, 30, 40, 50 adalah...",
        "opsi": ["A. 25", "B. 30", "C. 35", "D. 40"],
        "jawaban": "B"
    },
    {
        "soal": "Sebuah persegi panjang memiliki panjang 8 dan lebar 5. Luasnya adalah...",
        "opsi": ["A. 13", "B. 26", "C. 40", "D. 45"],
        "jawaban": "C"
    },
    {
        "soal": "Jika 3x = 21, maka x² adalah...",
        "opsi": ["A. 7", "B. 14", "C. 49", "D. 21"],
        "jawaban": "C"
    },
]

SOAL_VERBAL = [
    {
        "soal": "Antonim dari kata 'OPTIMIS' adalah...",
        "opsi": ["A. Semangat", "B. Pesimis", "C. Realistis", "D. Dinamis"],
        "jawaban": "B"
    },
    {
        "soal": "Sinonim dari kata 'ABADI' adalah...",
        "opsi": ["A. Sementara", "B. Singkat", "C. Kekal", "D. Hilang"],
        "jawaban": "C"
    },
    {
        "soal": "Dokter : Rumah Sakit = Guru : ...",
        "opsi": ["A. Buku", "B. Sekolah", "C. Murid", "D. Papan tulis"],
        "jawaban": "B"
    },
    {
        "soal": "Kata yang tidak berhubungan dengan yang lain: Mawar, Melati, Anggrek, Mangga",
        "opsi": ["A. Mawar", "B. Melati", "C. Anggrek", "D. Mangga"],
        "jawaban": "D"
    },
    {
        "soal": "Kalimat yang menggunakan ejaan paling tepat adalah...",
        "opsi": [
            "A. Kami pergi ke-sekolah hari ini.",
            "B. Kami pergi kesekolah hari ini.",
            "C. Kami pergi ke sekolah hari ini.",
            "D. Kami pergi Ke Sekolah hari ini."
        ],
        "jawaban": "C"
    },
]

def kerjakan_tpa(nama_tpa, soal_list):
    judul(f"TES TPA — {nama_tpa.upper()}")
    print(f"  Kerjakan {len(soal_list)} soal berikut.")
    print(f"  Jawab dengan mengetik huruf pilihan (A/B/C/D).\n")
    benar = 0
    for i, item in enumerate(soal_list, 1):
        print(f"  Soal {i}: {item['soal']}")
        for opsi in item["opsi"]:
            print(f"    {opsi}")
        jawab = input_pilihan("  Jawaban kamu: ", ["A", "B", "C", "D"])
        if jawab == item["jawaban"]:
            benar += 1
            print("  ✅ Benar!\n")
        else:
            print(f"  ❌ Salah. Jawaban yang benar: {item['jawaban']}\n")
    nilai = (benar / len(soal_list)) * 100
    print(f"  Skor {nama_tpa}: {benar}/{len(soal_list)} benar → Nilai: {nilai:.0f}")
    garis("-")
    input("  Tekan Enter untuk melanjutkan...")
    return nilai

# =============================================
#   SOAL MINAT
# =============================================

PERNYATAAN_MINAT = {
    "Teknologi": [
        "Saya tertarik mempelajari cara kerja komputer dan perangkat digital.",
        "Saya tertarik mencoba aplikasi atau teknologi baru.",
        "Saya tertarik belajar pemrograman atau pengembangan aplikasi.",
        "Saya suka memecahkan masalah yang membutuhkan logika dan analisis.",
        "Saya tertarik dengan perkembangan AI dan teknologi masa depan.",
    ],
    "Kesehatan": [
        "Saya tertarik mempelajari tubuh manusia dan cara kerjanya.",
        "Saya senang membantu orang yang sedang sakit atau membutuhkan bantuan kesehatan.",
        "Saya tertarik mempelajari obat-obatan dan dunia medis.",
        "Saya tertarik dengan materi biologi dan kesehatan.",
        "Saya ingin berkontribusi dalam meningkatkan kualitas kesehatan masyarakat.",
    ],
    "Bisnis": [
        "Saya tertarik mempelajari cara mengelola keuangan.",
        "Saya tertarik membangun atau mengembangkan usaha sendiri.",
        "Saya senang membuat perencanaan untuk mencapai keuntungan.",
        "Saya tertarik mempelajari pemasaran dan strategi bisnis.",
        "Saya senang menganalisis peluang dan risiko dalam suatu kegiatan usaha.",
    ],
    "Komunikasi": [
        "Saya senang berbicara dan menyampaikan ide kepada orang lain.",
        "Saya mudah beradaptasi ketika berinteraksi dengan orang baru.",
        "Saya tertarik membuat presentasi atau berbicara di depan umum.",
        "Saya senang menulis, membuat konten, atau menyampaikan informasi.",
        "Saya tertarik mempelajari media, komunikasi, dan hubungan masyarakat.",
    ],
    "Sosial": [
        "Saya tertarik memahami perilaku dan karakter manusia.",
        "Saya senang membantu menyelesaikan masalah yang dihadapi orang lain.",
        "Saya tertarik mempelajari fenomena sosial yang terjadi di masyarakat.",
        "Saya senang bekerja dalam kelompok dan berinteraksi dengan banyak orang.",
        "Saya tertarik melakukan kegiatan yang berkaitan dengan pelayanan masyarakat.",
    ],
}

SKALA_MINAT = {
    "1": "Sangat Tidak Setuju",
    "2": "Tidak Setuju",
    "3": "Setuju",
    "4": "Sangat Setuju",
}

def kerjakan_minat():
    judul("KUISIONER MINAT")
    print("  Jawab setiap pernyataan dengan skala:")
    print("  1 = Sangat Tidak Setuju  |  2 = Tidak Setuju")
    print("  3 = Setuju               |  4 = Sangat Setuju\n")
    hasil_minat = {}
    for kategori, pernyataan_list in PERNYATAAN_MINAT.items():
        garis("-")
        print(f"\n  [ Minat {kategori} ]\n")
        total = 0
        for i, p in enumerate(pernyataan_list, 1):
            print(f"  {i}. {p}")
            while True:
                val = input("     Jawaban (1-4): ").strip()
                if val in ["1", "2", "3", "4"]:
                    total += int(val)
                    break
                print("     ⚠  Masukkan angka 1, 2, 3, atau 4.")
            print()
        # Konversi skor total (5-20) ke nilai 0-100
        nilai = ((total - 5) / 15) * 100
        hasil_minat[kategori] = round(nilai, 2)
        print(f"  Skor Minat {kategori}: {total}/20 → Nilai: {hasil_minat[kategori]:.1f}")
        input("  Tekan Enter untuk lanjut...\n")
    return hasil_minat

# =============================================
#   INPUT NILAI AKADEMIK
# =============================================

MAPEL_MIPA = ["Matematika", "Biologi", "Kimia", "Fisika", "Bahasa Inggris"]
MAPEL_IPS  = ["Matematika", "Sosiologi", "Ekonomi", "Bahasa Inggris"]

def input_akademik(jurusan_sma):
    judul("INPUT NILAI AKADEMIK")
    mapel_list = MAPEL_MIPA if jurusan_sma == "MIPA" else MAPEL_IPS
    print(f"  Masukkan nilai rapor untuk setiap mata pelajaran (0–100).\n")
    nilai_mapel = {}
    for mapel in mapel_list:
        nilai = input_valid(f"  Nilai {mapel}: ", 0, 100)
        nilai_mapel[mapel] = nilai
        print()
    return nilai_mapel

def hitung_akademik(nilai_mapel, jurusan_sma):
    """
    Hitung nilai akademik per kategori berdasarkan jurusan SMA.
    Sesuai dokumen:
      Akademik Teknologi  : MIPA→Matematika, Fisika  | IPS→Matematika
      Akademik Kesehatan  : MIPA→Biologi, Kimia       | IPS→(tidak ada)
      Akademik Bisnis     : MIPA→Matematika           | IPS→Matematika, Ekonomi
      Akademik Komunikasi : MIPA→Bahasa Inggris       | IPS→Bahasa Inggris, Sosiologi
    """
    def avg(*keys):
        vals = [nilai_mapel[k] for k in keys if k in nilai_mapel]
        return sum(vals) / len(vals) if vals else 0

    if jurusan_sma == "MIPA":
        return {
            "Teknologi" : avg("Matematika", "Fisika"),
            "Kesehatan" : avg("Biologi", "Kimia"),
            "Bisnis"    : avg("Matematika"),
            "Komunikasi": avg("Bahasa Inggris"),
        }
    else:  # IPS
        return {
            "Teknologi" : avg("Matematika"),
            "Kesehatan" : 0,  # IPS tidak ada mapel kesehatan
            "Bisnis"    : avg("Matematika", "Ekonomi"),
            "Komunikasi": avg("Bahasa Inggris", "Sosiologi"),
        }

# =============================================
#   PERHITUNGAN AKHIR
# =============================================

# Definisi jurusan: (kategori akademik, kategori tpa, kategori minat)
JURUSAN_DEF = {
    "Informatika"       : ("Teknologi",  "logika",   "Teknologi"),
    "Sistem Informasi"  : ("Teknologi",  "verbal",   "Teknologi"),
    "Kedokteran"        : ("Kesehatan",  "logika",   "Kesehatan"),
    "Keperawatan"       : ("Kesehatan",  "verbal",   "Kesehatan"),
    "Gizi"              : ("Kesehatan",  "numerik",  "Kesehatan"),
    "Akuntansi"         : ("Bisnis",     "numerik",  "Bisnis"),
    "Manajemen"         : ("Bisnis",     "verbal",   "Bisnis"),
    "Ilmu Komunikasi"   : ("Komunikasi", "verbal",   "Komunikasi"),
    "Psikologi"         : ("Komunikasi", "verbal",   "Sosial"),
    "Administrasi Publik": ("Komunikasi","logika",   "Sosial"),
}

def hitung_semua(akademik_per_kat, tpa_vals, minat_vals, jurusan_sma):
    hasil = {}
    for jurusan, (kat_ak, kat_tpa, kat_minat) in JURUSAN_DEF.items():
        ak_val = akademik_per_kat.get(kat_ak, 0)
        # Skip jurusan kesehatan untuk IPS (tidak ada data akademik)
        if jurusan_sma == "IPS" and kat_ak == "Kesehatan":
            continue
        tpa_val   = tpa_vals.get(kat_tpa, 0)
        minat_val = minat_vals.get(kat_minat, 0)
        skor, combo = hitung_skor_jurusan(ak_val, tpa_val, minat_val)
        hasil[jurusan] = {
            "skor"    : skor,
            "label"   : label_skor(skor),
            "ak_val"  : ak_val,
            "tpa_val" : tpa_val,
            "minat_val": minat_val,
            "combo"   : combo,
        }
    return hasil

def tampilkan_hasil(nama, hasil_dict):
    clear()
    judul("HASIL REKOMENDASI JURUSAN")
    print(f"  Halo, {nama}! Berikut adalah top 3 jurusan yang paling cocok untukmu:\n")

    sorted_hasil = sorted(hasil_dict.items(), key=lambda x: x[1]["skor"], reverse=True)
    top3 = sorted_hasil[:3]

    medals = ["🥇", "🥈", "🥉"]
    for i, (jurusan, data) in enumerate(top3):
        garis("-")
        print(f"\n  {medals[i]}  {jurusan}")
        print(f"      Status  : {data['label']}")
        print(f"      Skor    : {data['skor']:.2f} / 4.00")
        print(f"      Akademik: {data['ak_val']:.1f}  |  "
              f"TPA: {data['tpa_val']:.1f}  |  "
              f"Minat: {data['minat_val']:.1f}")
        ak_k, tpa_k, mi_k = data["combo"]
        print(f"      Kategori: Akademik={ak_k.capitalize()}, "
              f"TPA={tpa_k.capitalize()}, Minat={mi_k.capitalize()}\n")

    garis()
    print("\n  Semua hasil (urutan terbaik):\n")
    for jurusan, data in sorted_hasil:
        bar = "█" * int(data["skor"] / 4 * 20)
        print(f"  {jurusan:<22} {bar:<20} {data['skor']:.2f}  {data['label']}")
    garis()
    print()

# =============================================
#   MAIN PROGRAM
# =============================================

def main():
    clear()
    judul("SISTEM REKOMENDASI JURUSAN KULIAH")
    print("  Selamat datang! Sistem ini akan membantu kamu menemukan")
    print("  jurusan kuliah yang paling sesuai dengan kemampuan")
    print("  dan minatmu.\n")
    print("  Tahapan:")
    print("  1. Input data diri & jurusan SMA")
    print("  2. Input nilai akademik")
    print("  3. Kuesioner minat")
    print("  4. Tes TPA (Logika, Numerik, Verbal)")
    print("  5. Hasil rekomendasi\n")
    garis()
    nama = input("  Nama kamu: ").strip() or "Peserta"
    print()
    jurusan_sma = input_pilihan(
        "  Jurusan SMA (MIPA/IPS): ", ["MIPA", "IPS"]
    )

    # --- TAHAP 1: Nilai Akademik ---
    clear()
    nilai_mapel = input_akademik(jurusan_sma)
    akademik_per_kat = hitung_akademik(nilai_mapel, jurusan_sma)

    # --- TAHAP 2: Minat ---
    clear()
    minat_vals = kerjakan_minat()

    # --- TAHAP 3: TPA ---
    clear()
    tpa_logika  = kerjakan_tpa("Logika",  SOAL_LOGIKA)
    clear()
    tpa_numerik = kerjakan_tpa("Numerik", SOAL_NUMERIK)
    clear()
    tpa_verbal  = kerjakan_tpa("Verbal",  SOAL_VERBAL)

    tpa_vals = {
        "logika" : tpa_logika,
        "numerik": tpa_numerik,
        "verbal" : tpa_verbal,
    }

    # --- Hitung & Tampilkan ---
    hasil = hitung_semua(akademik_per_kat, tpa_vals, minat_vals, jurusan_sma)
    tampilkan_hasil(nama, hasil)

    print("  Terima kasih telah menggunakan sistem ini! Semangat ya~ 🎓\n")

if __name__ == "__main__":
    main()