UUID v1 dan UUID v6 mengandungi maklumat teras yang sama: cap masa, jujukan jam dan pengecam nod. UUID v1 menyimpan cap masa dalam tertib medan UUID historis, manakala UUID v6 menyusun semula bit cap masa tersebut supaya pengisihan leksikografi mudah mengikut masa penciptaan dengan lebih semula jadi.

Gunakan alat ini apabila anda perlu memindahkan pengecam antara sistem yang mengharapkan susun atur UUID berasaskan masa yang berbeza. Tampal UUID v1 untuk mendapatkan UUID v6 yang setara, atau tampal UUID v6 untuk memulihkan perwakilan UUID v1. Penukaran ini deterministik dan mengekalkan jujukan jam serta bait nod tanpa perubahan.

## Bila menggunakannya

- Memigrasikan rekod daripada storan UUID v1 legasi kepada UUID v6 sambil mengekalkan metadata identiti.
- Menyahpepijat pangkalan data, log atau baris gilir yang mencampurkan nilai UUID v1 dan UUID v6.
- Menyemak sama ada nilai UUID v6 boleh dipetakan kembali kepada nilai UUID v1 yang dijangka oleh integrasi lama.

## Format masukan

Penukar ini menerima rentetan UUID kanonik dengan tanda sempang, rentetan UUID padat 32 aksara, UUID huruf besar, nilai `urn:uuid:`, dan UUID yang diapit tanda kurung kurawal. Hasil sentiasa dinormalkan kepada bentuk UUID kanonik huruf kecil.

## Nota privasi dan keserasian

UUID v1 dan UUID v6 boleh mengekod masa penciptaan dan maklumat nod. Anggapnya sebagai pengecam operasi, bukan rahsia, dan elakkan daripada mendedahkannya apabila metadata cap masa atau nod mungkin sensitif. Alat ini berjalan secara setempat dalam penyemak imbas anda dan tidak memuat naik UUID anda.
