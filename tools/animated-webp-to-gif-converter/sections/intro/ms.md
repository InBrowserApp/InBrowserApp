## Tukar WebP beranimasi kepada GIF

WebP beranimasi menyimpan beberapa bingkai dalam satu fail `.webp`. Tukar
kepada GIF apabila aplikasi sembang, laman dokumentasi atau destinasi lain
memerlukan animasi dalam format GIF. WebP beranimasi dengan pemampatan lossy
atau lossless boleh ditukar, dan pemprosesan berlaku pada peranti anda.

### Cara menukar WebP beranimasi kepada GIF

1. Pilih **Pilih fail** atau lepaskan WebP beranimasi ke dalam alat.
2. Pilih **Cipta GIF** untuk menukar bingkai sambil mengekalkan dimensi asal.
3. Pilih **Main** untuk memeriksa GIF, kemudian **Muat turun GIF** untuk menyimpannya.

### Apa yang berlaku pada tempoh bingkai dan ulangan?

Setiap bingkai mengekalkan tempoh paparannya sendiri, dibundarkan kepada unit
10 ms mengikut format GIF dengan tempoh minimum 20 ms semasa dimainkan.
Contohnya, bingkai 100 ms yang diikuti bingkai 250 ms mengekalkan kedua-dua
tempoh tersebut. Jika WebP dimainkan beberapa kali mengikut tetapan, GIF
mengekalkan jumlah main baliknya. WebP yang berulang tanpa henti menghasilkan
GIF yang juga berulang tanpa henti.

### Bagaimanakah GIF mengendalikan kelutsinaran dan warna?

GIF menggunakan palet warna terindeks dengan maksimum 256 entri setiap
bingkai dan satu entri lutsinar. WebP boleh menyimpan kelutsinaran separa, jadi
bayang separa lutsinar dan tepi yang dilicinkan mungkin kelihatan berbeza dalam
GIF. Bingkai yang banyak warna juga boleh menunjukkan jalur warna. Semak
pratonton dengan latar belakang yang akan anda gunakan.

### Soalan lazim

#### Bolehkah saya menukar WebP pegun?

Alat ini memerlukan bingkai animasi. Sambungan `.webp` digunakan untuk imej pegun
dan imej beranimasi. Untuk membina animasi daripada beberapa imej pegun, gunakan
[Pembuat GIF](/ms/tools/gif-maker/).

#### Mengapakah fail GIF lebih besar daripada WebP?

WebP memampatkan warna dan kawasan yang berubah antara bingkai dengan cekap.
GIF boleh jadi lebih besar walaupun dimensi dan tempoh paparan sama. Jika
destinasi mengehadkan saiz muat naik, semak saiz fail di sisi pratonton.

### Alat animasi berkaitan

Gunakan [Penukar GIF kepada WebP Beranimasi](/ms/tools/gif-to-animated-webp-converter/)
untuk penukaran sebaliknya, atau [Penukar APNG kepada GIF](/ms/tools/apng-to-gif-converter/)
jika sumbernya PNG beranimasi.
