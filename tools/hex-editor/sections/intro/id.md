## Lihat dan edit file biner secara online

Buka atau letakkan file lokal di Editor Heksadesimal, atau pilih **Coba contoh** untuk melihat susunan byte. Gunakan alat ini untuk memeriksa header file, memeriksa angka ajaib seperti `89 50 4E 47` pada PNG, memeriksa byte yang tidak dapat dicetak, atau mengubah nilai yang diketahui pada posisi tertentu.

## Membaca offset, byte heksadesimal, dan ASCII

Offset di sebelah kiri adalah posisi byte pertama pada baris tersebut, dihitung mulai dari nol. Bagian tengah menampilkan setiap byte sebagai dua digit heksadesimal, dari `00` hingga `FF`. Kolom ASCII menampilkan karakter yang dapat dicetak untuk byte yang sama dan menggunakan titik untuk nilai lainnya. Misalnya, byte `48 65 6C 6C 6F` tampil sebagai `Hello`.

Masukkan offset heksadesimal seperti `1A` atau `0x1A` untuk langsung menuju byte pada offset 26. Gunakan kontrol halaman untuk menelusuri byte di sekitarnya. Editor membaca satu halaman pada satu waktu, sehingga Anda dapat memeriksa sebagian kecil file besar.

## Timpa byte dan simpan salinan

Pilih byte heksadesimal dan masukkan dua digit. Editor memperbarui karakter ASCII yang sesuai dan berpindah ke byte berikutnya. Gunakan tombol panah untuk berpindah antarbyte, serta **Urungkan** atau **Ulangi** untuk membatalkan atau menerapkan kembali perubahan. Menimpa byte tidak mengubah panjang file maupun posisi byte lainnya.

Pilih **Unduh salinan** untuk menyimpan hasilnya. File asli tetap tidak berubah, dan semua proses membaca dan mengedit berlangsung di browser Anda.
