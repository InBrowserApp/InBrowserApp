## Mengapa Data URI sering muncul

Data URI mengemas file dan metadata-nya ke dalam satu string, sehingga sering muncul di HTML, CSS, SVG, template email, respons API, dan hasil ekspor browser. Format ini praktis untuk aset kecil, tetapi sulit diperiksa ketika yang tersisa hanya nilai yang sudah dikodekan.

## Apa yang diberikan konverter ini

Tempel `data:` URI lengkap untuk mendekodenya secara lokal di browser. Alat ini menampilkan tipe MIME, memberi tahu apakah payload memakai Base64 atau URL encoding, menampilkan pratinjau teks, gambar, audio, atau video saat browser mendukungnya, dan menyarankan nama file unduhan berdasarkan tipe media.

## Apa yang perlu dicek sebelum menyimpan

Data URI yang valid tetap bisa membawa tipe MIME yang salah atau ekstensi yang menyesatkan. Bandingkan panel detail dengan hasil yang Anda harapkan, periksa pratinjau bila tersedia, dan ubah nama file sebelum mengunduh jika Anda memerlukan nama lain.
