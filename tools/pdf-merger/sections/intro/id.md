# Gabungkan file PDF di browser Anda

Gunakan penggabung PDF ini saat Anda membutuhkan satu dokumen dari beberapa PDF sumber, seperti menggabungkan halaman hasil pindai, menyatukan formulir yang telah ditandatangani, atau mengemas laporan untuk dibagikan. Tambahkan dua file atau lebih, tinjau jumlah halamannya, lalu atur antrean sebelum membuat PDF akhir.

## Cara kerja urutan penggabungan

Alat ini menambahkan setiap halaman dari PDF pertama, lalu setiap halaman dari PDF berikutnya, dan terus berlanjut sesuai antrean. Anda dapat mengurutkan ulang file dengan kontrol panah, menyeret baris di desktop, menghapus kesalahan, dan melihat pratinjau setiap file sumber sebelum menggabungkan.

## Privasi dan penanganan file

Semua parsing dan penggabungan berjalan secara lokal di browser Anda dengan `pdf-lib` dan worker latar belakang. File Anda tidak diunggah ke InBrowser.App, dan tautan unduhan yang dihasilkan hanya ada dalam sesi browser saat ini.

## Batasan yang perlu diketahui

PDF yang terenkripsi atau rusak tidak dapat digabungkan dengan andal. Jika file dilindungi oleh kata sandi pemilik, hapus pembatasan tersebut terlebih dahulu dan tambahkan lagi PDF yang sudah dibuka kuncinya. File yang sangat besar mungkin membutuhkan waktu lebih lama karena browser harus menyalin setiap halaman ke dokumen baru.
