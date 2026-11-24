## Cipta fail CAR daripada fail atau folder

Pilih fail atau folder, kemudian pilih **Cipta CAR**. Salin CID akar dan simpan arkib `.car`. Pelayar membaca pilihan anda pada peranti dan membungkusnya sebagai arkib CARv1 dengan akar UnixFS. Anda boleh menyimpan arkib sebagai sandaran atau mengimportnya ke dalam nod IPFS atau perkhidmatan storan.

## Cara arkib mengekalkan fail anda

Jika anda memilih satu fail, fail itu menjadi akar. Beberapa fail dikumpulkan dalam satu folder akar. Jika anda memilih folder, laluan fail di dalamnya dikekalkan. Pemilih folder pelayar memberikan fail berserta laluannya. Seret dan lepas folder untuk menyertakan subfolder kosong jika pelayar anda menyokongnya.

## Maksud CID akar

CID akar mengenal pasti fail atau folder yang dibungkus. Pencipta CAR menggunakan tetapan CIDv1 lalai yang sama seperti Kalkulator CID IPFS. Struktur input yang sama menghasilkan pengecam kandungan yang sama. Untuk menambah arkib pada Kubo, jalankan `ipfs dag import archive.car` dengan nama fail yang dimuat turun. [Rujukan perintah Kubo](https://docs.ipfs.tech/reference/kubo/cli/#ipfs-dag-import)
