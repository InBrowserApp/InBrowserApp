# Penjana Kunci PGP

Gunakan alat ini untuk mencipta pasangan kunci OpenPGP terus dalam pelayar anda. Ia menghasilkan kunci awam berperisai, kunci peribadi, sijil pembatalan, ID kunci, dan cap jari supaya anda boleh menyediakan e-mel tersulit, penyulitan fail, tandatangan keluaran, atau aliran kerja pemulihan akaun tanpa menghantar bahan kunci ke pelayan.

## Bila menggunakannya

Kunci PGP berguna apabila anda memerlukan kriptografi asimetri: orang lain menggunakan kunci awam anda untuk menyulitkan data untuk anda atau mengesahkan tandatangan, manakala kunci peribadi anda menyahsulit data dan mencipta tandatangan. Penjana berasaskan pelayar memudahkan sesi persediaan ringkas, demo, atau aliran kerja setempat apabila anda mahukan hasil dengan segera.

## Cara menjana pasangan kunci

Masukkan nama, e-mel, atau kedua-duanya supaya kunci mempunyai ID pengguna yang mudah dikenali. Tambah ulasan pilihan jika anda mahu mengasingkan kunci kerja, projek, atau tandatangan keluaran. Pilih ECC untuk perisian OpenPGP moden, atau RSA apabila anda memerlukan keserasian dengan alat yang lebih lama. Frasa laluan adalah pilihan, tetapi sangat disyorkan untuk mana-mana kunci peribadi yang anda mahu simpan.

## Jenis kunci dan tamat tempoh

ECC menggunakan Curve25519 dan menjadi lalai kerana ia padat dan pantas. RSA tersedia pada 2048, 3072, dan 4096 bit untuk keserasian. Tamat tempoh ditetapkan dalam hari; gunakan 0 hanya untuk kunci yang anda urus secara aktif dan boleh batalkan. Tempoh tamat yang lebih pendek mengurangkan risiko jangka panjang dan memudahkan tabiat penggiliran.

## Mengendalikan kunci peribadi dengan selamat

Muat turun kunci awam, kunci peribadi, dan sijil pembatalan sebagai fail berasingan. Sandarkan kunci peribadi dalam pengurus kata laluan tersulit atau storan luar talian yang selamat, dan simpan sijil pembatalan di tempat berasingan supaya anda boleh menghentikan penggunaan kunci jika kunci peribadi hilang atau terdedah. Sebelum menerbitkan kunci awam, bandingkan cap jari melalui saluran yang dipercayai.
