## Apakah itu pengesahan e-mel?

Pengesahan e-mel memeriksa sama ada sesuatu alamat mematuhi peraturan sintaks biasa untuk bahagian setempat, tanda `@`, label domain dan domain aras teratas. Ia berguna untuk menguji borang, membersihkan data contoh dan mengesan kesilapan taip yang jelas sebelum dihantar.

### Apa yang diperiksa oleh pengesah ini

- Satu `@` yang memisahkan bahagian setempat dan domain
- Had panjang untuk keseluruhan alamat, bahagian setempat dan domain
- Aksara yang dibenarkan, kedudukan titik, peraturan sengkang dan struktur TLD
- Hasil ternormal dengan domain huruf kecil untuk memudahkan perbandingan

### Contoh

- Sah: `name@example.com`
- Sah: `first.last+news@example.co.uk`
- Tidak sah: `name..dots@example.com`
- Tidak sah: `user@-example.com`

Domain antarabangsa perlu dimasukkan dalam bentuk Punycode ASCII, contohnya `user@xn--bcher-kva.example`.

### Apa yang tidak diperiksa oleh alat ini

- Sama ada peti mel benar-benar wujud atau boleh menerima e-mel
- Semakan DNS, MX, SMTP atau penyedia e-mel sementara
- Sama ada sesuatu laman akan menerima alamat itu mengikut peraturan perniagaannya sendiri
