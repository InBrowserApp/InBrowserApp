Koleksi alat hash menghimpunkan utiliti hashing yang telah dipindahkan supaya anda boleh memilih algoritma yang betul sebelum membuka alat tertentu. Ia merangkumi digest fail harian, semakan keserasian legasi, pengesahan mesej berkunci, rentetan Subresource Integrity, hashing kata laluan, pengesahan kata laluan, dan checksum bukan kriptografi yang pantas.

## Bila menggunakan alat ini

Gunakan alat digest kriptografi apabila anda memerlukan cap jari yang boleh diulang untuk teks atau fail, seperti membandingkan arkib yang dimuat turun dengan checksum SHA-256 yang diterbitkan. Gunakan HMAC apabila hasilnya mesti membuktikan bahawa seseorang yang mempunyai rahsia dikongsi telah mencipta atau meluluskan mesej tersebut. Gunakan Argon2, bcrypt, PBKDF2, atau scrypt untuk aliran kerja kata laluan dan derivasi kunci, apabila kos boleh dikonfigurasi lebih penting daripada kelajuan mentah.

## Memilih dengan selamat

Tidak setiap hash sesuai untuk keselamatan. MD4, MD5, dan SHA-1 berguna untuk sistem legasi dan semakan keserasian, tetapi tidak patut digunakan untuk reka bentuk integriti baharu yang sensitif terhadap keselamatan. CRC, Adler-32, MurmurHash, CityHash, dan xxHash ialah checksum atau hash pengelompokan yang pantas, bukan tandatangan kalis usik. Apabila anda tidak pasti, pilih SHA-256 untuk checksum awam, HMAC-SHA-256 untuk pengesahan berkunci, dan Argon2id atau bcrypt untuk penyimpanan kata laluan.

## Privasi dan aliran kerja

Alat individu dalam koleksi ini berjalan dalam pelayar. Teks dan fail diproses secara setempat oleh alat yang dipilih melainkan alat itu secara jelas mendokumenkan tingkah laku carian awam, yang tidak diperlukan oleh alat hash. Untuk bahan sensitif, kosongkan nilai yang dijana selepas digunakan dan elakkan menampal rahsia ke dalam sesi pelayar yang dikongsi atau dirakam.
