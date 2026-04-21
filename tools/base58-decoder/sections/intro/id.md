## Alat ini digunakan untuk apa

Gunakan alat ini untuk mendekode string Base58 atau file teks kembali ke byte
aslinya langsung di browser. Alat ini berguna ketika Anda ingin memeriksa data
yang disalin dari API, dompet, log, alur QR, atau proses impor dan ekspor tanpa
mengirimkan isinya ke server.

## Kapan perlu mengganti alfabet

Base58 tidak memiliki satu alfabet universal. Bitcoin, Flickr, dan Ripple
menggunakan urutan karakter yang berbeda. Jika sebuah nilai gagal divalidasi
atau terdekode menjadi hasil yang salah, ganti alfabet dan coba lagi dengan
format yang dipakai oleh sistem sumber.

## Hal yang perlu diperhatikan

Panel hasil menampilkan pratinjau UTF-8 ketika byte yang didekodekan bisa dibaca
sebagai teks. Untuk data biner atau konten non-teks, lebih aman mengunduh file
.bin agar byte asli tetap terjaga. Spasi dan baris baru pada input yang
ditempel akan diabaikan, sehingga nilai yang terpotong dari email, dokumen, atau
terminal tetap bisa didekodekan.
