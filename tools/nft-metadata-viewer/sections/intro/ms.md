## Cari metadata NFT menggunakan alamat kontrak dan ID token

Tampal **Alamat kontrak** pada rangkaian utama Ethereum dan masukkan **ID token**, kemudian pilih **Lihat metadata**. ID token boleh berupa nombor perpuluhan seperti `1` atau heksadesimal seperti `0x1`. Pilih **Cuba contoh** untuk melihat proses carian yang lengkap. Alat ini menghantar permintaan RPC baca sahaja ke Ethereum melalui pelayar, jadi anda boleh mencari token awam tanpa menyambungkan dompet.

## Cari URI token, imej, ciri dan JSON

Alat ini membaca `tokenURI` untuk ERC-721 atau `uri` untuk ERC-1155. **URI token** ialah rentetan yang dikembalikan oleh kontrak. Alat ini membaca metadata yang dirujuk oleh URI tersebut dan memaparkan imej, nama dan ciri apabila tersedia. Gunakan **JSON mentah** untuk memeriksa atau menyalin respons asal. Alat ini menyokong IPFS, HTTP, Arweave dan URI data yang mengandungi JSON sebaris.

## Cara penggantian ID token ERC-1155

Kontrak ERC-1155 boleh mengembalikan templat yang dikongsi oleh beberapa token. Alat ini menggantikan `{id}` dengan ID token dalam bentuk 64 digit heksadesimal huruf kecil, dengan sifar ditambah di sebelah kiri dan tanpa awalan `0x`. Selepas templat diisi, **URI selepas penggantian** memaparkan alamat yang dicapai untuk token itu. Penggantian yang sama digunakan pada medan pratonton seperti pautan imej.

## Bagaimana jika URI token dipaparkan tanpa imej?

Kontrak boleh mengembalikan URI walaupun hos web atau get laluan IPFS tidak tersedia buat sementara waktu. Jika metadata tidak dapat dimuatkan, anda masih boleh menyalin URI. Jika JSON tersedia, periksa medan `image` dan cuba buka sumbernya secara terus. Hos HTTP juga boleh mengehadkan permintaan rentas asal, sekali gus mempengaruhi maklumat yang boleh dibaca oleh pelayar.

Untuk medan yang lazim digunakan dalam aplikasi NFT, lihat [piawaian ERC-721](https://eips.ethereum.org/EIPS/eip-721), [spesifikasi metadata ERC-1155](https://eips.ethereum.org/EIPS/eip-1155#metadata) dan [panduan metadata OpenSea](https://docs.opensea.io/docs/metadata-standards).
