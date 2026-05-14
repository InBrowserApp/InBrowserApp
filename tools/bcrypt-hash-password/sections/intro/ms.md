## Apakah bcrypt?

bcrypt ialah algoritma hashing kata laluan yang direka untuk penyimpanan kata laluan. Ia menggabungkan kata laluan dengan salt rawak dan mengulangi kerja yang mahal berdasarkan faktor kos, supaya penyerang memerlukan lebih banyak masa untuk menguji setiap tekaan.

## Bila menggunakan alat ini

- Jana hash bcrypt untuk akaun ujian, skrip seed, atau persekitaran pembangunan setempat.
- Bandingkan cara faktor kos berbeza mengubah format output dan masa jalan.
- Cipta hash sedia disalin tanpa menghantar kata laluan ke pelayan.

## Cara memilih faktor kos

Nilai kos yang lebih tinggi lebih perlahan dan biasanya lebih selamat, tetapi ia juga menjadikan setiap percubaan log masuk lebih perlahan untuk aplikasi anda. Kos sekitar 10-12 lazim untuk sistem interaktif; nilai lebih tinggi boleh munasabah untuk aliran kerja admin sahaja atau volum rendah. Uji kos pada jenis perkakasan yang sama yang akan mengesahkan kata laluan.

## Perkara yang perlu diingat

- Setiap hash yang dijana menggunakan salt rawak baharu, jadi output berubah walaupun kata laluan dan kos kekal sama.
- Simpan hash bcrypt, bukan kata laluan asal.
- Gunakan bcrypt untuk kata laluan, bukan untuk checksum fail, tandatangan, atau hashing umum.
- Pastikan tingkah laku pengesahan kekal tetap dan elakkan mendedahkan sama ada akaun pengguna wujud.
