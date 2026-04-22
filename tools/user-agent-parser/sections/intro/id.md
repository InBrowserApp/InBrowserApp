## Apa itu User-Agent?

String User-Agent (UA) mengidentifikasi browser atau aplikasi yang mengirim permintaan dan biasanya berisi info browser, OS, perangkat, dan engine. Karena dapat dipalsukan, gunakan sebagai petunjuk, bukan sinyal keamanan.

### Apa yang ditampilkan parser ini

Alat ini mengurai string UA yang ditempel secara lokal di browser Anda dan mengelompokkan hasilnya menjadi browser, sistem operasi, engine, perangkat, CPU, dan output JSON. Tidak ada data yang diunggah.

### Contoh

Tempelkan string Chrome di Windows yang umum seperti ini:

```text
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36
```

Hasilnya seharusnya mengenali Chrome 115 di Windows 10, engine Blink, dan arsitektur CPU amd64.

### Catatan penting

Browser modern semakin mengandalkan Client Hints, jadi string UA yang disalin mungkin tidak menampilkan semua hal yang dapat dilihat situs saat permintaan nyata terjadi.
