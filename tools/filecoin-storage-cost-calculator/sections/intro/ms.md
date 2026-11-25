## Anggarkan kos storan Filecoin Onchain Cloud

Masukkan saiz data, **Tempoh penyimpanan (hari)** dan **Bilangan salinan**. Kalkulator menganggarkan kos menyimpan set data baharu bagi setiap salinan menggunakan Filecoin Warm Storage Service. Hasilnya memaparkan kadar bulanan bagi storan dan pembuktian, perbelanjaan untuk tempoh pilihan serta yuran bagi penciptaan set data dan penambahan piece. Amaun dinyatakan dalam USDFC. Sebulan pengebilan Filecoin bersamaan dengan 30 hari.

## Cara anggaran storan dikira

Setiap set data aktif dikenakan kadar storan mengikut saiz, ditambah yuran tetap untuk Proof of Data Possession (PDP). Contohnya, jika kadar storan ialah 2.50 USDFC bagi setiap TiB dan yuran pembuktian ialah 0.12 USDFC bagi setiap salinan, menyimpan satu TiB dalam dua salinan menelan kos sekitar 5.24 USDFC setiap 30 hari. Anggaran menggunakan saiz data yang anda masukkan. Filecoin mengira saiz pengebilan sebenar daripada nod daun yang mengandungi data. Ini boleh menambah sehingga 31 bait bagi setiap piece.

## Rancang yuran muat naik dan rizab yang boleh dikembalikan

Buka **Butiran muat naik** untuk memasukkan bilangan piece dan kelompok muat naik bagi setiap salinan. Anggaran lalai menggunakan satu kelompok bagi setiap salinan. Biarkan bilangan piece kosong untuk menganggarkan bilangan minimum berdasarkan had muat naik Synapse SDK sebanyak 63.5 GiB, atau masukkan bilangan sebenar. Setiap salinan dikenakan yuran penciptaan set data sendiri. Penambahan piece dikenakan yuran asas bagi setiap kelompok serta yuran bagi setiap piece. Perkhidmatan memegang rizab untuk menampung kos operasi sepanjang kitar hayat data. Rizab dipaparkan secara berasingan daripada anggaran perbelanjaan. Baki yang tidak digunakan dilepaskan selepas caj diselesaikan. Anggaran ini meliputi muat naik baharu dan tempoh penyimpanannya. Pengambilan data dan operasi selepas itu mempunyai caj tersendiri. Lihat [had saiz Synapse SDK](https://docs.filecoin.cloud/developer-guides/synapse/#size-constraints).

## Dari manakah kadar Filecoin diperoleh?

Halaman ini menggunakan kadar rujukan bertarikh yang tertera di sebelah hasil. Pilih **Kemas kini kadar mainnet** untuk membaca kontrak penetapan harga Warm Storage melalui RPC Filecoin awam. Pelayar menggunakan nilai kadar yang diterima dan menunjukkan blok sumbernya. Anda masih boleh mengira menggunakan kadar rujukan jika permintaan itu tidak dapat diselesaikan.

Baca [panduan kos storan Filecoin](https://docs.filecoin.cloud/developer-guides/storage/storage-costs/) untuk mengetahui saiz pengebilan sebenar, keperluan dana bagi setiap akaun dan jadual yuran lengkap.
