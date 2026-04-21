## Apa itu Data URI?

Data URI (atau data URL) menyematkan file kecil langsung ke teks. Format: `data:[mime][;charset][;base64],data`.

**Penggunaan umum:**

- Gambar atau font inline di HTML/CSS
- Menyimpan aset kecil di JSON/konfig

**Catatan:**

- Cocok untuk file kecil; string panjang bisa memperlambat halaman
- Base64 umum untuk data biner

### Contoh

```text
data:image/svg+xml;base64,PHN2ZyB4bWxucz0i...
```

Bagian sebelum koma menjelaskan file, misalnya tipe MIME dan apakah memakai Base64. Bagian setelah koma adalah payload yang sudah dikodekan.

### Kapan konverter ini cocok digunakan

- Mengubah file lokal menjadi string yang bisa disematkan ke HTML, CSS, JSON, atau markup email
- Membuat demo mandiri dengan cepat tanpa perlu meng-host aset di tempat lain
- Memeriksa tipe MIME yang terdeteksi sebelum menempelkan hasilnya ke alat lain

### Batasan praktis

- Data URI paling cocok untuk file kecil seperti ikon, gambar kecil, atau potongan singkat
- Base64 menambah overhead sekitar 33%, sehingga string akhir lebih besar daripada file aslinya
- String yang sangat panjang bisa merepotkan untuk ditempel ke formulir, konfigurasi, atau editor dengan batas ukuran
