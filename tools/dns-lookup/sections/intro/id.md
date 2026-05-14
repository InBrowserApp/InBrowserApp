DNS Lookup memeriksa record DNS publik yang dikembalikan untuk sebuah nama domain. Ini berguna saat Anda memverifikasi peluncuran situs baru, memecahkan masalah pengiriman email, memeriksa perubahan CDN atau load balancer, atau memastikan apakah respons terkait DNSSEC terlihat berbeda di berbagai resolver.

## Kapan Digunakan

Gunakan alat ini ketika Anda membutuhkan jawaban cepat di sisi browser untuk jenis record DNS umum. Record A dan AAAA menunjukkan tujuan IPv4 dan IPv6, record CNAME menunjukkan alias, record MX mengidentifikasi mail exchanger, record TXT sering berisi token SPF atau verifikasi, dan record NS/SOA/CAA/SRV/HTTPS/SVCB menampilkan petunjuk delegasi, otoritas, sertifikat, layanan, dan endpoint modern.

## Cara Kerjanya

Lookup berjalan di browser Anda dengan DNS over HTTPS. Pilih resolver, pilih satu atau beberapa jenis record, lalu kirim domain atau URL. URL dinormalisasi menjadi hostname sebelum kueri dikirim, jadi menempelkan `https://www.example.com/path` akan menjalankan kueri untuk `www.example.com`.

## Membaca Hasil

Setiap jenis record ditampilkan secara terpisah dengan kode respons DNS, flag resolver, baris jawaban, dan JSON mentah. `NoError` berarti server DNS menjawab dengan sukses, tetapi tetap dapat mengembalikan tanpa baris jawaban untuk jenis tertentu. `NXDomain`, `ServFail`, atau `Refused` biasanya berarti nama tersebut tidak ada, resolver tidak dapat menyelesaikan lookup, atau kebijakan resolver memblokir permintaan.

## Privasi dan Batasan

Permintaan dikirim ke resolver DNS over HTTPS yang dipilih, bukan ke server InBrowser.App. Perilaku resolver, status cache, validasi DNSSEC, dan penyaringan jaringan lokal semuanya dapat memengaruhi hasil. Alat ini tidak menggantikan pemeriksaan `dig` otoritatif dari beberapa jaringan, tetapi ini adalah cara cepat untuk memeriksa apa yang dikembalikan resolver DoH publik dari browser Anda saat ini.
