# Apa itu dekoder UUID?

Dekoder UUID menjelaskan struktur di dalam Universally Unique Identifier. Alat ini menormalkan format umum yang ditempel, memeriksa bahwa nilainya adalah UUID 128-bit, dan menampilkan versi, varian, byte heksadesimal mentah, serta representasi numerik yang siap disalin.

UUID sering diperlakukan sebagai string yang tidak perlu diurai, tetapi nibble versi menunjukkan cara pengidentifikasi itu dibuat. UUID versi 4 bersifat acak, versi 3 dan 5 adalah hash berbasis nama, dan versi berurutan waktu seperti 1, 6, dan 7 dapat membawa informasi stempel waktu.

## Kapan menggunakannya

Gunakan alat ini saat Anda perlu memeriksa pengidentifikasi dari log, basis data, API, trace, atau fixture pengujian. Alat ini berguna untuk memastikan apakah UUID bersifat acak atau berbasis waktu, mengonversinya ke desimal atau Base64 untuk sistem lain, dan mengenali apakah bidang node UUID v1 atau v6 mungkin mengekspos pengidentifikasi bergaya MAC.

Dekoder berjalan di browser Anda dan tidak mengirim nilai UUID ke server. Alat ini menerima UUID kanonis, nilai `urn:uuid:`, UUID bertanda kurung kurawal, input huruf besar, dan UUID heksadesimal 32 karakter tanpa tanda hubung.

## Hal yang perlu diperhatikan

Bidang versi dan varian UUID menggambarkan tata letak bit, bukan apakah pengidentifikasi itu benar-benar unik secara global dalam praktik. UUID yang terlihat valid masih bisa terduplikasi jika dibuat dengan buruk atau disalin secara tidak sengaja.

Untuk UUID versi 1 dan versi 6, bidang node dapat terlihat seperti alamat MAC. Generator modern dapat menyetel bit multicast dan memakai node acak sebagai gantinya, jadi perlakukan bidang itu sebagai pengidentifikasi node kecuali Anda mengendalikan generatornya.
