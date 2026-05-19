## Apa itu hash teks atau file?

Fungsi hash mengubah teks atau byte file menjadi digest dengan panjang tetap. Masukan dan algoritma yang sama selalu menghasilkan digest yang sama, sehingga hash berguna saat Anda membutuhkan sidik jari yang dapat diulang tanpa mengunggah data pribadi.

## Kapan menggunakan alat ini

Gunakan alat ini untuk memverifikasi checksum unduhan, membandingkan apakah dua file identik, mencatat sidik jari cepat untuk cuplikan teks, atau mendiagnosis sistem yang menerbitkan digest SHA. Mengimpor file akan membuat hash langsung dari byte file, sedangkan mode teks membuat hash dari teks UTF-8 yang ditampilkan di editor.

## Memilih algoritma

SHA-256 adalah pilihan default yang kuat untuk pemeriksaan integritas baru. SHA-384 dan SHA-512 menyediakan digest SHA-2 yang lebih panjang saat sistem lain mengharapkan format tersebut. SHA-1 disertakan untuk perbandingan dengan sistem lama, tetapi tidak boleh digunakan untuk desain baru yang sensitif terhadap keamanan.

## Privasi dan batasan

Hashing berjalan secara lokal di browser Anda melalui Web Crypto, dan file tidak diunggah. Hash bukan enkripsi: hash tidak dapat melindungi rahasia dengan sendirinya, dan penyimpanan kata sandi memerlukan fungsi hashing kata sandi khusus dengan salt dan work factor.
