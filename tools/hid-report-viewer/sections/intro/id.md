## Cara menghubungkan perangkat HID di browser

Hubungkan perangkat antarmuka manusia yang didukung, seperti pengontrol game, joystick, pedal, atau papan makro. Pilih **Hubungkan perangkat**, lalu pilih perangkat di pemilih WebHID. Penampil menampilkan ID vendor (VID) dan ID produk (PID) untuk membantu mengenali perangkat keras. Gunakan browser desktop yang kompatibel melalui HTTPS.

## Cara membaca koleksi HID dan ID laporan

Buka koleksi untuk melihat halaman penggunaan, penggunaan, dan ID laporannya. Halaman penggunaan mengelompokkan fungsi yang berkaitan, sedangkan penggunaan mengenali fungsi dalam kelompok tersebut. Laporan input membawa data dari perangkat, laporan output menjelaskan data yang dapat dikirim host, dan laporan fitur menjelaskan pengaturan atau status khusus perangkat. ID laporan 0 berarti antarmuka tidak menggunakan ID laporan eksplisit.

## Cara memeriksa byte input yang berubah

Gerakkan satu kontrol setiap kali sambil mengamati laporan heksadesimal secara langsung. Byte yang disorot berbeda dari payload sebelumnya untuk ID laporan yang sama. ID laporan ditampilkan terpisah dari payload. Jeda perekaman untuk memeriksa laporan terbaru, atau hapus daftar dan mulai lagi. Lihat format laporan perangkat untuk menafsirkan tombol, sumbu, dan bidang lainnya.

## Mengapa perangkat atau koleksi saya tidak tercantum?

Pastikan sistem operasi mengenali perangkat, lalu buka kembali pemilih perangkat. Browser melindungi koleksi keyboard dan mouse yang umum, dan beberapa perangkat hanya menyediakan sebagian laporannya ke web. Penampil ini menerima laporan input dari perangkat yang dipilih dan menyimpan datanya di tab ini. Untuk kontrol standar, coba [Penguji Gamepad](../gamepad-tester/) atau [Tes Keyboard](../keyboard-tester/).
