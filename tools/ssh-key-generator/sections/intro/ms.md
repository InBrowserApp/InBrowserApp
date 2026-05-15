## Apakah itu pasangan kunci SSH?

Pasangan kunci SSH ialah kunci awam dan kunci peribadi yang digunakan untuk mengesahkan akses kepada pelayan, hos Git, sistem pengerahan, dan perkhidmatan lain berasaskan SSH. Kunci awam boleh dikongsi. Kunci peribadi mesti kekal rahsia.

Penjana ini mencipta kunci Ed25519 atau RSA berformat OpenSSH sepenuhnya dalam pelayar anda. Ia juga menunjukkan cap jari SHA-256, iaitu nilai ringkas yang lazimnya dipaparkan oleh OpenSSH apabila anda mengesahkan kunci.

## Bila hendak menggunakan alat ini

- Cipta kunci pembangunan untuk pelayan ujian, Git remote, kontena, atau persekitaran makmal sementara.
- Jana kunci Ed25519 apabila anda memerlukan lalai moden dan ringkas untuk akses SSH baharu.
- Jana kunci RSA apabila perkhidmatan lama tidak menyokong Ed25519.
- Salin kunci awam ke dalam `authorized_keys` sambil mengekalkan kunci peribadi pada peranti anda.

## Cara memilih algoritma

Ed25519 ialah lalai terbaik untuk kebanyakan kunci SSH baharu kerana ia kecil, pantas, dan disokong secara meluas oleh versi OpenSSH semasa. RSA berguna untuk keserasian dengan perkakas lama, pelayan Git legasi, atau keperluan dasar yang masih mengharapkan kunci RSA.

Untuk RSA, 4096 bit ialah lalai yang konservatif. Kunci 2048-bit yang lebih kecil lebih cepat dan masih lazim, tetapi banyak pasukan kini lebih memilih 3072 atau 4096 bit untuk kunci baharu yang berjangka hayat panjang.

## Perkara yang perlu diingat

- Kunci peribadi yang dihasilkan di sini tidak disulitkan. Tambahkan frasa laluan dengan `ssh-keygen -p -f <key-file>` jika anda memerlukannya.
- Simpan kunci peribadi dengan keizinan yang ketat, seperti `chmod 600 <key-file>`.
- Jangan tampal kunci peribadi dalam tiket, sembang, log, atau halaman web yang tidak diketahui.
- Gantikan kunci apabila komputer riba, rahsia CI, atau sandaran yang mengandungi kunci peribadi mungkin terdedah.
