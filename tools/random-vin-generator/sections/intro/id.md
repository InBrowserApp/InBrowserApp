## Buat VIN acak untuk pengujian

Atur jumlah dari `1` hingga `1000`, lalu pilih **Buat**. Setiap baris berisi satu nomor identifikasi kendaraan (VIN) sepanjang 17 karakter. Pilih **Salin semua** untuk menempelkan seluruh daftar ke formulir pengujian atau spreadsheet, atau **Unduh TXT** untuk menyimpan file teks dengan satu VIN per baris.

## Membaca VIN dan digit ceknya

Tiga karakter pertama membentuk kode identifikasi pabrikan. Karakter keempat hingga kedelapan menjelaskan kendaraan, dan karakter kesembilan adalah digit cek. Delapan karakter terakhir membentuk bagian identifikasi kendaraan. Huruf `I`, `O`, dan `Q` tidak digunakan agar tidak tertukar dengan angka. Digit cek dihitung dari 16 karakter lainnya dan dapat berupa angka dari `0` hingga `9` atau `X`. Misalnya, pada `1M8GDM9AXKP042788`, karakter kesembilannya adalah `X`.

## Gunakan VIN contoh dalam data uji

Gunakan VIN yang dibuat untuk menguji kolom wajib, impor massal, atau validasi format dan digit cek. Untuk menguji penolakan, ubah hanya karakter kesembilan menjadi angka lain, lalu kirim kembali nilainya. Generator ini menghasilkan VIN sintetis, sehingga bagian yang tampak seperti kode pabrikan, tahun model, atau nomor seri harus dianggap sebagai data contoh. Untuk pendaftaran, pencarian suku cadang, atau riwayat kendaraan, gunakan VIN yang tercatat pada kendaraan atau dokumennya.
