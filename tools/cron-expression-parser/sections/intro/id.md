## Pahami Jadwal Cron Sebelum Anda Mengirimkannya

Ekspresi cron bersifat ringkas, tetapi kesalahan kecil pada field dapat membuat job berjalan jauh lebih sering, atau jauh lebih jarang, daripada yang dimaksudkan. Parser ini memvalidasi ekspresi di browser Anda, menjelaskan jadwal dalam bahasa yang mudah dipahami, merinci setiap field, dan menampilkan pratinjau waktu eksekusi yang akan datang.

### Kapan Menggunakannya

- Periksa jadwal deployment, pencadangan, pembersihan, atau notifikasi sebelum menambahkannya ke server, sistem CI, atau task runner.
- Bandingkan ekspresi cron yang disalin dengan jadwal yang sebenarnya Anda harapkan.
- Ajarkan atau debug sintaks cron dengan mengubah satu field pada satu waktu dan melihat penjelasannya diperbarui.

### Format Yang Didukung

Alat ini mendukung ekspresi cron Unix standar lima field: menit, jam, hari dalam bulan, bulan, dan hari dalam minggu. Alat ini juga menerima ekspresi enam field dengan detik di depan untuk penjadwal yang mendukung presisi tingkat detik.

### Membaca Hasil

Ringkasan memberikan deskripsi dalam bahasa sederhana, sedangkan tabel field menunjukkan bagaimana ekspresi mentah dipecah. Waktu eksekusi yang akan datang menggunakan zona waktu lokal browser Anda, jadi bandingkan dengan zona waktu yang digunakan oleh penjadwal yang akan menjalankan job.

### Catatan

- Nilai hari dalam minggu umumnya menggunakan `0` atau `7` untuk Minggu, dan nama seperti `MON` atau `FRI` juga diterima.
- Nama bulan seperti `JAN` atau `DEC` dapat membuat jadwal produksi lebih mudah ditinjau.
- Jika penjadwal Anda menggunakan dialek cron yang berbeda, konfirmasi token khusus seperti `?`, `L`, `W`, atau `#` dalam dokumentasi penjadwal tersebut.
