## Periksa data binari API

CBOR dan MessagePack ialah format pensirialan binari yang padat untuk data berstruktur. Gunakan penukar ini untuk memeriksa respons API, mesej WebSocket atau nilai cache sebagai JSON, atau menghasilkan data binari daripada JSON untuk penyahpepijatan. Semuanya diproses dalam pelayar anda; input tidak dimuat naik atau disimpan.

## Kodkan JSON atau nyahkod bait

Pilih format binari dan arah penukaran. Untuk mengekod, masukkan JSON dan pilih Hex, Base64 atau Base64URL bagi output. Untuk menyahkod, tampal bait dan pilih pengekodan inputnya. Menukar pengekodan input akan mentafsir semula teks yang sudah ada dalam editor.

Buka fail JSON apabila mengekod, atau fail mentah `.cbor`, `.msgpack` atau `.bin` apabila menyahkod. Teks yang dikodkan seperti Hex atau Base64 hendaklah ditampal ke dalam editor. Tukar, kemudian salin teks yang dipaparkan atau muat turun hasilnya. Muat turun binari mengandungi bait sebenar dan boleh diimport semula.

## Kekalkan nilai dan fahami hadnya

Literal integer mengekalkan setiap digit dalam julat 64 bit yang disokong oleh format tersebut. Nilai yang tidak dapat diwakili oleh JSON, seperti medan binari, tag CBOR dan sambungan MessagePack, dipaparkan sebagai pembungkus berjenis yang jelas. Aktifkan JSON lanjutan untuk mengekod pembungkus tersebut kembali kepada binari; biarkannya dimatikan untuk objek JSON biasa yang kebetulan menggunakan kunci pembungkus.

Contohnya, apabila JSON lanjutan diaktifkan, `{"id":{"$integer":"9007199254740993"},"data":{"$binary":"AQI="}}` mengekod satu integer tepat dan dua bait binari.

Setiap penukaran mengendalikan satu nilai, dengan had input 1 MiB. Bait JSON berformat mengira JSON yang telah diformat dan dipaparkan, bukan input asal. Pengekodan semula mengekalkan nilai yang disokong tetapi mungkin menukar susunan peta atau pilihan pengekodan binari. Buka “Format dan pemeliharaan jenis” di atas untuk sintaks pembungkus dan jenis yang tidak disokong.
