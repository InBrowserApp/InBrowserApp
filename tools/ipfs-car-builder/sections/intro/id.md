## Buat file CAR dari beberapa file atau satu folder

Pilih file atau folder, lalu pilih **Buat CAR**. Salin CID akar dan simpan arsip `.car`. Browser membaca pilihan Anda secara lokal dan mengemasnya menjadi arsip CARv1 dengan akar UnixFS. Anda dapat menyimpan arsip sebagai cadangan atau mengimpornya ke node IPFS atau layanan penyimpanan.

## Cara arsip mempertahankan file Anda

Jika hanya ada satu file, file itu menjadi akar. Beberapa file dikelompokkan dalam satu folder akar. Jika Anda memilih folder, jalur file di dalamnya tetap sama. Pemilih folder di browser menyediakan file beserta jalurnya. Seret dan lepas folder untuk menyertakan subfolder kosong jika browser Anda mendukungnya.

## Arti CID akar

CID akar mengidentifikasi file atau folder yang dikemas. Pembuat CAR memakai pengaturan CIDv1 bawaan yang sama dengan Kalkulator CID IPFS. Struktur input yang sama akan menghasilkan pengenal konten yang sama. Untuk menambahkan arsip ke Kubo, jalankan `ipfs dag import archive.car` dengan nama file yang Anda unduh. [Referensi perintah Kubo](https://docs.ipfs.tech/reference/kubo/cli/#ipfs-dag-import)
