## Validasi JSON metadata NFT sebelum minting

Pilih **File lokal** untuk memeriksa setiap file JSON atau satu folder koleksi di perangkat Anda. Anda dapat langsung memilih file bernama angka seperti `1` atau `42`. Alat ini melaporkan JSON yang tidak valid dan masalah metadata yang umum pada setiap item, seperti nama kosong, gambar yang hilang, deskripsi yang tidak valid, atau format atribut yang salah. Gunakan **Perlu ditinjau** untuk menemukan entri yang harus diperbaiki, atau pilih **Unduh JSON** untuk menyimpan laporan lengkap.

## Periksa URI token secara massal

Di **URI token**, tempel satu alamat metadata per baris. Untuk koleksi yang menggunakan nomor, gunakan **Pola URI** dengan penanda seperti `https://example.com/metadata/{id}.json`. Tentukan ID pertama dan terakhir untuk memeriksa seluruh rentang, termasuk kedua batasnya. Format desimal menggunakan ID seperti yang ditulis. **Heksadesimal ERC-1155** menuliskan setiap ID sebagai 64 karakter heksadesimal huruf kecil dengan nol di depan, sesuai aturan penggantian `{id}` ERC-1155. Alat ini juga mengganti `{id}` dalam nilai metadata seperti tautan gambar.

## Periksa tautan gambar dan animasi NFT

Aktifkan **Periksa apakah media dapat diakses** untuk memeriksa tautan `image` dan `animation_url`. Pilih seluruh folder lokal untuk menyertakan media yang dirujuk dengan jalur relatif. Jalur yang diawali `/` ditafsirkan dari tingkat teratas folder yang dipilih. Browser juga dapat memeriksa sumber daya HTTP, IPFS, dan Arweave. Kesalahan gateway, batas waktu, atau pembatasan lintas asal dapat membuat tautan tidak terkonfirmasi. Periksa lagi tautan tersebut melalui gateway atau lokapasar yang Anda gunakan. File lokal diperiksa di browser. Pemeriksaan URI menghubungi host atau gateway terkait.

Untuk definisi kolom dan aturan penggantian pada URI token, lihat [panduan metadata OpenSea](https://docs.opensea.io/docs/metadata-standards) dan [spesifikasi metadata ERC-1155](https://eips.ethereum.org/EIPS/eip-1155#metadata).
