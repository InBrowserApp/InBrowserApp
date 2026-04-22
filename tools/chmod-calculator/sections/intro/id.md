## Apa itu chmod?

`chmod` ("change mode") adalah perintah Unix/Linux untuk mengubah izin file dan direktori. Kalkulator ini membantu Anda berpindah antara izin numerik seperti `755`, izin simbolik seperti `rwxr-xr-x`, dan matriks kotak centang tanpa menghitungnya secara manual.

## Cara kerja izin numerik

Setiap digit mewakili satu peran: pemilik, grup, dan lainnya. Dalam setiap digit, `4` berarti baca, `2` tulis, dan `1` eksekusi. Jumlahkan nilainya untuk membentuk izin yang diinginkan: `7 = rwx`, `6 = rw-`, `5 = r-x`, dan `4 = r--`. Untuk direktori, bit eksekusi juga berarti Anda dapat masuk ke direktori tersebut.

## Contoh chmod yang umum

- `chmod 755 script.sh` memberi pemilik akses penuh dan membiarkan semua orang lain membaca serta mengeksekusi.
- `chmod 644 notes.txt` membuat file tetap bisa ditulis oleh pemilik, sementara yang lain hanya bisa membacanya.
- `chmod 600 .env` adalah pilihan umum untuk rahasia pribadi karena hanya pemilik yang dapat membaca atau menulis.
- `chmod 775 shared-folder` berguna untuk direktori tim ketika grup juga perlu membuat dan mengubah file.
