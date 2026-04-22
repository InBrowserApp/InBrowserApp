## Apa itu NanoID?

NanoID adalah pembuat ID unik yang ringkas dan aman untuk URL, dirancang untuk aplikasi web modern, API, dan alat internal. Format bawaannya memakai 21 karakter dari alfabet yang berisi 64 karakter, sehingga memberi sekitar 126 bit keacakan sambil tetap cukup pendek untuk URL, nama file, dan data uji.

Semua proses di alat ini berjalan secara lokal di browser Anda. Alfabet khusus dan ID yang dihasilkan tidak pernah meninggalkan halaman, sehingga alat ini praktis untuk pembuatan prototipe cepat, pembuatan fixture, dan tugas operasional sekali pakai.

**Poin utama:**

- **Aman untuk URL**: menggunakan A-Z, a-z, 0-9, -, dan \_.
- **Dapat disesuaikan**: atur panjang dan alfabet sesuai kebutuhan Anda.
- **Keacakan aman**: menggunakan nilai acak kriptografis di browser.
- **Ekspor teks biasa**: salin atau unduh batch saat ini ketika Anda membutuhkan data awal, konten demo, atau daftar yang siap diimpor.

**Panduan praktis:**

- Pertahankan panjang default 21 karakter saat Anda membutuhkan pengenal serbaguna yang kuat dengan peluang tabrakan yang sangat rendah.
- ID yang lebih pendek cocok untuk token UI sementara atau data mock lokal, tetapi risiko tabrakan meningkat ketika panjang diperkecil atau batch diperbesar.
- Alfabet yang lebih besar memberikan lebih banyak entropi per karakter, sehingga Anda sering bisa membuat ID lebih pendek tanpa terlalu banyak mengorbankan keunikan.
- Alfabet kustom sebaiknya hanya berisi karakter unik. Karakter duplikat mengganggu distribusi, jadi alat ini memblokirnya sebelum menghasilkan output.
