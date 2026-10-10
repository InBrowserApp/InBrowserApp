## Baca teks dan log secara lokal

Buka file .txt, .text, atau .log untuk membacanya dengan nomor baris, ukuran teks yang dapat diatur, opsi pembungkusan baris, dan fokus membaca. Lompat ke baris tertentu, pindah ke awal atau akhir, atau gunakan Cari teks untuk menelusuri seluruh file. Pencarian bersifat literal dan membedakan huruf besar dan kecil; pencarian berikutnya dan sebelumnya berputar dari satu ujung file ke ujung lainnya.

## File besar dan baris panjang

Penampil menampilkan satu bagian setiap saat agar file besar tetap mudah dibaca. Semua bagian tetap dapat diakses, termasuk lanjutan baris yang sangat panjang. Pemilihan teks dan perintah Cari di browser mencakup bagian saat ini; fitur Cari teks pada penampil menelusuri seluruh file yang telah didekodekan, termasuk kecocokan yang melintasi batas bagian. Tidak ada batas ukuran file atau jumlah baris yang ditetapkan. Memori browser yang tersedia tetap menjadi batas praktis.

Baris kosong, tab, campuran penanda akhir baris CRLF/CR/LF, dan teks Unicode dipertahankan. Penanda akhir baris ditampilkan sebagai pergantian baris. Markup dan urutan escape terminal tetap berupa teks yang tidak dieksekusi. Beberapa karakter kontrol tidak memiliki bentuk yang terlihat; file yang mengandung karakter NUL akan menampilkan pemberitahuan file biner.

## Pilih pengodean yang tepat

Mode otomatis mengenali penanda urutan byte UTF-8 dan UTF-16, dan menggunakan UTF-8 ketat jika tidak ada penanda. Anda dapat memilih UTF-8, UTF-16 LE/BE, Windows-1252, Windows-1251, GB18030, atau Shift JIS. Kesalahan dekode menghentikan pratinjau, alih-alih diam-diam mengganti karakter yang tidak terbaca. Coba pengodean lain jika file tidak terbaca atau tampak kacau; penampil tidak dapat menentukan pengodean asli setiap file.

File diproses di perangkat Anda tanpa unggahan, sumber daya jarak jauh, atau penyimpanan otomatis. Menutup atau mengganti file mengakhiri sesi pembacaannya. Penampil ini tidak mengedit file, menafsirkan HTML atau perintah terminal, maupun memantau log secara langsung.
