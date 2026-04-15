Buat KSUID secara lokal di browser tanpa mengirim batch saat ini ke layanan lain. Alat ini cocok ketika Anda memerlukan identifier yang tetap unik di sistem terdistribusi, sekaligus dapat diurutkan secara kira-kira berdasarkan waktu pembuatan untuk log, feed, impor, atau record yang berurutan.

## Mengapa Menggunakan KSUID

KSUID menggabungkan stempel waktu 32 bit dengan 128 bit data acak lalu mengodekan hasilnya sebagai string Base62 sepanjang 27 karakter. Hasilnya, setiap ID tetap ringkas, ramah URL, dan mudah disimpan, sementara stempel waktu yang tertanam membuat nilai yang lebih baru umumnya berada setelah nilai yang lebih lama.

## Pilih Waktu Sekarang Atau Waktu Kustom

Gunakan waktu saat ini ketika Anda membutuhkan ID baru untuk data production, demo, atau pembuatan batch rutin. Beralihlah ke timestamp kustom saat Anda memerlukan fixture yang dapat direproduksi, record hasil backfill, contoh migration, atau test case yang harus tampak dibuat pada waktu tertentu.

## Hal Yang Perlu Diketahui Sebelum Mengekspor

KSUID hanya menyimpan presisi sampai detik, jadi input dengan milidetik akan dibulatkan turun ke awal detik tersebut. ID yang dibuat dalam detik yang sama tetap unik, tetapi urutan akhirnya juga dipengaruhi oleh payload acak. Karena itu, anggap KSUID sebagai ID yang dapat diurutkan berdasarkan waktu, bukan urutan yang benar-benar berkesinambungan.
