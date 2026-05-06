## Buat Jadwal Cron secara Visual

Ekspresi cron itu ringkas, tetapi perubahan kecil di bidang yang salah dapat memindahkan tugas dari "pagi hari kerja" menjadi "setiap menit." Generator ini memberi setiap bidang kontrolnya sendiri sehingga Anda dapat membuat ekspresi lima bidang standar tanpa menghafal setiap aturan sintaks.

### Kapan Ini Membantu

- Buat jadwal untuk job CI, pencadangan, pemanasan cache, laporan, dan tugas berulang lainnya.
- Mulai dari preset yang dikenal dan sempurnakan satu bidang pada satu waktu.
- Pratinjau waktu eksekusi lokal mendatang sebelum menempelkan ekspresi ke penjadwal.

### Cara Menggunakannya

1. Pilih preset cepat, atau pertahankan ekspresi default dan edit setiap bidang secara manual.
2. Pilih apakah setiap bidang berjalan pada setiap nilai, interval, nilai tertentu, atau rentang.
3. Tinjau ekspresi yang dihasilkan dan pratinjau eksekusi berikutnya, lalu salin ke penjadwal Anda.

### Catatan

- Alat ini menghasilkan cron lima bidang standar: menit, jam, hari dalam bulan, bulan, dan hari dalam minggu.
- Minggu ditampilkan sebagai `0`, yang diterima oleh penjadwal cron bergaya Unix yang umum.
- Jika hari dalam bulan dan hari dalam minggu sama-sama dibatasi, banyak implementasi cron berjalan saat salah satu bidang cocok. Beberapa sistem berbeda, jadi verifikasi kombinasi tersebut di penjadwal target Anda.
