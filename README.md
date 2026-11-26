# Match Notebook

Prototype portfolio lokal Muhammad Akbar Iqvi. Implementasi React, TypeScript, Vite dan Three.js mengikuti halaman 2–3 dari Akbar-Visual-Review.pdf. Isi website berbahasa Inggris.

## Menjalankan

Gunakan Node.js 22.23.5 dan PowerShell dari direktori ini.

```powershell
npm.cmd ci --cache .local/npm
npm.cmd run dev
```

Buka alamat lokal yang dicetak Vite, biasanya http://127.0.0.1:5173. Untuk menguji hasil produksi:

```powershell
npm.cmd run build
npm.cmd run preview -- --port 4173 --strictPort
```

Dengan preview aktif, jalankan dari PowerShell kedua:

```powershell
$env:TEMP = "$pwd/.local/tmp"
New-Item -ItemType Directory -Force $env:TEMP | Out-Null
$env:TMP = $env:TEMP
npm.cmd run qa
```

QA memakai Playwright dan Microsoft Edge terpasang. Variabel BROWSER_CHANNEL dan PREVIEW_URL dapat menyesuaikan browser serta alamat. Hasil disimpan di review/.

## Review interaksi

Gerakkan pointer di area pembuka, lalu keluar melalui header. Pilih **Full view** untuk melihat dudukan asli dan grid. Scroll untuk mengubah sudut pandang. Pada layar sentuh kecil dan saat reduced motion aktif, tombol tetap dapat mengganti framing foto. Buka **Read the field note** untuk membaca peran Akbar dalam keputusan keeper.

## Struktur

- src/main.tsx menyusun halaman, panel foto, dan Selected Work.
- src/scene.ts mengelola kamera perspektif, texture plane, lantai, grid, bayangan dan siklus hidup canvas.
- src/style.css menyimpan token warna, font lokal, breakpoint, fokus dan animasi judul.
- public/media berisi turunan media untuk review lokal dan lisensi font.
- scripts/qa.mjs menguji build melalui browser dan merekam screenshot.
- .agents/skills dan AGENTS.md menyimpan instruksi handoff.
- review/QA.md merangkum hasil pemeriksaan dan batas validasi.

## Asal aset dan klaim

| Elemen | Sumber pemilik | Penggunaan |
| --- | --- | --- |
| Robot No. 4 | robot42026.jpeg, Barelang FC | Cutout depan dari board discovery, termasuk dudukan. Framing detail dan elevasi menggunakan foto yang sama. |
| Frame 00:04, 00:09, 00:14 | Recording 2026-11-26 043139.mp4 | Tiga still dari rekaman 35,4 detik. Timestamp menunjukkan waktu dalam video. |
| Pertanyaan, peran dan deskripsi strategi | Board Match Notebook dan register PROFILE_AND_EVIDENCE | Estimasi jarak bola, pan/tilt kepala, maju dan mundur sesuai batas area. |
| Open Sans Condensed Bold | Paket board discovery | Font lokal beserta pemberitahuan lisensi di public/media. |

Referensi asli, hasil ekstraksi dan register profil internal berada di workspace lokal, di luar checkpoint dan ZIP source. Pemakaian foto dan still untuk publikasi memerlukan pemeriksaan hak oleh pemilik. Fase ini berakhir pada review prototype.
