## Apa itu nomor PPN Uni Eropa?

Nomor identifikasi PPN diterbitkan oleh negara anggota Uni Eropa kepada bisnis yang terdaftar untuk Pajak Pertambahan Nilai. Nomor ini diawali dengan kode negara dua huruf (misalnya, `BE` untuk Belgia atau `EL` untuk Yunani), diikuti oleh urutan digit khusus negara dan kadang-kadang huruf. Otoritas pajak menggunakannya untuk melacak perdagangan lintas batas dan klaim pengembalian dana, sehingga kesalahan pada faktur, kontrak, atau catatan pengadaan dapat dengan mudah memblokir pembayaran atau memicu audit.

## Apa yang sebenarnya diperiksa oleh alat ini

Pemeriksa ini menjalankan tiga validasi independen, semuanya di browser Anda:

1. **Kode negara** — dua huruf awal harus sesuai dengan negara anggota Uni Eropa yang mengikuti skema PPN (termasuk kode khusus `EL` yang digunakan untuk Yunani).
2. **Format** — karakter yang tersisa harus sesuai dengan format PPN yang didokumentasikan oleh negara tersebut. Misalnya, PPN Belgia terdiri tepat dari sepuluh digit, PPN Austria diawali dengan `U` diikuti delapan digit, dan PPN Belanda memiliki bentuk `<sembilan digit>B<dua digit>`.
3. **Checksum** — jika aturan PPN negara memiliki checksum deterministik (Austria, Belgia, Denmark, Finlandia, Prancis, Jerman, Italia, Belanda, Polandia, Portugal, Spanyol, Swedia), digit atau huruf terakhir dihitung ulang dan dibandingkan.

Nomor yang lolos ketiganya berarti secara sintaksis terbentuk dengan baik. Itu tidak sama dengan memastikan bahwa bisnis tersebut saat ini terdaftar — untuk itu Anda tetap memerlukan layanan VIES Komisi Eropa atau otoritas pajak setempat. Alat ini paling baik digunakan sebelum pemeriksaan akhir tersebut, untuk menangkap salah ketik, digit yang tertukar, dan kesalahan salin-tempel yang membuat kueri VIES gagal karena alasan yang salah.

## Hal-hal umum yang bisa dideteksi

- Nomor yang sekilas terlihat benar tetapi kurang satu negara (misalnya, diawali dengan `US` atau `UK`).
- Angka nol di depan yang dipangkas oleh spreadsheet, menghasilkan nomor yang kurang satu digit.
- Spasi, titik, atau tanda hubung yang disisipkan oleh sistem penagihan — alat ini menormalisasinya dan memeriksa hasilnya.
- Kebingungan klasik antara `GR` Yunani dengan `EL` PPN, yang langsung ditolak oleh pemeriksaan format.

## Apa yang ditampilkan oleh kartu hasil

Selain lencana sederhana valid/tidak valid, hasilnya menguraikan negara, nomor ternormalisasi, format yang diharapkan negara, dan apakah checksum lulus, gagal, atau dilewati karena negara tidak menerbitkannya. Detail itu berguna ketika Anda perlu menjelaskan penolakan — "format benar, checksum tidak cocok" jauh lebih dapat ditindaklanjuti daripada sekadar "tidak valid."

## Privasi

Setiap pemeriksaan dijalankan secara lokal di browser Anda. Tidak ada yang dikirim ke server, dicatat, atau disimpan di mana pun selain di localStorage browser Anda sendiri (untuk input terakhir yang Anda ketik, sehingga tetap ada setelah halaman dimuat ulang). Anda dapat menempelkan nomor PPN pelanggan tanpa khawatir tentang ke mana informasi itu berakhir.
