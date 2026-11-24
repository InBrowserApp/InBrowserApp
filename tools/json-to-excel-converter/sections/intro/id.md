## Konversi JSON ke tabel Excel

Tempel array JSON atau buka file `.json` dari perangkat, periksa pratinjau tabel, lalu pilih **Unduh XLSX**. Konverter membuat satu lembar kerja dengan baris header. Setiap objek menjadi satu baris, dan semua bidang yang ditemukan di dalam array menjadi kolom. Gunakan alat ini untuk data dari API, daftar produk, atau hasil ekspor data. Jika respons API menyimpan data dalam bidang seperti `data`, tempel array di dalam bidang tersebut.

## Uraikan bidang JSON bersarang menjadi kolom

Opsi **Uraikan bidang bersarang** aktif secara default. Dua rekaman berikut menghasilkan kolom `name`, `contact.city`, dan `tags`.

```json
[
  {
    "name": "Maya",
    "contact": { "city": "Oslo" },
    "tags": ["retail", "online"]
  },
  { "name": "Leo", "contact": { "city": "Lisbon" } }
]
```

Jika opsi ini dinonaktifkan, `contact` tetap berada dalam satu kolom sebagai teks JSON, misalnya `{"city":"Oslo"}`. Array tetap berada dalam satu sel apa pun pengaturannya, sehingga `tags` tidak menambah baris. Bidang yang tidak ada atau bernilai `null` muncul sebagai sel kosong.

## Cara Excel menyimpan nilai JSON

Angka dan nilai boolean biasanya menjadi angka dan nilai logika di Excel. Angka yang melampaui presisi atau rentang Excel disimpan sebagai teks agar semua digitnya tetap utuh. String JSON tetap berupa teks, sehingga pengenal seperti `"00123"`, tanggal yang ditulis sebagai string, dan teks yang diawali `=` tetap persis seperti aslinya.

## Lihat pratinjau dan unduh langsung di browser

Pratinjau menampilkan bagian awal lembar kerja. File XLSX yang diunduh mencakup semua rekaman dan kolom. Konversi berjalan di browser dan data JSON tetap di perangkat Anda. Untuk mengekspor sebagai teks biasa, gunakan [Pengonversi JSON → CSV](../json-to-csv-converter/).
