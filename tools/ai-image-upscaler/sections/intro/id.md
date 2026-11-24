## Cara meningkatkan resolusi gambar dengan AI

1. Pilih atau seret gambar JPG, PNG, atau WebP ke area yang tersedia. Gunakan salinan dengan kualitas terbaik yang Anda miliki, meski gambarnya kecil.
2. Pilih **2×** atau **4×**, lalu periksa dimensi hasilnya. Gambar 400 × 300 menjadi 800 × 600 pada 2× atau 1600 × 1200 pada 4×.
3. Pilih **Perbesar gambar**, lalu geser bilah perbandingan untuk memeriksa tepi dan tekstur. Unduh hasilnya sebagai PNG dengan kompresi tanpa kehilangan data.

## Apa itu resolusi super gambar dengan AI?

Resolusi super menambah jumlah piksel pada lebar dan tinggi gambar beresolusi rendah. InBrowser.App menggunakan Real-ESRGAN, model yang dilatih untuk memperkirakan tepi yang lebih tajam dan tekstur yang lebih terperinci dari piksel yang tersedia. Foto kecil, ilustrasi, dan gambar web yang sudah dikompresi bisa terlihat lebih jelas dalam ukuran yang lebih besar. Periksa wajah, teks kecil, dan pola halus di pratinjau. Detail baru adalah hasil perkiraan dan bisa berbeda dari adegan aslinya.

## Sebaiknya pilih pembesaran 2× atau 4×?

Pilih 2× untuk pembesaran secukupnya, misalnya saat memakai gambar mini dalam tata letak yang lebih besar. Pilih 4× jika gambar perlu mengisi ruang yang jauh lebih luas, misalnya saat ingin menampilkan hasil pindai kecil dalam ukuran besar. Menggandakan panjang setiap sisi membuat jumlah piksel menjadi empat kali lipat. Memperbesar setiap sisi empat kali membuat jumlah piksel menjadi enam belas kali lipat. Gambar masukan boleh berukuran hingga 2.048 piksel pada setiap sisi, dengan total maksimal 1 megapiksel.

## Apakah gambar diproses di perangkat saya?

Ya. Browser mengunduh model Real-ESRGAN saat Anda pertama kali memperbesar gambar. Gambar diproses di perangkat Anda melalui WebGPU jika tersedia, atau menggunakan CPU melalui WebAssembly. Proses pertama mungkin lebih lama, dan waktu pemrosesan bergantung pada ukuran gambar dan perangkat Anda. Gambar tetap di perangkat Anda selama proses berlangsung.
