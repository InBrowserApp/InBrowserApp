## Mendapatkan kod 2FA daripada kunci persediaan atau kod QR

Buka tetapan pengesahan dua faktor pada laman yang ingin anda lindungi dan pilih kaedah aplikasi pengesah. Muat naik atau imbas kod QR daripada laman tersebut. Anda juga boleh tampal kunci persediaan atau pautan `otpauth://`, kemudian pilih **Tambah akaun**. Salin kod semasa ke medan pengesahan pada laman itu untuk melengkapkan persediaan.

## Memindahkan akaun daripada pengesah lain

Dalam Google Authenticator, pilih **Pindahkan akaun** dan eksport akaun yang ingin dipindahkan. Pilih **Guna kamera** di sini untuk mengimbas kod QR yang dieksport, atau muat naik sekali gus imej kod QR yang telah disimpan. Dalam [pengesah InBrowser.App versi asal](https://authenticator.inbrowser.app/), buka **Export**, pilih **Google Authenticator**, kemudian muat turun imej kod QR dan muat naik di sini.

Akaun TOTP daripada kod QR pemindahan Google diimport dengan selang 30 saat. Untuk mengekalkan selang tersuai daripada pengesah asal, pindahkan akaun satu demi satu. Klik ikon gear bagi setiap akaun, kembangkan **Key URI** dalam **Config**, kemudian tampalkan pautan di sini.

Akaun disimpan dalam pelayar ini. Pilih **Eksport akaun** untuk memuat turun sandaran sebelum memadamkan data laman atau berpindah ke pelayar lain. Simpan sandaran di tempat yang selamat kerana fail tersebut mengandungi kunci persediaan anda. Untuk memulihkan fail, pilih **Import sandaran** dalam panel tambah akaun.

## Mengapa kod pengesahan saya ditolak?

Kebanyakan laman menggunakan kod berasaskan masa (TOTP). Semak sama ada peranti menetapkan masa secara automatik. Jika kod semasa hampir luput, tunggu kod seterusnya. Kod berasaskan pembilang (HOTP) kekal sama sehingga anda memilih **Kod seterusnya**. Untuk kedua-duanya, gunakan kod bagi akaun yang betul dan padankan tetapan dengan arahan pada laman.
