# Review prototype B — Match Notebook

27 November 2026 · Windows · Node 22.23.5 · Playwright 1.56.1 · Microsoft Edge headless. Versi browser dan daftar assertion tersimpan pada results.json. Desktop memakai WebGL2 melalui SwiftShader. Mobile memakai emulasi touch pada context browser terpisah.

## Recovery

Empat ZIP pada root diekstrak ke folder terpisah sesudah pemeriksaan path setiap anggota. Kedua ZIP handoff identik berdasarkan SHA-256. Sembilan hash file aset asli cocok dengan provenance.csv. PDF empat halaman ditemukan dalam paket discovery dan dirender lokal. Halaman 2 menjadi acuan desktop dan sisi B halaman 3 menjadi acuan mobile. Paket ini memuat HTML/CSS board, foto turunan dan lisensi font. Source runtime React/Three.js dibuat dalam fase ini.

## Hasil aktual

| Pemeriksaan | Hasil |
| --- | --- |
| Dependensi | npm install berhasil dan menghasilkan package-lock.json. React dan React DOM 19.2.0, Three.js 0.180.0, Vite 6.4.1, TypeScript 5.9.3. |
| Typecheck dan produksi | tsc --noEmit lulus. Vite menyelesaikan 32 modul. JavaScript aplikasi 62,89 kB gzip, modul scene terpisah 120,65 kB gzip. |
| Layout | Screenshot pada 360, 390, 768, 1280, 1440 dan 1920 px. Seluruh pemeriksaan scrollWidth lulus. |
| Kamera | center.png, left.png, right.png dan reset.png merekam pointer bergerak dan keluar. Pada crop robot desktop, selisih kanal piksel rata-rata terhadap center adalah 17,75 untuk kiri, 19,01 untuk kanan dan 3,59 setelah keluar (skala 0–255). Gerak ambient tetap aktif. |
| Framing dan scroll | full-view.png memperlihatkan dudukan dan bidang tanah. scroll.png diambil sesudah wheel dan perubahan scrollY terkonfirmasi. |
| Keyboard | Tab pertama menuju skip link. Enter mengaktifkan link dan dapat membuka catatan proyek saat summary mendapat fokus. |
| Touch | Emulasi 390 px menampilkan foto. Tap Full view mengganti framing, tap Work menuju #work. |
| Reduced motion | Perubahan preferensi saat halaman terbuka melepas canvas dan menghapus animasi judul. |
| Fallback | Simulasi context loss melepas canvas. Startup dengan getContext WebGL dinonaktifkan tetap menampilkan foto yang berhasil dimuat. |
| Runtime | Script selesai dengan daftar error kosong untuk pageerror, console error dan permintaan aset gagal pada halaman yang diuji. |

## Pemeriksaan visual dan penerapan skill

- **editorial-art-direction** dan **advanced-typography** — komposisi mengikuti board B, dengan portrait detail di kiri, judul condensed tiga baris, tanda tanya oranye, serta metadata monospace. Pada mobile, judul muncul sebelum foto.
- **anti-ai-slop** dan **engineering-storytelling** — satu pertanyaan teknis membuka cerita. Tiga still dari video pemilik disertai timestamp. Catatan menjelaskan kontribusi pada keputusan keeper sesuai register profil.
- **robotics-visualization** dan **motion-design** — kamera perspektif bergerak terhadap bidang foto dan tanah terpisah. Full view memperlihatkan dudukan asli. Damping, reset, perubahan framing, scroll serta opsi foto statis dapat direview melalui localhost.
- **creative-frontend** dan **visual-quality-audit** — foto dan heading tersedia sebelum modul scene selesai dimuat. Inspeksi screenshot awal menemukan caption di luar panel mobile. Tinggi minimum viewport diperbaiki, byline dipadatkan, dan pemilihan foto diam diperkuat untuk perangkat sentuh kecil. Screenshot final dan pengujian touch diulang.

Validasi ini mencakup Edge lokal. Pengukuran FPS, Core Web Vitals, pengujian perangkat fisik, Safari/Firefox, serta penilaian pemilik atas kualitas motion dan crop masih terbuka.
