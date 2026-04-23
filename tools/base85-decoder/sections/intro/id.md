## Mengapa decoding Base85 penting

Base85 muncul ketika data biner harus melewati sistem yang hanya menerima teks dengan overhead yang lebih kecil daripada heksadesimal atau Base64. Anda bisa menemukannya pada aliran PostScript atau PDF, payload Z85 dari ZeroMQ, hasil tangkapan debugging, ekspor arsip, dan alat yang membutuhkan karakter yang dapat dicetak alih-alih byte biner mentah.

## Apa yang dibantu oleh decoder ini

Alat ini mengubah teks ASCII85 atau Z85 kembali menjadi byte aslinya langsung di browser. Anda dapat menempelkan data yang sudah dikodekan, mengimpor file, mengganti alfabet agar sesuai dengan sistem sumber, melihat pratinjau hasil decode, dan mengunduh biner yang dipulihkan tanpa mengirim apa pun ke server.

## Hal yang perlu diperhatikan

- ASCII85 dan Z85 tidak bisa saling menggantikan. Memilih alfabet yang salah biasanya menyebabkan error decode atau output yang rusak.
- Base85 adalah format encoding, bukan enkripsi. Hasil decode bisa berupa teks biasa, konten terkompresi, atau data biner arbitrer.
- Z85 memerlukan grup lengkap berisi 5 karakter, sedangkan ASCII85 juga dapat menyertakan delimiter dan singkatan seperti `z` untuk blok nol.
