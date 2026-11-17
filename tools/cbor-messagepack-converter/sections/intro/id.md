## Periksa payload API biner

CBOR dan MessagePack adalah format serialisasi biner yang ringkas untuk data terstruktur. Gunakan konverter ini untuk memeriksa respons API, pesan WebSocket, atau nilai dalam cache sebagai JSON, atau membuat payload biner dari JSON untuk debugging. Semuanya diproses di browser Anda; masukan tidak diunggah atau disimpan.

## Kodekan JSON atau dekode byte

Pilih format biner dan arah konversi. Untuk mengodekan, masukkan JSON dan pilih Hex, Base64, atau Base64URL untuk keluarannya. Untuk mendekode, tempel byte dan pilih pengodean masukannya. Mengubah pengodean masukan akan menafsirkan ulang teks yang sudah ada di editor.

Buka berkas JSON saat mengodekan, atau berkas mentah `.cbor`, `.msgpack`, atau `.bin` saat mendekode. Teks yang dikodekan seperti Hex atau Base64 harus ditempel ke editor. Konversi, lalu salin teks yang ditampilkan atau unduh hasilnya. Unduhan biner berisi byte yang sebenarnya dan dapat diimpor kembali.

## Pertahankan nilai dan pahami batasannya

Literal bilangan bulat mempertahankan setiap digit dalam rentang 64-bit yang didukung format. Nilai yang tidak dapat direpresentasikan JSON, seperti bidang biner, tag CBOR, dan ekstensi MessagePack, ditampilkan sebagai pembungkus bertipe yang eksplisit. Aktifkan JSON diperluas untuk mengodekan pembungkus tersebut kembali menjadi biner; biarkan nonaktif untuk objek JSON biasa yang kebetulan menggunakan kunci pembungkus.

Misalnya, saat JSON diperluas aktif, `{"id":{"$integer":"9007199254740993"},"data":{"$binary":"AQI="}}` mengodekan sebuah bilangan bulat secara tepat dan dua byte biner.

Setiap konversi menangani satu nilai, dengan batas masukan 1 MiB. Byte JSON terformat menghitung JSON berindentasi yang ditampilkan, bukan masukan aslinya. Pengodean ulang mempertahankan nilai yang didukung, tetapi dapat mengubah urutan peta atau pilihan pengodean biner. Buka “Format dan ketepatan tipe” di atas untuk melihat sintaks pembungkus dan tipe yang tidak didukung.
