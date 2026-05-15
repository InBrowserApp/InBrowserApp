## Fungsi alat ini

PDF Info Viewer membuka PDF di browser Anda dan merangkum detail file
dasarnya, versi header PDF, jumlah halaman, ukuran halaman pertama, status
enkripsi, dan metadata dokumen seperti judul, penulis, subjek, kata kunci,
pembuat, producer, dan tanggal. Alat ini ditujukan untuk pemeriksaan cepat
sebelum membagikan, mengarsipkan, men-debug, atau memproses dokumen.

## Kasus penggunaan yang baik

- Memeriksa apakah PDF memiliki jumlah halaman dan ukuran halaman yang
  diharapkan sebelum mengirimkannya ke printer, klien, atau workflow otomatis.
- Memeriksa bidang judul, penulis, producer, tanggal pembuatan, dan tanggal
  perubahan yang dapat memengaruhi pencarian, manajemen arsip, atau audit
  dokumen.
- Mendeteksi PDF terenkripsi sejak awal, sehingga Anda tahu mengapa alat lain
  mungkin tidak dapat mengekstrak teks, menggabungkan halaman, atau menulis
  ulang metadata tanpa kata sandi.
- Mengekspor ringkasan JSON yang ringkas untuk tiket dukungan, inventaris
  aset, atau laporan bug yang dapat direproduksi.

## Catatan privasi

PDF dibaca secara lokal di browser Anda dan tidak diunggah oleh alat ini.
Metadata masih dapat mengungkap nama penulis, perangkat lunak, stempel waktu,
judul internal, atau detail workflow yang disematkan saat dokumen dibuat.
Tinjau bidang tersebut sebelum menerbitkan PDF secara eksternal atau
melampirkannya ke laporan masalah publik.

## Batasan

Beberapa PDF yang terenkripsi atau rusak hanya menampilkan nama file, ukuran,
dan versi header. Viewer ini tidak menghapus metadata, mendekripsi file,
memperbaiki dokumen rusak, atau memvalidasi tata letak visual. Gunakan editor
PDF atau sanitizer khusus saat Anda perlu mengubah dokumen sebelum
membagikannya.
