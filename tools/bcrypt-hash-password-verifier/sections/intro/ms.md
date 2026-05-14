## Fungsinya

Sahkan sama ada kata laluan teks biasa sepadan dengan hash kata laluan bcrypt. Ini berguna apabila anda menyahpepijat kod log masuk, menyemak rekod pengguna yang diimport, atau mengesahkan bahawa migrasi kata laluan mengekalkan keserasian hash.

## Input Yang Diterima

Tampal hash bcrypt standard seperti `$2b$10$...` dan masukkan calon kata laluan yang ingin anda uji. Pengesah ini menerima awalan `$2a$`, `$2b$` dan `$2y$` dengan nilai kos daripada `04` hingga `31`.

## Membaca Keputusan

Keputusan yang sepadan bermaksud bcrypt menerima kata laluan untuk hash itu, termasuk salt dan kos yang dibenamkan dalam rentetan hash. Ketidakpadanan bermaksud kata laluan tidak lulus pengesahan; ia tidak membuktikan hash itu sendiri tidak selamat. Ralat hash tidak sah biasanya bermaksud awalan, kos, panjang, atau aksara base64 bcrypt tidak terbentuk dengan betul.

## Nota Privasi dan Keselamatan

- Pengesahan berjalan secara setempat dalam pelayar anda.
- Kata laluan dan hash tidak disimpan dalam storan setempat.
- bcrypt direka untuk penyimpanan kata laluan, bukan checksum fail serba guna.
- Gunakan alat ini untuk penyahpepijatan dan pengesahan, bukan sebagai satu-satunya audit bagi sistem autentikasi produksi.
