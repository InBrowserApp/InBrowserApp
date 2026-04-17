## Apakah chmod?

`chmod` ("change mode") ialah arahan Unix/Linux untuk menukar kebenaran fail dan direktori. Kalkulator ini membolehkan anda bertukar antara kebenaran bernombor seperti `755`, kebenaran simbolik seperti `rwxr-xr-x`, dan matriks kotak semak tanpa perlu mengira secara manual.

## Bagaimana kebenaran bernombor berfungsi

Setiap digit mewakili satu peranan: pemilik, kumpulan, dan lain-lain. Dalam setiap digit, `4` bermaksud baca, `2` bermaksud tulis, dan `1` bermaksud laksana. Jumlahkan nilainya untuk membina kebenaran yang anda mahu: `7 = rwx`, `6 = rw-`, `5 = r-x`, dan `4 = r--`. Untuk direktori, bit laksana juga membenarkan anda masuk ke dalam direktori.

## Contoh chmod yang biasa

- `chmod 755 script.sh` memberi pemilik akses penuh dan membenarkan orang lain membaca serta melaksanakan.
- `chmod 644 notes.txt` memastikan fail masih boleh ditulis oleh pemilik, manakala orang lain hanya boleh membacanya.
- `chmod 600 .env` ialah pilihan biasa untuk rahsia peribadi kerana hanya pemilik boleh membaca atau menulis.
- `chmod 775 shared-folder` berguna untuk direktori pasukan apabila kumpulan juga perlu mencipta dan mengubah suai fail.
