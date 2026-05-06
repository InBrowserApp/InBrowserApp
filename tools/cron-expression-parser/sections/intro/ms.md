## Fahami Jadual Cron Sebelum Anda Melaksanakannya

Ungkapan cron memang ringkas, tetapi kesilapan kecil pada medan boleh menjalankan tugas jauh lebih kerap, atau jauh lebih jarang, daripada yang dimaksudkan. Penghurai ini mengesahkan ungkapan dalam pelayar anda, menerangkan jadual dalam bahasa mudah, memecahkan setiap medan, dan mempratonton masa pelaksanaan akan datang.

### Bila Perlu Menggunakannya

- Semak jadual pelaksanaan, sandaran, pembersihan, atau pemberitahuan sebelum menambahkannya pada pelayan, sistem CI, atau pelaksana tugas.
- Bandingkan ungkapan cron yang disalin dengan jadual yang sebenarnya anda jangkakan.
- Ajar atau nyahpepijat sintaks cron dengan mengubah satu medan pada satu masa dan melihat penjelasan dikemas kini.

### Format Yang Disokong

Alat ini menyokong ungkapan cron Unix lima medan standard: minit, jam, hari dalam bulan, bulan, dan hari dalam minggu. Ia juga menerima ungkapan enam medan dengan saat di hadapan untuk penjadual yang menyokong ketepatan peringkat saat.

### Membaca Hasilnya

Ringkasan memberikan penerangan dalam bahasa biasa, manakala jadual medan menunjukkan cara ungkapan mentah dipecahkan. Masa pelaksanaan akan datang menggunakan zon waktu setempat pelayar anda, jadi bandingkannya dengan zon waktu yang digunakan oleh penjadual yang akan menjalankan tugas tersebut.

### Nota

- Nilai hari dalam minggu lazimnya menggunakan `0` atau `7` untuk Ahad, dan nama seperti `MON` atau `FRI` juga diterima.
- Nama bulan seperti `JAN` atau `DEC` boleh menjadikan jadual produksi lebih mudah disemak.
- Jika penjadual anda menggunakan dialek cron yang berbeza, sahkan token khas seperti `?`, `L`, `W`, atau `#` dalam dokumentasi penjadual itu sendiri.
