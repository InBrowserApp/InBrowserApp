WebP animasi dapat mempertahankan gerakan GIF sambil sering menghasilkan file yang lebih kecil untuk situs web, pratinjau produk, dokumentasi, dan aset yang ramah untuk obrolan. Konverter ini berjalan secara lokal dan, saat Anda mempertahankan pengaturan skala, kecepatan, dan perulangan bawaan, mengirim GIF asli melalui encoder ukuran minimum lossless `gif2webp` sebelum mengekspor file `.webp`.

## Kapan menggunakannya

Gunakan alat ini saat Anda memiliki GIF animasi yang perlu diubah ke format web yang lebih modern, terutama untuk halaman ketika ukuran file dan kecepatan muat penting. WebP animasi didukung oleh browser utama saat ini dan dapat mempertahankan transparansi, pengaturan waktu, serta perilaku perulangan.

## Opsi konversi

Skala mengubah setiap bingkai sebelum pengodean, yang berguna saat GIF lebih besar daripada tempat tampilnya. Kecepatan mengubah waktu pemutaran tanpa membuang bingkai. Perilaku perulangan dapat mengikuti GIF sumber, memaksa pemutaran tanpa batas, atau memakai jumlah khusus untuk aset yang harus berhenti setelah jumlah pemutaran tertentu. Mempertahankan skala pada 100%, kecepatan pada 1x, dan perilaku perulangan pada Follow GIF akan memakai jalur ukuran minimum lossless bawaan.

## Privasi dan batasan

Konversi berjalan di browser Anda. WebP lossless biasanya mengompresi animasi bergaya GIF dengan lebih baik, tetapi tidak dapat menjamin setiap hasil akan lebih kecil; GIF yang sangat kecil atau sudah dioptimalkan dapat membesar karena container WebP tetap memiliki overhead. Mengubah skala, kecepatan, atau perilaku perulangan memerlukan decoding bingkai dan dapat memakai memori yang signifikan untuk GIF yang sangat besar. Jika GIF sumber tidak berisi metadata perulangan, hasil ekspor bawaan diputar sekali kecuali Anda memilih perulangan tanpa batas atau khusus.
