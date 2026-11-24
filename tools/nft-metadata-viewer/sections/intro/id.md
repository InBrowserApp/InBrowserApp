## Cari metadata NFT dengan alamat kontrak dan ID token

Tempel **Alamat kontrak** di jaringan utama Ethereum dan masukkan **ID token**, lalu pilih **Lihat metadata**. ID token dapat berupa angka desimal seperti `1` atau heksadesimal seperti `0x1`. Pilih **Coba contoh** untuk melihat proses pencarian lengkap. Alat ini mengirim permintaan RPC baca saja ke Ethereum dari browser, sehingga Anda dapat mencari token publik tanpa menghubungkan dompet.

## Temukan URI token, gambar, trait, dan JSON

Alat ini membaca `tokenURI` untuk ERC-721 atau `uri` untuk ERC-1155. **URI token** adalah teks yang dikembalikan oleh kontrak. Alat ini membaca metadata yang dirujuk oleh URI itu dan menampilkan gambar, nama, dan trait jika tersedia. Gunakan **JSON mentah** untuk memeriksa atau menyalin respons asli. IPFS, HTTP, Arweave, serta URI data dengan JSON sebaris didukung.

## Cara penggantian ID token ERC-1155

Kontrak ERC-1155 dapat mengembalikan templat yang digunakan bersama oleh beberapa token. Alat ini mengganti `{id}` dengan ID token dalam 64 digit heksadesimal huruf kecil yang diberi nol di sebelah kiri, tanpa awalan `0x`. Setelah substitusi, **URI setelah substitusi** menampilkan alamat yang diakses untuk token tersebut. Penggantian yang sama berlaku untuk bagian pratinjau seperti tautan gambar.

## Bagaimana jika URI token muncul tanpa gambar?

Kontrak dapat mengembalikan URI meskipun host web atau gateway IPFS sementara tidak tersedia. Jika metadata tidak dapat dimuat, URI masih dapat disalin. Jika JSON tersedia, periksa bagian `image` dan coba buka sumbernya langsung. Host HTTP juga dapat membatasi permintaan lintas asal, sehingga memengaruhi informasi yang dapat dibaca browser.

Untuk bagian metadata yang umum digunakan aplikasi NFT, lihat [standar ERC-721](https://eips.ethereum.org/EIPS/eip-721), [spesifikasi metadata ERC-1155](https://eips.ethereum.org/EIPS/eip-1155#metadata), dan [panduan metadata OpenSea](https://docs.opensea.io/docs/metadata-standards).
