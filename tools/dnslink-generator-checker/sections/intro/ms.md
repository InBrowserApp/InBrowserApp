## Jana rekod TXT DNSLink untuk IPFS

DNSLink menghalakan domain atau subdomain ke laluan kandungan. Masukkan domain, kemudian tampal CID IPFS, laluan IPFS atau laluan IPNS. Salin **Nama** dan **Nilai TXT** yang dijana ke dalam rekod TXT baharu pada penyedia DNS anda. Contohnya, domain `www.example.com` menggunakan nama rekod `_dnslink.www.example.com`. Jika panel DNS menambahkan `example.com` secara automatik, masukkan `_dnslink.www` dalam medan nama.

## Semak sasaran DNSLink anda

Pilih **Semak rekod yang diterbitkan** untuk melihat jawapan TXT daripada Cloudflare dan Google. Kosongkan medan sasaran untuk mencari tetapan sedia ada, atau masukkan sasaran yang diinginkan untuk membandingkannya dengan nilai yang diterbitkan. Selepas rekod diubah, penyelesai mungkin masih mengembalikan nilai lama sehingga cache tamat tempoh. TTL yang dipaparkan menunjukkan tempoh jawapan DNS tersebut boleh disimpan dalam cache.

## Kemas kini laman IPFS dengan domain tersuai

Gunakan CID IPFS untuk merujuk terus kepada satu versi fail tertentu, atau gunakan laluan IPNS untuk mengikuti nama yang boleh dikemas kini. DNSLink memberitahu klien dan get laluan yang serasi kandungan yang perlu dicapai. Untuk menyediakan kandungan itu melalui domain HTTPS anda sendiri, konfigurasikan get laluan yang menyokong DNSLink dan halakan domain anda kepadanya. [Domain tersuai pada IPFS dan DNSLink](https://docs.ipfs.tech/how-to/websites-on-ipfs/custom-domains/)
