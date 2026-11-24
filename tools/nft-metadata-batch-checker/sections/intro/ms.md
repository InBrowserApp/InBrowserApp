## Sahkan JSON metadata NFT sebelum proses minting

Pilih **Fail setempat** untuk menyemak fail JSON satu demi satu atau seluruh folder koleksi pada peranti anda. Anda boleh memilih terus fail yang dinamakan dengan nombor seperti `1` atau `42`. Alat ini melaporkan JSON yang tidak sah dan masalah metadata lazim bagi setiap item, termasuk nama kosong, imej yang hilang, perihalan yang tidak sah dan atribut yang salah format. Gunakan **Perlu disemak** untuk mencari entri yang perlu dibaiki, atau pilih **Muat turun JSON** untuk menyimpan laporan penuh.

## Semak URI token secara pukal

Di bawah **URI token**, tampal satu alamat metadata pada setiap baris. Untuk koleksi bernombor, gunakan **Corak URI** dengan pemegang tempat seperti `https://example.com/metadata/{id}.json`. Tetapkan ID pertama dan ID terakhir untuk menyemak seluruh julat, termasuk kedua-dua ID tersebut. Format perpuluhan menggunakan ID sebagaimana yang ditulis. **Heksadesimal ERC-1155** menulis setiap ID dengan 64 aksara heksadesimal huruf kecil dan menambah sifar di hadapan mengikut peraturan penggantian `{id}` ERC-1155. Alat ini turut menggantikan `{id}` dalam nilai metadata seperti pautan imej.

## Semak pautan imej dan animasi NFT

Hidupkan **Semak sama ada media boleh dicapai** untuk menyemak pautan `image` dan `animation_url`. Pilih seluruh folder setempat untuk menyertakan media yang dirujuk melalui laluan relatif. Laluan yang bermula dengan `/` ditafsirkan dari aras teratas folder yang dipilih. Pelayar juga boleh menyemak sumber HTTP, IPFS dan Arweave. Ralat get laluan, tamat masa atau sekatan rentas asal boleh menyebabkan pautan tidak dapat disahkan. Semak pautan tersebut melalui get laluan atau pasaran yang anda gunakan. Fail setempat disemak dalam pelayar. Semakan URI menghubungi hos atau get laluan yang berkaitan.

Untuk takrif medan dan peraturan penggantian dalam URI token, lihat [panduan metadata OpenSea](https://docs.opensea.io/docs/metadata-standards) dan [spesifikasi metadata ERC-1155](https://eips.ethereum.org/EIPS/eip-1155#metadata).
