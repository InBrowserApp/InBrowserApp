Jana ULID secara setempat dalam pelayar anda untuk rekod, peristiwa, log, lekapan, dan sistem teragih yang memerlukan pengecam padat dengan awalan yang boleh diisih mengikut masa. Setiap nilai dicipta pada peranti ini dan boleh disalin atau dimuat turun tanpa menghantar kelompok itu kepada perkhidmatan lain.

## Mengapa Guna ULID

ULID bermaksud Universally Unique Lexicographically Sortable Identifier. Ia menggabungkan cap masa milisaat Unix 48-bit dengan 80 bit kerawakan, kemudian mengekodkan hasilnya sebagai rentetan Crockford Base32 26 aksara. Bentuk ini menjadikan ULID selamat untuk URL, mesra pangkalan data, dan boleh diisih secara semula jadi mengikut masa penciptaan.

## Masa Semasa Atau Tersuai

Gunakan masa semasa untuk rekod aplikasi biasa, kunci import, dan data ujian yang sepatutnya mencerminkan masa ia dicipta. Tukar kepada cap masa tersuai apabila anda memerlukan sampel yang kelihatan deterministik, baris yang diisi semula, peristiwa yang dimainkan semula, atau lekapan yang perlu diisih sekitar detik tertentu.

## Kelompok Monotonik

Apabila mod kelompok monotonik didayakan, ID yang dijana untuk milisaat yang sama akan menambah segmen rawaknya supaya kelompok kekal diisih secara leksikografi dari atas ke bawah. Lumpuhkannya apabila anda mahu setiap baris menggunakan segmen rawak yang baharu. Mana-mana mod tetap mengekalkan cap masa kelihatan dalam sepuluh aksara pertama.
