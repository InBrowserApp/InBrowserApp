## Apa itu pengonversi cURL?

Pengonversi cURL mengubah perintah cURL menjadi kode siap pakai untuk banyak bahasa dan klien HTTP. Ini berguna ketika dokumentasi API, alat pengembang browser, atau riwayat terminal sudah memberi Anda permintaan yang berfungsi dan Anda ingin memindahkannya ke kode aplikasi tanpa menyusun ulang metode, URL, header, cookie, atau body secara manual.

**Kredit**
Didukung oleh [curlconverter](https://curlconverter.com) oleh Nick Carneiro.

## Kapan alat ini berguna

- Saat Anda memulai dari contoh cURL yang sudah berfungsi di dokumentasi API atau riwayat terminal.
- Saat Anda ingin membandingkan permintaan yang sama di `fetch`, Python `requests`, Go, Java, PHP, dan target lain sebelum memilih.
- Saat Anda ingin membuat dasar dengan cepat lalu menambahkan penanganan error, retry, penyegaran autentikasi, dan konfigurasi proyek Anda.

## Apa yang perlu diperiksa setelah konversi

- Pastikan target yang dipilih sesuai dengan pustaka HTTP dan runtime yang benar-benar digunakan proyek Anda.
- Baca peringatan dengan saksama. Beberapa aturan penulisan kutip shell, variabel lingkungan, atau flag cURL yang tidak didukung mungkin perlu dibersihkan secara manual.
- Ganti token placeholder, secret, atau URL contoh sebelum melakukan commit pada kode yang dihasilkan.
