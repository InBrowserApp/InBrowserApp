## Cara meningkatkan resolusi imej dengan AI

1. Pilih atau seret dan lepaskan imej JPG, PNG atau WebP. Gunakan salinan terbaik yang anda ada walaupun imejnya kecil.
2. Pilih **2×** atau **4×** dan semak dimensi hasilnya. Imej 400 × 300 menjadi 800 × 600 pada 2× atau 1600 × 1200 pada 4×.
3. Pilih **Besarkan imej**, kemudian gerakkan peluncur perbandingan untuk melihat garis tepi dan tekstur. Muat turun hasil sebagai PNG tanpa kehilangan data.

## Apakah itu super-resolusi imej dengan AI?

Super-resolusi menambah bilangan piksel pada lebar dan tinggi imej beresolusi rendah. InBrowser.App menggunakan Real-ESRGAN, model yang telah dilatih untuk menganggarkan garis tepi yang lebih jelas dan tekstur yang lebih halus daripada piksel sedia ada. Teknik ini boleh menjadikan foto kecil, ilustrasi dan imej web termampat kelihatan lebih jelas selepas dibesarkan. Semak wajah, teks kecil dan corak halus dalam pratonton. Butiran baharu ialah anggaran model dan mungkin berbeza daripada pemandangan asal.

## Patutkah saya memilih pembesaran 2× atau 4×?

Pilih 2× untuk pembesaran sederhana, seperti apabila menggunakan imej kecil dalam reka letak yang lebih besar. Pilih 4× apabila imej perlu memenuhi ruang yang jauh lebih besar, seperti memaparkan imbasan kecil pada saiz yang lebih besar. Menggandakan panjang setiap sisi menghasilkan empat kali ganda bilangan piksel. Membesarkan setiap sisi empat kali ganda menghasilkan enam belas kali ganda bilangan piksel. Imej input boleh berukuran sehingga 2,048 piksel pada setiap sisi dan 1 megapiksel secara keseluruhan.

## Adakah imej dibesarkan pada peranti saya?

Ya. Pelayar anda memuat turun model Real-ESRGAN apabila anda mula membesarkan imej buat kali pertama. Imej diproses pada peranti anda melalui WebGPU jika tersedia, atau menggunakan CPU melalui WebAssembly. Proses pertama mungkin mengambil masa lebih lama. Masa pemprosesan bergantung pada saiz imej dan peranti anda. Imej kekal pada peranti anda sepanjang proses.
