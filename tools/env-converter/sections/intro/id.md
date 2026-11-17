## Konversi konfigurasi lingkungan

Tempel file `.env` dan pilih JSON atau YAML, atau konversi objek JSON/YAML datar kembali ke `.env`. Impor file lokal, tukar masukan dan keluaran, lalu salin atau unduh hasilnya. Semuanya berjalan di browser Anda; konfigurasi tidak pernah diunggah atau disimpan dalam riwayat browser maupun penyimpanan lokal.

### Nilai dan tanda kutip

Variabel lingkungan berupa string: `PORT=3000`, `DEBUG=false`, dan `CODE=0012` tetap menjadi `"3000"`, `"false"`, dan `"0012"`. Angka dan boolean JSON/YAML dikonversi menjadi string. Null, array, dan objek bersarang memerlukan nilai string yang eksplisit. Apit nilai YAML seperti `0012` dengan tanda kutip jika penulisannya harus dipertahankan persis.

Parser mendukung baris kosong, komentar `#`, awalan `export`, serta tanda kutip tunggal, ganda, atau backtick untuk nilai multibaris. Hanya urutan `\n` dan `\r` dalam tanda kutip ganda yang diubah menjadi karakter terkait. Tanda kutip dan garis miring terbalik lainnya tetap apa adanya, sesuai perilaku umum dotenv. Kunci menggunakan huruf, angka, dan garis bawah serta tidak boleh diawali angka. Keluaran memilih jenis tanda kutip yang mempertahankan nilai.

### Pemeriksaan konfigurasi

Kunci `.env` duplikat ditampilkan beserta nomor barisnya; definisi terakhir yang digunakan. Tanda kutip penutup yang hilang, teks setelah tanda kutip penutup, dan penetapan yang tidak valid ditampilkan sebagai kesalahan dengan tautan ke baris terkait. Tanda kutip melengkung menghasilkan peringatan. Kunci duplikat JSON/YAML dianggap sebagai kesalahan.

Komentar, jenis tanda kutip asli, dan pemformatan tidak dipertahankan. Referensi seperti `${NAME}` dan perintah shell tetap apa adanya dan tidak pernah dijalankan. Setiap pemuat `.env` dapat memiliki aturan berbeda; alat ini mengikuti cakupan sintaks yang dijelaskan di sini alih-alih menafsirkan skrip shell.

Lihat [spesifikasi .env Node.js](https://nodejs.org/api/environment_variables.html#dotenv) dan [aturan parsing dotenv](https://github.com/motdotla/dotenv#what-rules-does-the-parsing-engine-follow).
