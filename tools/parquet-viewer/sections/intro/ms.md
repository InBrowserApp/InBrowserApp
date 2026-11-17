## Periksa fail Parquet dalam pelayar anda

Buka atau lepaskan fail `.parquet` untuk menyemak imbas datanya dan memeriksa jenis fizikal, anotasi logik serta pengulangan setiap medan. Kumpulan bersarang kekal kelihatan dalam skema. Ringkasan menunjukkan bilangan baris, lajur, kumpulan baris, pemampatan dan pencipta fail jika tersedia. Anda boleh mencuba contoh yang disertakan tanpa memilih fail.

## Semak imbas data dan eksport CSV atau JSON

Data dimuatkan satu halaman pada satu masa. Gunakan kawalan halaman untuk menavigasi fail dan pilih sel untuk membaca nilai penuhnya. Beralih kepada **Skema** untuk memeriksa medan. Gunakan **Eksport data** untuk memuat turun halaman semasa atau semua baris sebagai CSV UTF-8 atau tatasusunan JSON. Eksport seluruh fail disediakan secara berkelompok dan boleh dibatalkan.

CSV menyertakan nama lajur dan mengapit nilai yang mengandungi koma, tanda petik serta pemisah baris dengan tanda petik. null menjadi medan CSV kosong dan kekal sebagai `null` dalam JSON. Nilai bersarang menggunakan JSON; nilai binari menggunakan teks heksadesimal. Untuk mengekalkan integer 64 bit, JSON menulisnya sebagai rentetan. Tarikh dan cap masa menggunakan teks ISO dengan ketepatan milisaat. Nombor perpuluhan mengikut ketepatan berangka pembaca, jadi pemapar ini bukan alat penukaran tanpa kehilangan untuk data perpuluhan atau cap masa berketepatan tinggi.

## Pemprosesan setempat

Fail anda dibaca secara setempat dalam pekerja latar belakang dan tidak pernah dimuat naik. Pemapar membaca pengaki terlebih dahulu, kemudian hanya julat baris yang diperlukan untuk semakan imbas. Kumpulan baris Parquet mungkin masih memerlukan memori yang banyak untuk dinyahkod; saiz eksport dihadkan oleh memori yang tersedia dalam pelayar anda. Fail tanpa pemampatan serta kodek Snappy, Gzip, Brotli, Zstandard dan LZ4 disokong oleh hyparquet dan pakej pemampatnya. Fail Parquet yang disulitkan tidak disokong.
