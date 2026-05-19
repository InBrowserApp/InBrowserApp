UUID v7 adalah format UUID modern yang menempatkan stempel waktu Unix dalam milidetik di bagian depan pengenal dan mengisi bit sisanya dengan keacakan. Ini membuat nilainya unik secara global dalam praktik, sekaligus tetap dapat diurutkan secara alami berdasarkan waktu pembuatan.

## Fungsi Alat Ini

Generator ini membuat nilai UUID v7 sepenuhnya di browser Anda. Anda dapat membuat satu pengenal atau satu batch hingga 100, lalu menyalin daftar tersebut atau mengunduhnya sebagai file teks untuk data awal, rekaman basis data, fixture peristiwa, atau payload pengujian.

## Waktu Saat Ini Atau Kustom

Gunakan waktu saat ini untuk rekaman aplikasi normal, kunci impor, dan data pengujian yang harus mencerminkan kapan data itu dibuat. Beralihlah ke stempel waktu kustom saat Anda membutuhkan sampel yang tampak deterministik, baris yang diisi mundur, peristiwa yang diputar ulang, atau fixture yang harus terurut di sekitar momen tertentu.

## Kapan UUID v7 Berguna

UUID v7 berguna saat Anda menginginkan pengenal buram yang tetap terurut dengan baik di basis data, log, antrean, dan aliran peristiwa terdistribusi. Dibandingkan dengan nilai UUID v4 acak, UUID v7 mengurangi perubahan indeks karena rekaman yang lebih baru cenderung muncul di dekat akhir ruang kunci yang terurut.

## Catatan tentang Keterurutan dan Keamanan

Bagian stempel waktu merekam milidetik, bukan nilai privat atau rahasia. Jika sebuah pengenal tidak boleh mengungkap perkiraan waktu pembuatan, gunakan format yang sepenuhnya acak sebagai gantinya. Dalam satu batch yang dibuat, alat ini menjaga nilai tetap monotonik untuk milidetik yang sama sambil mempertahankan bit versi dan varian UUID v7.
