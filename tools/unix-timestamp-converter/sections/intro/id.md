## Mengonversi timestamp Unix ke tanggal

Tempel timestamp untuk melihat tanggal dan jam dalam zona waktu perangkat Anda, waktu UTC, format ISO 8601, serta selisihnya dari waktu sekarang. Misalnya, `1704067200` detik dan `1704067200000` milidetik sama-sama menghasilkan `2024-01-01T00:00:00.000Z` dalam format ISO 8601.

## Mengonversi tanggal ke timestamp Unix

Ubah **Tanggal dan Waktu** untuk mengonversi waktu setempat ke timestamp epoch dalam satuan yang dipilih. Klik **Sekarang** untuk mendapatkan timestamp saat ini. Untuk log dan API, gunakan nilai ISO 8601 yang diakhiri `Z` jika Anda perlu menunjukkan waktu UTC secara jelas.

## Memilih detik, milidetik, atau nanodetik

Timestamp Unix menghitung waktu sejak 1 Januari 1970 pukul 00.00.00 UTC. **Otomatis** membaca hingga 10 digit sebagai detik, 11 hingga 13 digit sebagai milidetik, dan angka yang lebih panjang sebagai nanodetik. Pilih satuannya secara manual jika format sumber sudah diketahui, terutama untuk timestamp lama dalam milidetik atau jika tanggal yang ditampilkan tampak keliru. Tampilan tanggal memiliki ketelitian hingga milidetik.
