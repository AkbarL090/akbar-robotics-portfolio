# Handoff pengembangan

## Status

Fase 3 berada pada tahap review visual lokal. Lanjutkan dari checkpoint terbaru, dengan 8e2546e sebagai referensi prototype awal. Homepage meliputi identitas pribadi, Selected Work, Competition Journal, Achievements, Engineering Journey, About, keahlian teknis, dan kontak. Tersedia lima studi kasus dan tiga demo pendidikan. Hasil tim dengan sumber publik dan kontribusi pribadi tercatat terpisah dalam register media.

## Arsitektur

- src/main.tsx menyusun halaman indeks, navigasi serta pemilihan halaman melalui pathname. Tautan asli browser mendukung deep link dan riwayat navigasi.
- src/RobotPlate.tsx memilih enhancement atau fallback foto. src/scene.ts memuat Three.js secara dinamis, mengatur kamera, lantai, penanda kamera kepala, resize dan pembersihan GPU.
- src/work.ts menyimpan register konten; src/CaseStudy.tsx merender detail dan video. src/Filmstrip.tsx menghubungkan still ke waktu rekaman.
- src/Demos.tsx memuat tiga diagram SVG dengan slider atau tombol native. Nilai dan distribusi sintetis untuk pengajaran.
- src/style.css dan src/portfolio.css mengatur tipografi, palet, komposisi, motion dan breakpoint.
- public/media berisi seluruh turunan yang diperlukan. Lihat media-evidence.md untuk asal dan hak pakai. Recovery, sertifikat dan dokumen profil internal tidak diperlukan saat instalasi.
- AGENTS.md dan .agents/skills memuat anti-ai-slop, editorial-art-direction, advanced-typography, creative-frontend, motion-design, robotics-visualization, engineering-storytelling dan visual-quality-audit.

## Instalasi dan browser test

Salin atau clone checkpoint beserta package-lock.json. Gunakan perintah di README untuk npm ci, build dan preview. Preview harus melayani build terbaru pada loopback port 4173. Untuk URL lain, set PREVIEW_URL sebelum QA.

**PowerShell**, dengan Microsoft Edge sudah terpasang:

```powershell
New-Item -ItemType Directory -Force .local/tmp | Out-Null
$env:TEMP = (Resolve-Path .local/tmp).Path
$env:TMP = $env:TEMP
npm.cmd run qa
```

**Ubuntu**, dari root project:

```sh
export PLAYWRIGHT_BROWSERS_PATH="$PWD/.local/pw-browsers"
npx playwright install chromium
npm run qa
```

Playwright menggunakan msedge pada Windows dan chromium pada Linux. BROWSER_CHANNEL dapat disetel ke chrome atau msedge untuk browser yang terpasang. Ubuntu memerlukan pustaka sistem Chromium dan dukungan codec video H.264. Jika Playwright melaporkan dependensi OS hilang, ikuti daftar dependensi untuk distribusi laptop melalui administrator kantor. File screenshot serta results.json ditulis ulang oleh QA di review/.

## Terbuka untuk review

- Jalankan QA pada Ubuntu kantor dan uji pointer pada GPU fisik. Validasi sesi ini memakai Edge di Windows dengan SwiftShader dan emulasi sentuh.
- Tinjau framing potret, crop kepala robot, ukuran judul, dan urutan cerita sebelum publikasi. Cek hak foto kompetisi dan footage.
- Tambahkan bukti motion, trajectory lokalisasi, serta dataset pengukuran depth ketika tersedia. Saat ini halaman motion berdasarkan keterangan pemilik.
- Untuk hosting statis di masa depan, permintaan /work/* perlu dikembalikan ke index.html. Situs saat ini hanya disajikan lokal.
