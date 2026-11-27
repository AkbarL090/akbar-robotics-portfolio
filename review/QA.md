# QA Phase 3 · Match Notebook

27 November 2026. Pengujian memakai build produksi lewat HTTP loopback, Node 22.23.5 pada Windows, Playwright 1.56.1 dan Edge 158.0.4370.33. WebGL desktop memakai SwiftShader. Mode touch memakai emulasi browser.

## Pengujian yang dijalankan

| Pemeriksaan | Hasil |
| --- | --- |
| Kompilasi | tsc --noEmit lulus. Vite menyelesaikan 38 modul dalam 7,70 detik pada build final. |
| Ukuran build | JS utama 66,51 kB gzip, chunk studi kasus 4,27 kB, chunk Three.js terpisah 120,93 kB, CSS 4,41 kB. Ukuran ini berasal dari keluaran Vite. |
| Layout | Lebar 360, 390, 430, 768, 1280, 1366, 1440, 1920 px lulus pemeriksaan overflow homepage. Kelima halaman proyek juga lolos pada 360 px. |
| Kamera | Canvas WebGL2 terpasang. Pointer tengah, kiri, kanan, keluar, full view dan scroll direkam. Bukti visual tersedia pada PNG dan interaction.webm. |
| Input | Skip link mendapat fokus pertama, Enter membuka catatan, touch mengubah framing, membuka Work dan memindah bola. Slider keeper dan depth diuji lewat keyboard. |
| Fallback | Preferensi reduced motion yang diubah saat runtime melepas canvas dan mematikan reveal judul. Context loss dan WebGL yang dinonaktifkan saat startup mempertahankan foto. |
| Studi kasus | Lima deep link dibuka langsung. Filmstrip memilih detik ke-9 dan pemutaran maju melewati 9,2 s. Keeper di luar area menghasilkan retreat. Urutan lokalisasi mencapai resampling. Slider depth mencapai 55° dan mode raw menampilkan penjelasan dense returns. |
| Runtime | Seluruh assertion selesai. Monitor mencatat nol error console, pageerror atau permintaan aset gagal selama pengujian. |

## Review visual

Screenshot home-1440.png, home-1920.png, mobile-390.png dan lima case-*.png berasal dari browser. Inspeksi pembuka menunjukkan crop awal terlalu sempit untuk melihat nomor dada dengan jelas. Framing dilonggarkan dan label kamera diarahkan ke kepala. Potret dan nama lengkap ditempatkan bersama pengantar di viewport pertama. Potret lebih besar, perjalanan bertanggal dan daftar keahlian memperoleh ruang sendiri di bawah jurnal. Halaman motion memakai daftar rutinitas berbasis keterangan Akbar.

## Batas validasi

Periksa results.json untuk daftar hasil otomatis. Versi Chromium pilihan Ubuntu, GPU laptop fisik, Safari, Firefox, FPS dan Core Web Vitals belum diuji. Waktu build dan ukuran gzip merupakan pengukuran build lokal. Penilaian akhir gerak, crop personal dan izin publikasi berada pada pemilik.
