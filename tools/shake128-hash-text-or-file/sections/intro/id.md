## Apa itu SHAKE128 (FIPS 202)?

SHAKE128 (FIPS 202) adalah fungsi keluaran yang dapat diperluas (XOF) dalam keluarga SHA-3. Berbeda dari fungsi hash dengan panjang tetap, algoritme ini dapat menghasilkan jumlah bit keluaran berapa pun sambil tetap menawarkan kekuatan keamanan 128 bit. Algoritme ini distandardisasi oleh NIST dalam FIPS 202 dan dibangun di atas konstruksi spons Keccak.

Fleksibilitas ini penting ketika protokol, format file, atau aturan checksum internal memerlukan panjang digest tertentu. Dalam alat ini Anda dapat meng-hash teks biasa atau file yang diunggah dan memilih panjang output dalam bit, selama nilainya kelipatan 8.

Penggunaan umum meliputi hashing protokol, derivasi kunci, digest kriptografis dengan panjang variabel, dan alur kerja integritas data di mana input serta panjang output yang sama harus selalu menghasilkan hasil yang sama.
