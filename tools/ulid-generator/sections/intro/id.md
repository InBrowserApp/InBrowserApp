Buat ULID secara lokal di browser Anda untuk rekaman, peristiwa, log, fixture, dan sistem terdistribusi yang membutuhkan identifier ringkas dengan prefiks yang dapat diurutkan berdasarkan waktu. Setiap nilai dibuat di perangkat ini dan dapat disalin atau diunduh tanpa mengirim batch ke layanan lain.

## Mengapa Menggunakan ULID

ULID adalah singkatan dari Universally Unique Lexicographically Sortable Identifier. ULID menggabungkan stempel waktu Unix milidetik 48-bit dengan 80 bit keacakan, lalu mengodekan hasilnya sebagai string Crockford Base32 sepanjang 26 karakter. Bentuk ini membuat ULID aman untuk URL, ramah basis data, dan secara alami dapat diurutkan berdasarkan waktu pembuatan.

## Waktu Saat Ini Atau Kustom

Gunakan waktu saat ini untuk rekaman aplikasi normal, kunci impor, dan data pengujian yang harus mencerminkan kapan data itu dibuat. Beralihlah ke stempel waktu kustom saat Anda membutuhkan sampel yang tampak deterministik, baris yang diisi mundur, peristiwa yang diputar ulang, atau fixture yang harus terurut di sekitar momen tertentu.

## Batch Monotonik

Saat mode batch monotonik diaktifkan, ID yang dibuat untuk milidetik yang sama akan menaikkan segmen acaknya sehingga batch tetap terurut secara leksikografis dari atas ke bawah. Nonaktifkan mode ini jika Anda ingin setiap baris menggunakan segmen acak baru. Kedua mode tetap membuat stempel waktu terlihat pada sepuluh karakter pertama.
