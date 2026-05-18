# Apakah penyahkod UUID?

Penyahkod UUID menerangkan struktur di dalam pengecam unik sejagat. Alat ini menormalkan format biasa yang ditampal, menyemak bahawa nilai itu ialah UUID 128-bit, dan menunjukkan versi, varian, bait heksadesimal mentah, serta perwakilan angka yang sedia disalin.

UUID sering dianggap sebagai rentetan legap, tetapi nibble versi memberitahu cara pengecam itu dicipta. UUID versi 4 adalah rawak, versi 3 dan 5 ialah hash berasaskan nama, dan versi tertib masa seperti 1, 6, dan 7 boleh membawa maklumat cap masa.

## Bila menggunakannya

Gunakan alat ini apabila anda perlu memeriksa pengecam daripada log, pangkalan data, API, surihan, atau lekapan ujian. Alat ini berguna untuk mengesahkan sama ada UUID rawak atau berasaskan masa, menukarnya kepada perpuluhan atau Base64 untuk sistem lain, dan mengesan sama ada medan nod UUID v1 atau v6 mungkin mendedahkan pengecam gaya MAC.

Penyahkod ini berjalan dalam penyemak imbas anda dan tidak menghantar nilai UUID ke pelayan. Ia menerima UUID kanonik, nilai `urn:uuid:`, UUID dengan kurungan kurawal, input huruf besar, dan UUID heksadesimal 32 aksara tanpa sempang.

## Perkara yang perlu diperhatikan

Medan versi dan varian UUID menerangkan reka letak bit, bukan sama ada pengecam itu benar-benar unik secara global dalam amalan. UUID yang kelihatan sah masih boleh diduplikasi jika ia dijana dengan buruk atau tersalin secara tidak sengaja.

Untuk UUID versi 1 dan versi 6, medan nod boleh kelihatan seperti alamat MAC. Penjana moden mungkin menetapkan bit multicast dan menggunakan nod rawak sebaliknya, jadi anggap ia sebagai pengecam nod melainkan anda mengawal penjananya.
