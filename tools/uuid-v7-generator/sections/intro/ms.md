UUID v7 ialah format UUID moden yang meletakkan cap masa milisaat Unix di bahagian hadapan pengecam dan mengisi bit selebihnya dengan nilai rawak. Ini menjadikan nilai tersebut unik secara global dalam amalan, sambil mengekalkannya boleh diisih secara semula jadi mengikut masa penciptaan.

## Fungsi Alat Ini

Penjana ini mencipta nilai UUID v7 sepenuhnya dalam pelayar anda. Anda boleh menjana satu pengecam atau satu kelompok sehingga 100, kemudian menyalin senarai tersebut atau memuat turunnya sebagai fail teks untuk data benih, rekod pangkalan data, lekapan peristiwa, atau muatan ujian.

## Masa Semasa Atau Tersuai

Gunakan masa semasa untuk rekod aplikasi biasa, kunci import, dan data ujian yang sepatutnya mencerminkan masa ia dicipta. Tukar kepada cap masa tersuai apabila anda memerlukan sampel yang kelihatan deterministik, baris yang diisi semula, peristiwa yang dimainkan semula, atau lekapan yang perlu diisih sekitar detik tertentu.

## Bila UUID v7 Berguna

UUID v7 berguna apabila anda mahukan pengecam legap yang masih boleh diisih dengan baik dalam pangkalan data, log, baris gilir dan aliran peristiwa teragih. Berbanding dengan nilai UUID v4 rawak, UUID v7 mengurangkan gangguan indeks kerana rekod yang lebih baharu cenderung muncul berhampiran penghujung ruang kunci yang diisih.

## Nota tentang Isihan dan Keselamatan

Bahagian cap masa merekodkan milisaat, bukan nilai peribadi atau rahsia. Jika pengecam tidak sepatutnya mendedahkan anggaran masa penciptaan, gunakan format rawak sepenuhnya. Dalam satu kelompok yang dijana, alat ini memastikan nilai kekal monotonik untuk milisaat yang sama sambil mengekalkan bit versi dan varian UUID v7.
