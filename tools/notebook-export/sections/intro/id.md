## Ekspor notebook Jupyter tersimpan

Buka notebook IPYNB dan pilih HTML, Markdown, atau kode. HTML dan Markdown mempertahankan urutan sel yang tersimpan, termasuk keluaran tersimpan yang didukung. Semuanya tetap di browser Anda. Tidak ada kernel, kode, atau runtime widget yang dimulai.

## Pilih keluaran yang sesuai

HTML adalah salinan baca mandiri dengan teks yang dapat dipilih, gambar yang disertakan dan didukung, serta tabel yang dapat dibaca. Markdown menyediakan konten dokumen yang dapat digunakan kembali; tabel dapat berisi HTML yang aman dan gambar menggunakan URL data tersemat, yang tidak ditampilkan oleh sebagian aplikasi Markdown. Tata letak dan pemformatan asli dapat berubah.

Ekspor kode mempertahankan urutan sel kode dan menghilangkan Markdown, sel mentah, serta keluaran tersimpan. Bahasa notebook yang dikenali menentukan ekstensi skrip; bahasa yang tidak dikenal menggunakan TXT. Perintah magic notebook dan sintaks shell tetap seperti aslinya, sehingga kode hasil ekspor mungkin memerlukan penyesuaian manual atau kernel notebook asal. Notebook tanpa sel kode menghasilkan file kode kosong.

## Hasil tersimpan dan kompatibilitas

Konverter ini membaca notebook format 4. Hasil berasal dari file tersimpan dan mungkin sudah tidak mutakhir. Konten kaya yang tidak didukung dan gambar yang tidak tersedia ditandai. Sumber daya jarak jauh tidak diambil; skrip, widget, audio, dan video tidak dijalankan. LaTeX tetap berupa teks sumber, dan sel mentah atau tidak dikenal ditampilkan sebagai teks yang dapat dibaca dalam ekspor dokumen.

Sumber daya browser menentukan batas praktis; tidak ada batas tetap untuk ukuran file atau jumlah sel. Untuk memeriksa notebook asli, gunakan [Penampil Notebook Jupyter](/tools/notebook-viewer/).
