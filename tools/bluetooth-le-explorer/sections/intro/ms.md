## Cara menyambungkan peranti Bluetooth Low Energy

Hidupkan Bluetooth dan tetapkan peranti kepada mod yang membenarkan sambungan. Pilih **Sambungkan peranti** dan pilih peranti tersebut dalam pelayar. Penjelajah ini meminta akses kepada perkhidmatan GATT lazim seperti Battery Service, Device Information, Heart Rate dan Environmental Sensing. Untuk perkhidmatan GATT tersuai, masukkan UUID sebelum membuka pemilih peranti. Gunakan UUID 16-bit seperti `180F` atau UUID 128-bit penuh daripada dokumentasi peranti.

## Cara membaca ciri GATT

Kembangkan perkhidmatan untuk melihat ciri dan operasi yang disokongnya. Pilih **Baca** untuk meminta nilai semasa. Heks menunjukkan bait tepat seperti yang diterima, manakala UTF-8 berguna untuk ciri yang mengandungi teks. Paras bateri, ukuran atau nilai binari lain mungkin perlu ditafsirkan menggunakan spesifikasi ciri tersebut.

## Cara merakam pemberitahuan Bluetooth

Pilih **Langgan** pada ciri yang menyokong Notify atau Indicate. Kemas kini dipaparkan bersama masa dan UUID ciri. Muat turun 100 pemberitahuan terkini sebagai fail JSON untuk diperiksa kemudian, atau pilih **Hentikan langganan** untuk menghentikan aliran tersebut. Halaman ini menyimpan log secara setempat.

## Mengapa saya tidak dapat melihat peranti atau perkhidmatannya?

Sokongan Web Bluetooth bergantung pada pelayar dan sistem pengendalian. Gunakan pelayar yang disokong melalui HTTPS, pastikan peranti berdekatan dan putuskan sambungannya daripada aplikasi lain jika ia hanya membenarkan satu sambungan. Pelayar menyediakan akses kepada perkhidmatan GATT yang dibenarkan pada peranti Bluetooth LE. Peranti Bluetooth Classic, seperti fon kepala yang hanya menyediakan profil audio, memerlukan antara muka yang berbeza.
