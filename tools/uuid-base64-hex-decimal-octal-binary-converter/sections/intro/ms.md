## Perkara yang ditukar oleh alat ini

Penukar ini menganggap UUID sebagai nilai 128-bit yang sebenar dan memastikan
perwakilan lazimnya kekal segerak. Tampal UUID, nilai Base64, rentetan
heksadesimal, integer perpuluhan, nilai perlapanan, atau nilai perduaan, dan
format lain akan dikemas kini secara setempat dalam pelayar anda.

## Cara membaca format

Medan UUID menunjukkan bentuk kanonik dengan sempang. Heksadesimal ialah 16
bait yang sama sebagai 32 digit heks huruf kecil. Base64 ialah Base64 berpad
standard untuk 16 bait mentah, bukan Base64 untuk aksara teks UUID.
Perpuluhan, perlapanan, dan perduaan menunjukkan UUID sebagai satu integer
128-bit tidak bertanda; output perduaan diisi di kiri sehingga semua 128 bit
supaya sifar awalan kekal kelihatan.

## Perkara yang perlu diperhatikan

Nilai di luar julat UUID 128-bit ditolak. Input Base64 mesti menyahkod kepada
tepat 16 bait. Penukar ini menerima variasi tampalan lazim seperti UUID huruf
besar, awalan `urn:uuid:`, kurungan kurawal, UUID 32-heks padat, ruang kosong
di sekeliling nilai angka yang panjang, dan Base64 selamat URL. Tiada apa-apa
dimuat naik semasa anda menukar atau menjana UUID sampel.
