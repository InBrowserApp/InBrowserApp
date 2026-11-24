## Tukar hamparan kepada pangkalan data SQLite

Tambah satu atau beberapa fail CSV atau Excel (.xlsx atau .xls). Setiap fail CSV dan setiap lembaran kerja Excel yang mengandungi data akan menjadi jadual tersendiri dalam satu pangkalan data. Pratonton lajur dan namakan semula jadual sebelum memilih **Cipta pangkalan data SQLite**. Penukaran berlaku dalam pelayar dan fail kekal pada peranti anda.

## Cara data hamparan ditukar kepada jadual

Secara lalai, baris pertama digunakan sebagai nama lajur. Nyahpilih **Gunakan baris pertama sebagai nama lajur** pada jadual untuk mengimport baris itu sebagai data dan menjana nama lajur seperti `column_1`. Nombor ditambahkan pada hujung nama jadual atau lajur yang berulang, jadi kedua-dua jadual akan kekal jika anda menambah dua fail yang mempunyai nama yang sama.

Penukar mengesan lajur angka dan mengekalkan sifar di awal pengecam teks seperti `00123`. Sel kosong disimpan sebagai nilai SQL `NULL`. Tarikh Excel disimpan sebagai teks tarikh atau cap masa berformat ISO, manakala sel formula menggunakan hasil yang disimpan dalam buku kerja. Jika hasil formula perlu dikira semula, buat pengiraan semula dan simpan buku kerja dalam Excel terlebih dahulu.

## Jalankan pertanyaan SQL pada hasil penukaran

Pilih **Buka dalam Pemapar SQLite** untuk melihat jadual dan menjalankan pertanyaan. Anda juga boleh memuat turun pangkalan data `.sqlite` untuk digunakan dengan baris perintah SQLite, Python atau aplikasi SQLite lain. Sebagai contoh, tukar fail `orders.csv` bersama buku kerja Excel yang mempunyai lembaran kerja bernama `customers`, kemudian gunakan pertanyaan ini untuk mengira bilangan pesanan bagi setiap pelanggan.

```sql
SELECT customers.name, COUNT(*) AS order_count
FROM orders
JOIN customers ON customers.id = orders.customer_id
GROUP BY customers.id, customers.name;
```

Gunakan nama jadual dan lajur yang dipaparkan dalam pratonton apabila menyesuaikan contoh ini dengan data anda.
