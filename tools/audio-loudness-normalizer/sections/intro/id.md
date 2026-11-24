## Normalisasi audio ke target LUFS

Samakan kenyaringan yang terdengar pada episode podcast, sulih suara, dan trek musik. Alat ini mengukur kenyaringan terintegrasi sepanjang rekaman, lalu menerapkan penyesuaian gain yang sama ke setiap kanal. Perbandingan level antara bagian pelan dan keras tetap terjaga. Pilih preset atau masukkan nilai LUFS yang dibutuhkan proyek Anda.

## Cara menormalisasi file audio

1. Pilih atau seret dan letakkan rekaman mono atau stereo. Format yang umum antara lain WAV, MP3, M4A, FLAC, dan OGG. Dukungan codec audio bergantung pada browser Anda.
2. Pilih target seperti −16 LUFS untuk podcast, −14 LUFS untuk musik, atau −23 LUFS untuk siaran. Ketentuan publikasi berbeda-beda. Jika ada spesifikasi pengiriman, masukkan targetnya sendiri.
3. Bandingkan hasil pengukuran sebelum dan sesudah normalisasi, dengarkan hasilnya, lalu unduh WAV 16-bit dengan laju sampel 48 kHz. Dekode, analisis, dan ekspor berlangsung di perangkat Anda.

## Apa bedanya LUFS dan true peak?

LUFS terintegrasi memperkirakan seberapa keras keseluruhan rekaman terdengar. Pengukuran ini memberi bobot menurut frekuensi dan memakai ambang kenyaringan untuk mengecualikan bagian yang sangat pelan. True peak, yang ditampilkan dalam dBTP, memperkirakan puncak sinyal saat direkonstruksi di antara sampel. Dua trek bisa memiliki puncak serupa dengan kenyaringan yang jauh berbeda. Menyamakan puncaknya saja sering kali membuat salah satu trek masih terdengar lebih pelan.

## Mengapa hasilnya lebih pelan dari target?

Lonjakan suara sesaat bisa mencapai batas −1 dBTP sebelum kenyaringan seluruh rekaman mencapai target. Jika itu terjadi, alat ini mengurangi gain dan menampilkan tingkat kenyaringan yang bisa dicapai. Jika ingin master yang lebih keras dengan ruang puncak yang sama, kendalikan puncak yang tinggi di editor audio sebelum menormalisasi file. File tanpa suara mungkin tidak memiliki nilai kenyaringan terintegrasi yang bisa diukur.
