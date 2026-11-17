## Buka rekaman HAR

Ekspor file HAR (HTTP Archive) dari panel Jaringan browser setelah merekam permintaan yang ingin Anda periksa. Buka atau letakkan file `.har` atau `.json` di sini, atau muat contoh. Batas file adalah 20 MiB dan 20.000 entri.

## Temukan permintaan lambat atau tidak berhasil

Cari berdasarkan URL, metode, status, atau tipe MIME, lalu urutkan menurut waktu mulai, durasi, atau ukuran transfer. Permintaan menggunakan skala waktu yang sama, dihitung dari permintaan paling awal. Pilih salah satu untuk memeriksa header, cookie, parameter, isi, dan fase waktu.

Filter gagal mencakup status 0, 4xx, dan 5xx. Status 0 berarti tidak ada respons HTTP yang tercatat; filter 3xx mencakup respons cache 304. TLS merupakan bagian dari waktu koneksi.

## Baca data yang tercatat

Pemrosesan berlangsung di browser Anda. Detail yang tersedia bergantung pada hasil ekspor. Ukuran yang tidak diketahui dikecualikan dari total; rentang rekaman tidak tersedia jika ada durasi permintaan yang tidak tercatat. Waterfall tetap menggunakan waktu mulai tercatat dan waktu selesai yang diketahui.

Pratinjau isi mempertahankan teks yang tercatat. Pratinjau dan salinannya, serta nilai tiap kolom, dibatasi hingga 100.000 karakter. Isi terenkode tetap terenkode.
