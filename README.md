# Match Notebook · Muhammad Akbar Iqvi

Portfolio engineering interaktif berbahasa Inggris. Homepage memperkenalkan Akbar melalui potret, pekerjaan di Barelang FC, dan perjalanan robotika sejak 2024. Lima studi kasus memiliki URL sendiri. Tiga demo menjelaskan keputusan keeper, estimasi pose, dan kemiringan bidang dengan data sintetis.

## Menjalankan

Gunakan Node.js 22.23.5, lalu jalankan dari root checkout.

| Langkah | Windows PowerShell | Ubuntu |
| --- | --- | --- |
| Instal versi terkunci | npm.cmd ci --cache .local/npm | npm ci --cache .local/npm |
| Development | npm.cmd run dev | npm run dev |
| Typecheck dan build | npm.cmd run build | npm run build |
| Preview build | npm.cmd run preview -- --port 4173 --strictPort | npm run preview -- --port 4173 --strictPort |

Buka http://127.0.0.1:4173 untuk preview produksi. Mode development biasanya memakai port 5173. Gunakan terminal kedua untuk QA saat preview aktif.

## Review

Gerakkan pointer pada hero dan pilih **Full view**. Buka timestamp pada featured story untuk melihat frame rekaman, lalu gunakan slider keeper. Dari Selected Work, coba urutan partikel pada halaman localization dan ubah normal bidang pada halaman depth. Pada mobile dan reduced motion, potret robot tetap dapat diganti framing.

- [Handoff Windows dan Ubuntu](docs/DEVELOPMENT_HANDOFF.md)
- [Asal media dan batas klaim](docs/media-evidence.md)
- [Laporan QA](review/QA.md)
- [Desktop](review/home-1440.png) dan [mobile](review/mobile-390.png)

Semua turunan media untuk menjalankan situs tersedia di public/media. Arsip riset pribadi tetap disimpan lokal. Hak publikasi foto, footage dan potret perlu diperiksa pemilik sebelum distribusi publik, termasuk sebelum menjadikan repositori GitHub publik.
