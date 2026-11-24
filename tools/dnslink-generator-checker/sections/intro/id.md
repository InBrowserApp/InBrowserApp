## Buat record TXT DNSLink untuk IPFS

DNSLink mengarahkan domain atau subdomain ke jalur konten. Masukkan domain, lalu tempel CID IPFS, jalur IPFS, atau jalur IPNS. Salin **Nama** dan **Nilai TXT** yang dihasilkan ke record TXT baru di layanan DNS Anda. Misalnya, domain `www.example.com` menggunakan nama record `_dnslink.www.example.com`. Jika panel DNS otomatis menambahkan `example.com`, masukkan `_dnslink.www` pada kolom nama.

## Periksa tujuan DNSLink Anda

Pilih **Periksa record yang dipublikasikan** untuk melihat jawaban TXT dari Cloudflare dan Google. Kosongkan kolom target untuk melihat konfigurasi yang ada, atau masukkan target yang diinginkan untuk membandingkannya dengan nilai yang dipublikasikan. Setelah record diubah, resolver dapat terus mengembalikan nilai lama sampai cache kedaluwarsa. TTL yang ditampilkan adalah lama waktu jawaban DNS tersebut dapat disimpan di cache.

## Perbarui situs IPFS dengan domain sendiri

Gunakan CID IPFS untuk menunjuk langsung ke satu versi file tertentu, atau gunakan jalur IPNS untuk mengikuti nama yang dapat diperbarui. DNSLink memberi tahu klien dan gateway yang kompatibel tentang konten yang perlu diakses. Untuk menyajikan konten tersebut lewat domain HTTPS sendiri, siapkan gateway yang mendukung DNSLink dan arahkan domain Anda ke sana. [Domain khusus di IPFS dan DNSLink](https://docs.ipfs.tech/how-to/websites-on-ipfs/custom-domains/)
