## Apakah ID penduduk PRC?

Nombor ID penduduk PRC mempunyai 18 aksara dan merangkumi kod alamat, tarikh lahir, kod urutan serta digit semakan. Pengesah ini memeriksa bahagian tersebut secara luar talian dan membantu anda memahami struktur nombor itu.

### Cara pengesahan berfungsi

- Membuang ruang dan tanda sengkang serta menormalkan aksara terakhir kepada `X` huruf besar
- Memerlukan tepat 18 aksara: 17 digit diikuti digit terakhir atau `X`
- Memadankan 6 digit pertama dengan set data bahagian pentadbiran 2023 dan menghuraikan tarikh lahir 8 digit
- Mengira semula digit semakan daripada 17 digit pertama dan membandingkannya dengan aksara terakhir

### Apa yang dipaparkan oleh hasil

- Pecahan wilayah: negeri/provinsi, bandar, daerah dan kod wilayah asal
- Tarikh lahir, umur semasa, kod urutan dan jantina yang diperoleh daripada kod urutan
- ID yang dinormalkan bersama digit semakan yang dijangka dan sebenar untuk semakan lanjut

### Contoh

`110101199001010015` boleh dibaca seperti ini:

- `110101` -> Daerah Dongcheng, Beijing
- `19900101` -> tarikh lahir `1990-01-01`
- `001` -> kod urutan
- `5` -> digit semakan

### Nota penting

Alat ini hanya menjalankan pengesahan struktur dan checksum secara luar talian. Nombor yang lulus semakan ini tidak membuktikan bahawa ia berkaitan dengan identiti sebenar atau dokumen yang masih aktif.

Nama wilayah adalah berdasarkan set data bahagian pentadbiran 2023.
