## Konversi spreadsheet menjadi basis data SQLite

Tambahkan satu atau beberapa file CSV atau Excel (.xlsx atau .xls). Setiap file CSV dan setiap lembar kerja Excel yang berisi data menjadi tabel tersendiri dalam satu basis data. Gunakan pratinjau untuk memeriksa kolom dan mengubah nama tabel sebelum memilih **Buat basis data SQLite**. Konversi berlangsung di browser dan file Anda tetap di perangkat.

## Cara data spreadsheet dimasukkan ke tabel

Secara bawaan, baris pertama digunakan sebagai nama kolom. Nonaktifkan **Gunakan baris pertama sebagai nama kolom** untuk mengimpor baris tersebut sebagai data dan membuat nama kolom seperti `column_1`. Nama tabel atau kolom yang sama diberi akhiran angka. Dengan begitu, saat menambahkan file dengan nama yang sama, kedua tabel tetap tersimpan.

Konverter mendeteksi kolom numerik dan mempertahankan angka nol di awal pengenal berbentuk teks seperti `00123`. Sel kosong menjadi nilai SQL `NULL`. Tanggal Excel disimpan sebagai teks tanggal atau stempel waktu dalam format ISO. Sel dengan rumus menggunakan hasil yang tersimpan di buku kerja. Jika hasil perlu dihitung ulang, lakukan di Excel dan simpan buku kerja sebelum mengonversi.

## Jalankan kueri SQL pada hasil konversi

Pilih **Buka di Penampil SQLite** untuk menelusuri tabel dan menjalankan kueri. Anda juga bisa mengunduh basis data `.sqlite` untuk digunakan dengan baris perintah SQLite, Python, atau aplikasi SQLite lain. Misalnya, konversi `orders.csv` dan buku kerja Excel dengan lembar bernama `customers`, lalu gunakan kueri ini untuk menghitung jumlah pesanan tiap pelanggan.

```sql
SELECT customers.name, COUNT(*) AS order_count
FROM orders
JOIN customers ON customers.id = orders.customer_id
GROUP BY customers.id, customers.name;
```

Gunakan nama tabel dan kolom dari pratinjau Anda saat menerapkan contoh ini ke data sendiri.
