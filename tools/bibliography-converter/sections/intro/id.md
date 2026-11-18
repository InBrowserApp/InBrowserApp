## Kapan saya sebaiknya menggunakan BibTeX, RIS, atau CSL JSON?

Pilih format yang dapat diimpor oleh aplikasi yang akan Anda gunakan.

- **BibTeX (`.bib`)** umum digunakan untuk proyek LaTeX di Overleaf atau di editor lokal.
- **RIS (`.ris`)** cocok untuk memindahkan referensi dari basis data atau pengelola referensi lain ke Zotero atau EndNote.
- **CSL JSON (`.json`)** memuat data referensi terstruktur untuk pemroses sitasi dan alat lain yang menerima data Citation Style Language.

## Bagaimana cara mengonversi dan memeriksa referensi?

Tempel referensi atau pilih **Buka file**. Biarkan **Format input** pada **Deteksi otomatis**, atau pilih formatnya sendiri jika deteksi gagal. Pilih **Format output**, klik **Konversi dan periksa**, lalu salin hasilnya atau unduh filenya. Konversi berlangsung di browser Anda.

Misalnya, buka file RIS hasil ekspor dari Zotero, pilih BibTeX, lalu unduh file `.bib` untuk proyek Overleaf Anda. Jika yang Anda miliki hanya daftar pustaka terformat yang disalin dari Word, ekspor dulu data referensi dari pengelola referensi yang membuatnya. Untuk mengimpor file hasil konversi ke Zotero, ikuti [panduan impor Zotero](https://www.zotero.org/support/kb/importing_standardized_formats).

## Apa arti kemungkinan duplikat?

Laporan mengelompokkan entri dengan DOI yang sama, termasuk DOI yang ditulis sebagai tautan `doi.org`. Jika DOI tidak ada, alat ini juga dapat mencocokkan entri berdasarkan judul, tahun terbit, serta nama keluarga dan inisial nama depan penulis pertama. Nomor entri mengikuti urutan pada input. Pilih **Coba contoh** untuk melihat bagaimana dua entri untuk artikel yang sama ditampilkan dalam laporan. Tinjau setiap kelompok sebelum menggabungkannya di pengelola referensi Anda. File unduhan memuat semua entri.

## Bidang data apa yang dipertahankan?

Bidang umum seperti judul, penulis, tahun terbit, dan DOI biasanya dipertahankan saat berganti format. Bidang khusus dapat diabaikan, dan file BibTeX baru mungkin menggunakan kunci sitasi yang berbeda untuk menghindari benturan. Simpan file ekspor asli jika Anda memerlukan detail tersebut. Untuk memeriksa duplikat sekaligus mempertahankan bidang data asli, pilih format input dan output yang sama.
