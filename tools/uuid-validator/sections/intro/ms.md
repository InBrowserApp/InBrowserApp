## Apakah Pengesah UUID?

Pengesah UUID menyemak sama ada pengecam ditulis dalam bentuk UUID standard 36 aksara, seperti `6ba7b810-9dad-11d1-80b4-00c04fd430c8`. Ia berguna apabila anda perlu mengesahkan ID yang disalin daripada log, API, pangkalan data, lekapan ujian, atau input pengguna sebelum bergantung padanya dalam kod.

### Input yang Disokong

Alat ini mengesahkan teks UUID kanonik dengan lima kumpulan heksadesimal dalam susun atur `8-4-4-4-12`. Huruf besar diterima dan dinormalkan kepada huruf kecil. UUID nil (`00000000-0000-0000-0000-000000000000`) dan UUID max (`ffffffff-ffff-ffff-ffff-ffffffffffff`) dianggap sebagai nilai khas yang sah.

### Butiran Pengesahan

Bagi UUID standard, pengesah menyemak nibble versi dan bit varian. Versi 1 hingga 8 dikenali, meliputi UUID RFC 4122 legasi dan susun atur RFC 9562 yang lebih baharu seperti UUID v6, v7, dan v8. Panel hasil juga memecahkan UUID kepada lima segmennya supaya anda boleh memeriksa bait tepat yang disahkan.

### Privasi

Pengesahan berjalan sepenuhnya dalam pelayar anda. UUID yang anda tampal tidak dimuat naik, jadi alat ini selamat digunakan dengan pengecam dalaman, kunci pangkalan data, dan contoh log produksi yang perlu kekal setempat.
