Jana pengecam UUID v1 secara setempat dalam pelayar anda apabila anda memerlukan nilai yang merangkumi masa penciptaan dan pengecam nod. Alat ini berguna untuk integrasi legasi, import pangkalan data, lekapan tersusun, dan sistem yang masih menjangkakan UUID versi 1 RFC 4122.

## Apabila UUID v1 Membantu

UUID v1 menyimpan cap masa, jujukan jam, dan nilai nod 48-bit dalam rentetan UUID 36 aksara standard. Ini menjadikan ID yang dijana lebih kurang boleh diisih mengikut masa penciptaan sambil tetap sesuai untuk sistem yang menerima lajur UUID biasa, URL, log, dan muatan API.

## Privasi Dan Pengecam Nod

Penjanaan UUID v1 klasik menggunakan alamat MAC kad rangkaian sebenar, yang boleh mendedahkan maklumat perkakasan. Alat ini bermula dengan alamat MAC rawak yang ditadbir secara setempat. Anda boleh memasukkan nilai nod tertentu apabila memadankan sistem legasi, tetapi elakkan menggunakan alamat perkakasan sebenar dalam sampel awam atau data yang dikongsi.

## Jujukan Jam Dan Penjanaan Kelompok

Jujukan jam ialah nilai 14-bit yang membantu mengelakkan perlanggaran apabila nod yang sama menjana ID sekitar masa yang sama. Penjanaan kelompok mengekalkan semua ID dalam milisaat yang sama dan menokok detik 100 nanosaat untuk setiap baris, supaya setiap nilai dalam keputusan kekal berbeza.
