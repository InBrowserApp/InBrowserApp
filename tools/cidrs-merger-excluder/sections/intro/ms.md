## Fungsi Alat Ini

Alat ini menggabungkan blok CIDR menjadi set setara yang paling kecil, kemudian menolak sebarang blok CIDR yang anda letakkan dalam senarai pengecualian. Ia menyokong IPv4 dan IPv6 dalam proses yang sama, dan semua pemprosesan berlaku secara setempat dalam pelayar anda.

## Cara Gabung dan Kecualikan Berfungsi

Senarai gabung dinormalkan dahulu: bit hos dikosongkan, rangkaian yang bertindih digabungkan, dan rangkaian bersebelahan diringkaskan apabila ia boleh diwakili oleh blok CIDR yang lebih pendek. Selepas itu, senarai pengecualian ditolak daripada julat yang digabungkan. Output akhir dikembangkan semula menjadi senarai CIDR minimum yang meliputi dengan tepat apa yang tinggal.

## Bila Ini Berguna

Gunakannya semasa membersihkan peraturan tembok api, menyediakan entri kumpulan keselamatan awan, menyemak senarai benarkan VPN, meringkaskan jadual laluan, atau membuang julat simpanan daripada peruntukan yang lebih besar. Ia amat membantu apabila konfigurasi yang disalin mengandungi blok yang bertindih atau apabila rangkaian yang luas perlu membuang beberapa julat yang lebih kecil.

## Nota Input

Masukkan satu CIDR setiap baris, atau asingkan berbilang CIDR dengan koma. Blok IPv4 dan IPv6 boleh ditampal bersama-sama, tetapi pengecualian hanya digunakan pada blok daripada keluarga alamat yang sama. Entri tidak sah dilaporkan bersama senarai dan nombor barisnya supaya anda boleh membetulkan input tampalan yang besar tanpa meneka.
