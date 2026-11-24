## Tukar JSON kepada hamparan Excel

Tampal tatasusunan JSON atau buka fail `.json` dari peranti anda, semak pratonton hamparan dan pilih **Muat turun XLSX**. Penukar ini menghasilkan satu lembaran kerja dengan baris pengepala. Setiap objek menjadi satu baris dan semua medan dalam tatasusunan menjadi lajur. Gunakan alat ini untuk rekod daripada API, senarai produk dan data yang dieksport. Jika respons API menyimpan rekod dalam medan seperti `data`, tampal tatasusunan di dalam medan itu.

## Pecahkan medan JSON bersarang kepada lajur

Pilihan **Pecahkan medan bersarang** didayakan secara lalai. Dua rekod dalam contoh berikut menghasilkan lajur `name`, `contact.city` dan `tags`.

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

Jika pilihan ini dimatikan, `contact` kekal dalam satu lajur sebagai teks JSON seperti `{"city":"Oslo"}`. Tatasusunan kekal dalam satu sel bagi kedua-dua tetapan, jadi `tags` tidak menambah baris. Medan yang tiada dalam rekod atau bernilai `null` dipaparkan sebagai sel kosong.

## Cara Excel menyimpan nilai JSON

Nombor dan nilai Boolean biasanya menjadi nombor dan nilai logik dalam Excel. Nombor yang melebihi ketepatan atau julat Excel disimpan sebagai teks supaya semua digit dikekalkan. Rentetan JSON kekal sebagai teks, jadi aksara asal dalam pengecam seperti `"00123"`, tarikh yang ditulis sebagai rentetan dan teks yang bermula dengan `=` tidak berubah.

## Pratonton dan muat turun dalam pelayar

Pratonton memaparkan bahagian awal lembaran kerja. Fail XLSX yang dimuat turun mengandungi semua rekod dan lajur. Penukaran dijalankan dalam pelayar dan data JSON kekal pada peranti anda. Untuk eksport sebagai teks biasa, gunakan [Penukar JSON → CSV](../json-to-csv-converter/).
