# Penjana CSR

Certificate Signing Request (CSR) ialah mesej PKCS#10 yang mengandungi kunci awam anda, medan Subject yang mengenal pasti, sambungan pilihan seperti Subject Alternative Names, dan tandatangan yang dibuat dengan kunci peribadi yang sepadan. Pihak berkuasa sijil menggunakan CSR untuk mengeluarkan sijil X.509 tanpa menerima kunci peribadi anda.

Penjana ini mencipta CSR terus dalam pelayar anda. Anda boleh menjana pasangan kunci RSA atau ECDSA baharu, atau mengimport kunci peribadi PEM sedia ada yang tidak disulitkan apabila anda perlu memperbaharui sijil untuk kunci yang sudah digunakan.

## Bila menggunakannya

Gunakan CSR apabila anda memerlukan pihak berkuasa sijil untuk mengeluarkan atau memperbaharui sijil TLS, S/MIME, pengesahan klien, atau perkhidmatan dalaman. CSR membuktikan pemilikan kunci peribadi dan membawa maklumat identiti awam yang patut muncul dalam sijil.

Untuk sijil TLS awam, letakkan nama hos dalam Subject Alternative Names. Common Name masih berguna untuk kebolehbacaan dan sistem legasi, tetapi klien moden mengesahkan nama DNS dan alamat IP daripada SAN.

## Cara menjana CSR

Pilih sama ada untuk menjana kunci baharu atau mengimport kunci peribadi sedia ada. Isi medan Subject yang penting untuk permintaan sijil anda, kemudian tambah entri SAN untuk nama DNS, alamat IP, alamat e-mel, atau URI. Jana CSR dan hantar hanya CSR PEM kepada pihak berkuasa sijil anda.

Jika alat ini menjana kunci baharu, muat turun dan simpan kunci peribadi sebelum meninggalkan halaman. Jika anda mengimport kunci, alat ini hanya menjana CSR dan tidak mengeksport semula kunci peribadi yang diimport.

## Nota kunci dan format

RSA 2048 bit serasi secara meluas; 3072 atau 4096 bit mungkin lebih sesuai untuk sijil dalaman yang berjangka hayat lebih panjang. ECDSA P-256 adalah padat dan disokong secara meluas, manakala P-384 atau P-521 mungkin diperlukan oleh dasar yang lebih ketat. Laluan kunci import menyokong blok PEM PKCS#8, RSA PRIVATE KEY, dan EC PRIVATE KEY yang tidak disulitkan.

Kunci peribadi adalah sensitif. Jangan tampalkannya ke laman web yang tidak dipercayai, jangan hantarkannya kepada pihak berkuasa sijil, dan jangan komitkannya ke kawalan sumber. Alat ini berjalan secara setempat dalam pelayar, tetapi proses operasi anda masih memerlukan storan kunci dan putaran yang selamat.
