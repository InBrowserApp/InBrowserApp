## Cara melihat histogram gambar

Pilih atau seret dan lepas foto, tangkapan layar, atau ilustrasi untuk melihat histogram di samping gambar. Anda juga dapat mencoba foto contoh. Mulai dari **Kecerahan** untuk melihat sebaran nada secara keseluruhan, lalu beralih ke **RGB** untuk membandingkan merah, hijau, dan biru pada skala yang sama. Pilih satu saluran untuk memeriksanya lebih rinci.

## Cara membaca bayangan, nada tengah, dan sorotan

Sumbu horizontal membentang dari 0 (paling gelap) hingga 255 (paling terang). Bayangan berada di kiri, nada tengah di tengah, dan sorotan di kanan. Batang yang lebih tinggi menunjukkan lebih banyak piksel pada tingkat tersebut. Arahkan penunjuk ke grafik, ketuk grafik, atau gunakan tombol panah pada penggeser tingkat untuk mengetahui jumlah piksel yang tepat.

Lonjakan di salah satu ujung bisa menandakan hilangnya detail di area bayangan atau sorotan. Misalnya, lonjakan pada tingkat 255 di saluran merah menunjukkan kemungkinan detail terpotong pada saluran tersebut, meskipun histogram kecerahan masih menyisakan ruang di sisi kanan. Latar belakang putih murni juga bisa menimbulkan lonjakan di ujung grafik, jadi periksa pratinjau gambar untuk melihat penyebabnya. **Bayangan** dan **Sorotan** masing-masing menunjukkan persentase piksel yang dianalisis dengan nilai tepat 0 dan 255.

## Kapan menggunakan skala logaritmik

Gunakan **Linear** agar tinggi batang berbanding lurus dengan jumlah piksel. Coba **Logaritmik** ketika area luas dengan satu warna membuat bagian lain pada histogram sulit dibaca. Skala mengubah tinggi tampilan setiap batang. Jumlah pikselnya tetap sama.

## Apa yang diukur

Alat ini menghitung piksel dari gambar 8-bit yang dirender oleh browser pada ukuran aslinya. Kecerahan dihitung dari gabungan nilai merah, hijau, dan biru, dengan bobot terbesar untuk hijau. Piksel yang sepenuhnya transparan dilewati, sedangkan setiap piksel yang transparan sebagian dihitung satu kali, meskipun nilai RGB-nya dapat dibulatkan saat perenderan. Gambar animasi dianalisis sebagai satu bingkai diam. Gambar diproses di perangkat Anda.
