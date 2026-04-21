## Apa itu ID penduduk Tiongkok?

Nomor ID penduduk Tiongkok terdiri dari 18 karakter dan mencakup kode alamat, tanggal lahir, kode urutan, serta digit pemeriksa. Validator ini memeriksa bagian-bagian tersebut secara offline dan membantu memahami struktur nomornya.

### Cara validasi bekerja

- Menghapus spasi dan tanda hubung lalu menormalkan karakter terakhir menjadi `X` huruf besar
- Mengharuskan tepat 18 karakter: 17 digit diikuti satu digit terakhir atau `X`
- Mencocokkan 6 digit pertama dengan dataset pembagian administratif tahun 2023 dan mengurai tanggal lahir 8 digit
- Menghitung ulang digit pemeriksa dari 17 digit pertama lalu membandingkannya dengan karakter terakhir

### Apa yang ditampilkan hasil

- Rincian wilayah: provinsi, kota, distrik/kabupaten, dan kode wilayah mentah
- Tanggal lahir, usia saat ini, kode urutan, dan gender yang diturunkan dari kode urutan
- ID yang sudah dinormalisasi beserta digit pemeriksa yang diharapkan dan yang aktual untuk penelusuran masalah

### Contoh

`110101199001010015` dapat dibaca seperti ini:

- `110101` -> Distrik Dongcheng, Beijing
- `19900101` -> tanggal lahir `1990-01-01`
- `001` -> kode urutan
- `5` -> digit pemeriksa

### Catatan penting

Alat ini hanya melakukan validasi struktur dan checksum secara offline. Nomor yang lolos pemeriksaan ini tidak membuktikan bahwa nomor tersebut terkait dengan identitas nyata atau dokumen yang masih aktif.

Nama wilayah didasarkan pada dataset pembagian administratif tahun 2023.
