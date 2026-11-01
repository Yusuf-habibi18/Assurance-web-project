# Website Konsultan Asuransi – [Nama Usaha]

Website profil untuk konsultan asuransi. Isinya memperkenalkan konsultan, menjelaskan jenis perlindungan, memberi edukasi dasar, dan mengarahkan calon nasabah untuk berkonsultasi lewat WhatsApp.

Website ini **statis**: HTML, CSS, dan JavaScript biasa. Tidak ada server, database, framework, atau proses build. Cukup buka file-nya di browser, atau unggah foldernya ke hosting statis gratis.

## Daftar isi

1. [Status proyek](#1-status-proyek)
2. [Menjalankan di komputer](#2-menjalankan-di-komputer)
3. [Struktur folder](#3-struktur-folder)
4. [Cara kerja fitur utama](#4-cara-kerja-fitur-utama)
5. [Panduan mengubah konten](#5-panduan-mengubah-konten)
6. [Deployment](#6-deployment)
7. [Checklist sebelum serah terima](#7-checklist-sebelum-serah-terima)
8. [Ketentuan konten asuransi](#8-ketentuan-konten-asuransi)
9. [Teknologi dan lisensi](#9-teknologi-dan-lisensi)

---

## 1. Status proyek

Per 1 November 2026:

| Bagian | Status |
|---|---|
| 9 halaman utama: Beranda, Tentang Saya, Solusi, Kalkulator Protection Gap, Edukasi, Tanya Jawab, Kontak, Konsultasi Gratis, Kebijakan Privasi | Selesai dibuat, isi masih placeholder |
| Halaman artikel `edukasi/artikel-1.html` sampai `artikel-3.html` | **Belum dibuat.** File masih kosong, jadi tautannya menampilkan halaman putih. |
| `robots.txt` dan `sitemap.xml` | **Kosong.** Diisi setelah domain ada (contoh isinya di [bagian 6](#6-deployment)). |
| `docs/checklist-qa.md` | Terisi: checklist dan hasil pengujian per 31 Oktober 2026 |
| `docs/konten-dari-klien.md` | Kosong |
| Konten asli dari klien (nama, foto, kontak, profil) | Belum ada. Semua ditandai `[...]`. |

**Sudah diuji:**
- Validasi formulir: 15 kasus uji lolos (nomor valid dan tidak valid, field wajib, batas panjang pesan).
- Tampilan kedelapan halaman di desktop (1366 px) dan mobile (390 px), lewat screenshot.
- Struktur HTML dengan `docs/qa-check.js`: 198 tautan internal, id, atribut ARIA, judul, dan deskripsi halaman. Satu-satunya masalah: tautan ke 3 halaman artikel yang masih kosong.
- Kalkulator protection gap (1 November 2026, Edge headless): angka contoh klien (pengeluaran 5 juta, perlindungan 100 juta, 11 tahun) menghasilkan kebutuhan Rp 660.000.000 dan kesenjangan Rp 560.000.000, sama dengan contoh. Juga dicek: rincian tambahan, bagian hasil yang tersembunyi saat isiannya kosong, format ribuan, dan isi pesan WhatsApp. Tampilan dicek di 390 px dan 1366 px. Setelah halaman ini ditambahkan, `qa-check.js` memeriksa 240 tautan dan hanya menemukan masalah lama yang sama.
- Penempatan foto asli di kotak placeholder, lewat halaman uji dengan foto contoh.

**Belum diuji:** animasi dan klik di browser sungguhan, tampilan di HP asli, Firefox dan Safari, alur formulir ke WhatsApp dengan nomor klien, dan skor Lighthouse.

Rincian 62 item uji beserta hasilnya ada di `docs/checklist-qa.md`.

---

## 2. Menjalankan di komputer

Yang dibutuhkan: browser modern (Chrome, Edge, Firefox, atau Safari) dan koneksi internet, karena font dimuat dari Google Fonts.

**Cara cepat:** klik dua kali `index.html`.

**Cara yang disarankan saat mengedit** (halaman otomatis refresh setiap file disimpan):

1. Install [VS Code](https://code.visualstudio.com/).
2. Install ekstensi **Live Server** (pembuat: Ritwick Dey).
3. Buka folder proyek di VS Code, klik kanan `index.html`, lalu pilih **Open with Live Server**.

---

## 3. Struktur folder

```
Web Assurance/
├── index.html               Beranda
├── tentang.html             Tentang Saya
├── solusi.html              Solusi Perlindungan
├── kalkulator.html          Kalkulator Protection Gap (jiwa + penyakit kritis)
├── konsultasi.html          Konsultasi Gratis (formulir → WhatsApp)
├── faq.html                 Tanya Jawab
├── kontak.html              Hubungi Kami (kanal kontak + formulir)
├── kebijakan-privasi.html   Kebijakan Privasi
├── edukasi/
│   ├── index.html           Daftar artikel
│   └── artikel-1..3.html    Halaman artikel (belum dibuat)
├── assets/
│   ├── css/
│   │   ├── base.css         Warna, font, dan ukuran dasar (ganti brand di sini)
│   │   ├── components.css   Komponen bersama: tombol, header, kartu, formulir, footer, animasi
│   │   └── pages.css        Gaya khusus tiap halaman
│   ├── js/
│   │   ├── main.js          Nomor WhatsApp, menu HP, header, animasi scroll
│   │   ├── form.js          Validasi formulir dan penyusunan pesan WhatsApp
│   │   ├── kalkulator.js    Hitungan kalkulator protection gap dan pesan WhatsApp hasilnya
│   │   └── faq.js           Accordion tanya jawab (Beranda, Solusi, Tanya Jawab)
│   ├── img/                 Foto dan logo dari klien
│   └── fonts/               Kosong (font dimuat dari Google Fonts)
├── docs/                    Catatan internal (jangan diunggah ke hosting)
│   ├── checklist-qa.md      Checklist dan hasil pengujian
│   ├── qa-check.js          Skrip pemeriksa tautan dan struktur HTML
│   └── konten-dari-klien.md Daftar bahan dari klien (belum diisi)
├── robots.txt               Aturan untuk mesin pencari (diisi saat deploy)
├── sitemap.xml              Daftar halaman untuk Google (diisi saat deploy)
└── README.md                Dokumen ini
```

---

## 4. Cara kerja fitur utama

### Formulir konsultasi

Formulir ada di halaman **Konsultasi Gratis** dan **Hubungi Kami**. Formulir ini **tidak mengirim data ke server dan tidak menyimpan apa pun**:

1. Pengunjung mengisi nama, nomor WhatsApp, keperluan, dan pesan (opsional).
2. `form.js` memeriksa isian di browser. Jika ada yang salah, pesan error tampil di bawah field.
3. Jika semua benar, WhatsApp terbuka di tab baru dengan pesan berisi data tersebut.
4. Data baru sampai ke konsultan setelah pengunjung menekan **kirim** di WhatsApp.

| Field | Aturan |
|---|---|
| Nama | Wajib, minimal 2 karakter |
| Nomor WhatsApp | Wajib, nomor HP Indonesia diawali `08`, `62`, atau `+62`. Spasi, titik, dan strip boleh. |
| Keperluan | Wajib dipilih |
| Pesan | Opsional, maksimal 1000 karakter |

Kalau kelak data juga ingin dikirim ke email, dibutuhkan layanan formulir pihak ketiga. Dalam hal itu, **Kebijakan Privasi wajib diperbarui**, karena isinya sekarang menyatakan website tidak menyimpan data.

### Kalkulator protection gap

Halaman `kalkulator.html` memperkirakan kesenjangan perlindungan (*protection gap*) asuransi jiwa dan penyakit kritis. Tampilan dan alurnya mengikuti contoh dari klien (1 November 2026): 4 isian utama dan hasil yang langsung berubah tanpa tombol. Periode kebutuhan diketik, tidak memakai slider seperti di contoh. Menu **Kalkulator** ada di semua halaman, dan kotak ajakan ke kalkulator ada di Beranda (di bawah kartu kategori solusi) dan di Solusi (di bawah panduan prioritas).

Rumus yang dipakai `kalkulator.js` (fungsi `hitungGap`). Rumus yang sama juga dijelaskan kepada pengunjung di bagian "Cara Kalkulator Menghitung":

| | Kebutuhan | Dikurangi |
|---|---|---|
| Jiwa | pengeluaran bulanan keluarga × 12 × periode kebutuhan + sisa utang + dana pendidikan anak + dana darurat & biaya lain | perlindungan jiwa yang dimiliki + tabungan & investasi |
| Penyakit kritis | penghasilan bulanan × 12 × 3, 4, atau 5 tahun (awalnya 3) | santunan penyakit kritis yang dimiliki |

Tanpa rincian tambahan, rumus jiwa sama dengan contoh klien: pengeluaran × 12 × periode, dikurangi perlindungan yang dimiliki. Kesenjangan tidak pernah di bawah Rp 0. Inflasi dan hasil pengembangan dana tidak dihitung, dan hal ini tertulis di catatan hasil.

- **Isian utama:** penghasilan bulanan, pengeluaran bulanan keluarga, perlindungan jiwa yang dimiliki, dan periode kebutuhan (diketik, 1–40 tahun, awalnya terisi 10). Hasil asuransi jiwa muncul begitu pengeluaran diisi dan periodenya valid. Hasil penyakit kritis muncul begitu penghasilan diisi. Bila periode di luar 1–40, pesan error tampil setelah kolom ditinggalkan.
- **Rincian tambahan (opsional):** utang, dana pendidikan, dana darurat, tabungan, santunan penyakit kritis, dan pilihan 3–5 tahun penghasilan. Semuanya ada di bagian yang bisa dibuka (`<details class="calc__more">`). Isian yang kosong dihitung Rp 0.
- **Privasi:** semua hitungan dilakukan di browser. Tombol **Diskusikan Hasil via WhatsApp** membuka WhatsApp dengan ringkasan hasil saja (kebutuhan, yang dimiliki, dan kesenjangan per jenis), bukan isian satu per satu. Data baru terkirim bila pengunjung menekan kirim di WhatsApp. Hal ini juga dijelaskan di Kebijakan Privasi bagian 2 dan 3.

Kalau rumus diubah, ubah juga penjelasan di bagian "Cara Kalkulator Menghitung" di `kalkulator.html`, supaya yang ditampilkan ke pengunjung tetap sesuai.

### Tombol WhatsApp

Semua tautan WhatsApp memakai atribut `data-wa`. Saat halaman dibuka, `main.js` mengisi alamat tautan itu dengan nomor dari `SITE.whatsapp`. Alamat yang tertulis langsung di HTML (`https://wa.me/6281200000000`) hanya cadangan bila JavaScript gagal dimuat.

Satu tombol bisa diberi pesan awal sendiri dengan mengisi atributnya:

```html
<a data-wa="Halo, saya ingin bertanya tentang asuransi kesehatan." href="https://wa.me/6281200000000">Tanya via WhatsApp</a>
```

### Animasi

- Isi hero tampil bertahap saat halaman dibuka. Diatur di `components.css`, bagian "Animasi".
- Konten di bawah layar muncul saat di-scroll. `main.js` memasang kelas `reveal` pada kartu dan section.
- Semua animasi otomatis mati bila pengunjung mengaktifkan pengaturan "kurangi gerakan" (*reduce motion*) di perangkatnya. Konten tetap tampil normal walaupun JavaScript gagal dimuat.

### Header dan footer

Karena website ini statis, header dan footer **ditulis ulang di setiap file HTML**: 9 file saat ini, ditambah halaman artikel nanti. Perubahan menu atau footer harus dilakukan di semua file (lihat [5.6](#56-menu-navigasi-dan-footer)).

---

## 5. Panduan mengubah konten

> **Tips VS Code:** `Ctrl+Shift+F` mencari teks di semua file. `Ctrl+Shift+H` mencari dan mengganti di semua file sekaligus. Setelah menyimpan perubahan, refresh browser.

### 5.1 Nomor WhatsApp

Wajib diganti sebelum website online.

1. Buka `assets/js/main.js` dan ubah baris ini:

   ```js
   whatsapp: "6281200000000",
   ```

   Isi dengan nomor klien dalam format internasional, **tanpa `+`, spasi, atau angka 0 di depan**. Contoh: `0812-3456-7890` ditulis `6281234567890`.

2. Ganti juga nomor cadangan di semua file HTML: tekan `Ctrl+Shift+H`, cari `6281200000000`, ganti dengan nomor yang sama, lalu pilih *Replace All*. Langkah ini juga mengganti tautan telepon (`tel:+62...`) di `kontak.html`. Kalau nomor telepon berbeda dengan nomor WhatsApp, ubah tautan telepon itu secara terpisah.

3. Ganti teks yang tampil untuk pengunjung, yaitu `[nomor]`, `[nomor WhatsApp]`, dan `[nomor telepon]`, misalnya dengan `0812-3456-7890`.

4. Uji: klik tombol WhatsApp dan kirim formulir. Pastikan chat terbuka ke nomor yang benar.

Pesan awal untuk tombol WhatsApp umum diatur di `waMessage`, tepat di bawah `whatsapp` dalam `main.js`.

### 5.2 Nama usaha dan teks placeholder

Semua teks yang menunggu data klien ditulis dalam kurung siku, misalnya `[Nama Usaha]`. Cari karakter `[` dengan `Ctrl+Shift+F` untuk menemukan semuanya.

| Placeholder | Tempat | Diisi dengan |
|---|---|---|
| `[Nama Usaha]` | Semua halaman: judul tab, header, footer | Nama usaha atau brand. Ganti sekaligus dengan `Ctrl+Shift+H`. |
| `[Nama Konsultan]`, `[Jabatan]` | Beranda, Tentang Saya | Nama dan jabatan konsultan |
| `[nomor]`, `[email]`, `[alamat kantor]` | Footer semua halaman, Kontak | Kontak klien |
| `[Jam operasional]`, `[jam]` | Band ajakan konsultasi, Konsultasi, Kontak | Jam layanan |
| `[Deskripsi singkat usaha, ...]` | Footer | Satu atau dua kalimat tentang usaha |
| `[Sertifikasi]`, `[Asosiasi / izin]`, `[Nomor izin / kredensial]` | Tentang Saya | **Hanya jika benar dan terverifikasi.** Jika tidak ada, hapus kotaknya. |
| `[Jawaban dikonfirmasi klien.]` | FAQ singkat di Beranda | Jawaban dari klien |
| `[Judul artikel ...]`, `[Ringkasan ...]` | Beranda, Edukasi | Judul dan ringkasan artikel |
| `[tanggal]`, `[nama penyedia]` | Kebijakan Privasi | Tanggal terbit dan nama hosting |

Bagian yang datanya tidak tersedia **dihapus**. Jangan dibiarkan berisi `[...]`, dan jangan diisi karangan. Komentar `<!-- GANTI: ... -->` di HTML menunjukkan bagian yang perlu diperiksa.

### 5.3 Foto

1. **Siapkan foto.** Gunakan format WebP atau JPG. Lebar sekitar 1600 px untuk foto besar (hero, profil) dan 800 px untuk gambar kartu artikel. Kompres dulu, misalnya di [squoosh.app](https://squoosh.app), sampai ukurannya kira-kira di bawah 300 KB.
2. **Simpan** di `assets/img/`, dengan nama file huruf kecil tanpa spasi, misalnya `foto-konsultan.webp`.
3. **Pasang di HTML.** Cari kotak placeholder (`class="ph ..."`). Contoh di Beranda:

   ```html
   <div class="ph hero__photo" role="img" aria-label="Tempat foto utama dari klien">Foto utama (dari klien)</div>
   ```

   Ubah menjadi:

   ```html
   <div class="ph hero__photo">
     <img src="assets/img/foto-utama.webp" alt="Konsultan berdiskusi dengan sebuah keluarga">
   </div>
   ```

   - Hapus `role`, `aria-label`, dan teks placeholder. Deskripsi foto pindah ke `alt`.
   - Foto otomatis memenuhi kotak dan dipotong rapi, dengan fokus agak ke atas agar wajah tidak terpotong. Kalau bagian penting foto tetap terpotong, atur titik fokusnya, misalnya `<img ... style="object-position: 50% 10%">`.
   - Kalau di dalam kotak ada label kategori (`article-card__chip`, di halaman Edukasi), biarkan label itu. Cukup hapus teks placeholder dan tambahkan `<img>`.
   - Di file dalam folder `edukasi/`, alamat foto diawali `../`, contoh `../assets/img/artikel-1.webp`.
   - Untuk foto yang tidak terlihat di layar pertama (semua selain foto hero), tambahkan `loading="lazy"` agar halaman lebih cepat dibuka.

### 5.4 Warna dan font

Warna utama ada di `assets/css/base.css`, blok `:root`:

```css
--color-ink: #0a1a2f;      /* teks utama + tombol utama */
--color-accent: #2447c4;   /* aksen biru */
--color-dark: #07142a;     /* hero, band ajakan konsultasi, footer */
```

Blok di bawahnya (`.theme-dark, .hero, ...`) mengatur warna di area gelap, yaitu hero dan footer. Kalau warna brand diganti, sesuaikan kedua blok.

Font diatur lewat `--font-heading` dan `--font-body`, dan dimuat oleh tag `<link href="https://fonts.googleapis.com/...">` di `<head>` setiap halaman. Kalau font diganti, ubah keduanya.

### 5.5 Logo dan favicon

Saat ini nama usaha di header berupa teks. Untuk memakai logo, ganti isi tautan `brand` di header setiap halaman:

```html
<a class="brand" href="index.html"><img src="assets/img/logo.svg" alt="[Nama Usaha]" height="36"></a>
```

Footer berlatar gelap, jadi siapkan versi logo berwarna terang jika logo juga dipasang di sana.

Untuk ikon kecil di tab browser (favicon), tambahkan baris ini di `<head>` setiap halaman:

```html
<link rel="icon" href="assets/img/favicon.png">
```

### 5.6 Menu navigasi dan footer

- Menu ada di dalam `<nav class="nav" id="site-nav">`, footer di dalam `<footer class="site-footer">`.
- Ubah di **semua file HTML**. Kalau perubahannya sama persis, `Ctrl+Shift+H` membantu.
- Di folder `edukasi/`, semua tautan diawali `../`, misalnya `../kontak.html`.
- Atribut `aria-current="page"` menandai halaman yang sedang dibuka (garis biru di menu). Di setiap file, atribut itu harus ada pada tautan halaman file tersebut.

### 5.7 Menambah pertanyaan FAQ

Salin satu blok `accordion__item`, lalu ganti id-nya agar unik di halaman itu. Contoh untuk pertanyaan kedelapan di `faq.html`:

```html
<div class="accordion__item">
  <h3><button class="accordion__trigger" type="button" aria-expanded="false" aria-controls="q8" id="q8-btn">
    Pertanyaan baru?
    <svg class="icon" aria-hidden="true"><use href="#i-chevron"/></svg>
  </button></h3>
  <div class="accordion__panel" id="q8" role="region" aria-labelledby="q8-btn" hidden>
    <p>Jawaban.</p>
  </div>
</div>
```

`aria-controls` pada tombol harus sama dengan `id` panel, dan `aria-labelledby` pada panel harus sama dengan `id` tombol. Kalau tidak cocok, pertanyaan tidak bisa dibuka.

### 5.8 Judul halaman dan deskripsi untuk Google

Setiap halaman punya `<title>` dan `<meta name="description">` di `<head>`. Keduanya yang tampil di hasil pencarian Google. Ganti `[Nama Usaha]`, dan buat deskripsi sekitar 150–160 karakter yang menjelaskan isi halaman. Tag `og:title` dan `og:description` di bawahnya dipakai saat tautan dibagikan di WhatsApp atau media sosial.

### 5.9 Artikel

Template halaman artikel belum dibuat. Bagian ini dilengkapi setelah template tersedia.

---

## 6. Deployment

### Rekomendasi: Netlify (gratis)

Website ini bisa dihosting di layanan hosting statis mana pun. Netlify paling mudah karena cukup seret dan lepas (*drag and drop*) folder.

1. **Siapkan folder unggahan.** Salin folder proyek, lalu hapus `docs/` dan `README.md` dari salinan itu. Semua file yang diunggah bisa dibuka siapa pun lewat browser.
2. **Buat akun** di [netlify.com](https://www.netlify.com/). Sebaiknya memakai email milik klien, supaya akunnya bisa diserahkan.
3. Di dashboard Netlify, buat situs baru dengan opsi **deploy manual** (drag and drop), lalu seret folder salinan ke area unggah.
4. Netlify memberi alamat sementara berakhiran `.netlify.app`. Namanya bisa diganti di pengaturan situs.
5. Buka alamat itu dan uji semua halaman, termasuk dari HP.

**Memperbarui website:** siapkan ulang folder unggahan (langkah 1), lalu unggah lewat menu deploy di dashboard situs.

### Memasang domain sendiri

1. Beli domain (misalnya `.com` atau `.id`) di registrar domain, **atas nama klien**.
2. Di pengaturan domain Netlify, tambahkan domain tersebut, lalu atur DNS di panel registrar sesuai petunjuk dari Netlify.
3. HTTPS (ikon gembok) dipasang otomatis oleh Netlify setelah DNS aktif. Perubahan DNS bisa memakan waktu hingga 24–48 jam.

### Alternatif hosting gratis

| Layanan | Catatan |
|---|---|
| Cloudflare Pages | Cepat dan mendukung unggah folder langsung |
| GitHub Pages | Perlu akun GitHub. Di akun gratis, repository harus publik, sehingga semua file termasuk `docs/` bisa dilihat orang lain. |

### Setelah domain ada: isi `robots.txt` dan `sitemap.xml`

Ganti `https://domainanda.com` dengan domain asli.

`robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://domainanda.com/sitemap.xml
```

`sitemap.xml` (tambahkan halaman artikel setelah terbit):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://domainanda.com/</loc></url>
  <url><loc>https://domainanda.com/tentang.html</loc></url>
  <url><loc>https://domainanda.com/solusi.html</loc></url>
  <url><loc>https://domainanda.com/kalkulator.html</loc></url>
  <url><loc>https://domainanda.com/konsultasi.html</loc></url>
  <url><loc>https://domainanda.com/edukasi/</loc></url>
  <url><loc>https://domainanda.com/faq.html</loc></url>
  <url><loc>https://domainanda.com/kontak.html</loc></url>
  <url><loc>https://domainanda.com/kebijakan-privasi.html</loc></url>
</urlset>
```

Opsional: daftarkan domain di [Google Search Console](https://search.google.com/search-console) (gratis) dan kirim alamat sitemap agar Google lebih cepat menemukan website.

### Daftar akun untuk diserahkan

| Akun | Dipakai untuk | Email pemilik akun |
|---|---|---|
| Hosting (Netlify atau lainnya) | Menyimpan dan menayangkan website | [email] |
| Registrar domain | Domain website | [email] |

> **Jangan menulis password di README atau di file mana pun dalam proyek.** Serahkan password langsung kepada klien, lalu minta klien menggantinya.

---

## 7. Checklist sebelum serah terima

Checklist pengujian yang lebih rinci, beserta hasilnya, ada di `docs/checklist-qa.md`. Pemeriksaan tautan dan struktur HTML bisa dijalankan ulang kapan saja dengan perintah `node docs/qa-check.js` dari folder proyek (butuh Node.js).

- [ ] Tidak ada lagi teks `[...]` di halaman (cari `[` di semua file).
- [ ] Nomor WhatsApp asli sudah dipasang di `main.js` dan di semua HTML. Tombol WhatsApp dan formulir sudah dicoba, dan chat terbuka ke nomor yang benar.
- [ ] Bagian yang tidak punya data (sertifikasi, media sosial, tonggak karier, dan sebagainya) sudah dihapus.
- [ ] Semua tautan berfungsi dan tidak ada halaman putih (halaman artikel sudah dibuat).
- [ ] Foto asli terpasang, sudah dikompres, dan punya teks `alt`.
- [ ] Diuji di HP asli (Android, dan iPhone bila ada), serta di Chrome dan minimal satu browser lain.
- [ ] Skor Lighthouse sudah dicek (Chrome: `F12` → tab Lighthouse) untuk Performance, Accessibility, Best Practices, dan SEO.
- [ ] Kebijakan Privasi: tanggal dan nama hosting terisi, dan kalimat yang menunggu konfirmasi klien sudah diputuskan.
- [ ] `robots.txt` dan `sitemap.xml` terisi dengan domain asli.
- [ ] Klien sudah menyetujui seluruh teks, terutama FAQ dan penjelasan produk.
- [ ] Akun hosting dan domain atas nama klien, dan source code sudah diserahkan.

---

## 8. Ketentuan konten asuransi

Ringkasan bagian 9 proposal. Berlaku untuk siapa pun yang mengubah isi website.

- Jangan menjanjikan manfaat, premi, hasil investasi, atau persetujuan klaim.
- Jangan mencantumkan sertifikasi, lisensi, nomor izin, lama pengalaman, angka statistik, atau testimoni yang tidak dapat dibuktikan.
- Logo dan nama perusahaan asuransi hanya boleh ditampilkan jika klien memiliki izin.
- Penjelasan produk bersifat umum, dan ketentuan lengkap mengikuti polis resmi. Jangan menghapus disclaimer di footer.
- Formulir tidak boleh meminta data sensitif seperti NIK, data kesehatan, nomor polis, atau rekening.
- Klien bertanggung jawab atas kebenaran informasi dan kepatuhan terhadap ketentuan yang berlaku bagi bisnisnya.

---

## 9. Teknologi dan lisensi

- **Teknologi:** HTML, CSS, dan JavaScript tanpa library. Total JavaScript sekitar 14 KB.
- **Browser:** versi terbaru Chrome, Edge, Firefox, dan Safari, baik desktop maupun HP. Beberapa efek, seperti blur pada header dan sorotan pertanyaan yang sedang terbuka, memakai fitur CSS yang baru. Di browser lama efek itu tidak tampil, tetapi website tetap berfungsi.
- **Font:** [Inter](https://fonts.google.com/specimen/Inter) dan [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) dari Google Fonts, dengan lisensi SIL Open Font License 1.1 yang mengizinkan penggunaan komersial.
- **Ikon:** berasal dari set ikon [Lucide](https://lucide.dev), lisensi ISC. Copyright © Lucide Contributors; sebagian © Cole Bemis (Feather, lisensi MIT). Teks lisensi lengkap: <https://lucide.dev/license>.
- **Foto, logo, dan teks dari klien** menjadi tanggung jawab klien, termasuk hak ciptanya.

---

Dikembangkan oleh [Nama Pengembang] – [kontak pengembang].
