## Tentang konverter subtitle

Konversi file subtitle yang sudah ada di antara 19 format teks berwaktu, atau ekspor transkrip teks biasa. Penggunaan umum meliputi mengubah SRT menjadi VTT untuk video web, mengubah dialog ASS atau SSA menjadi SRT, menyiapkan subtitle untuk platform video, dan mengumpulkan beberapa episode hasil konversi dalam satu ZIP. Konversi berjalan di browser Anda; file subtitle dan konten yang ditempel tidak diunggah.

Alat ini memproses teks subtitle beserta waktunya. Pilih file atau tempel subtitle, pilih format output, lalu gunakan pratinjau untuk memeriksa hasilnya sebelum mengunduh. Anda dapat mengedit input yang ditempel dan mengonversinya lagi tanpa mengubah file asli di perangkat Anda.

## Cara mengonversi subtitle

1. Pilih **Pilih file** untuk membuka satu atau beberapa file subtitle, seret file ke panel input, atau tempel teks subtitle ke editor. **Coba contoh** memuat contoh SRT singkat dengan dua segmen subtitle.
2. Biarkan **Format input** pada **Deteksi otomatis** untuk penggunaan biasa. Deteksi memeriksa isi file, bukan hanya mengandalkan nama file. Pilih sendiri format sumber jika format file tidak jelas.
3. Pilih **Format output**. Untuk trek subtitle situs web pada umumnya, pilih WebVTT; untuk pemutar atau editor yang meminta file SRT, pilih SubRip.
4. Buka **Pengaturan konversi** saat Anda memerlukan enkode karakter file lain, laju bingkai, atau pergeseran waktu. Ubah pengaturan ini sebelum mengonversi.
5. Pilih **Konversi subtitle**. Hasilnya menunjukkan format sumber dan output, nama file output, serta jumlah segmen subtitle yang dikonversi.
6. Beralih antara **Pratinjau** dan **Isi file**, lalu salin teks hasil konversi atau unduh file. Tabel menampilkan hingga 100 segmen subtitle; isi file dan unduhan mencakup seluruh hasil.

**Hapus** menghapus input dan hasil saat ini dari halaman. Memilih sekelompok file baru akan menggantikan pilihan sebelumnya. Konverter tidak menyimpan riwayat subtitle, jadi unduh hasil yang ingin Anda simpan.

## Format yang didukung dan presisi output

Semua entri di bawah mendukung pembacaan dan penulisan kecuali TXT, yang merupakan ekspor untuk transkrip yang dapat dibaca. Setiap format menyimpan waktu dengan cara berbeda; memilih format berpresisi lebih rendah akan membulatkan penanda waktu ke satuan yang didukungnya.

| Format                               | Ekstensi  | Waktu yang ditulis                   |
| ------------------------------------ | --------- | ------------------------------------ |
| SubRip                               | `.srt`    | Milidetik                            |
| WebVTT                               | `.vtt`    | Milidetik                            |
| Advanced SubStation Alpha            | `.ass`    | Seperseratus detik                   |
| SubStation Alpha                     | `.ssa`    | Seperseratus detik                   |
| YouTube SubViewer                    | `.sbv`    | Milidetik                            |
| MicroDVD                             | `.sub`    | Bingkai video                        |
| SubViewer 2.0                        | `.sub`    | Seperseratus detik                   |
| SAMI                                 | `.smi`    | Milidetik                            |
| Lirik LRC                            | `.lrc`    | Seperseratus detik untuk waktu mulai |
| Timed Text                           | `.ttml`   | Milidetik                            |
| Distribution Format Exchange Profile | `.dfxp`   | Milidetik                            |
| YouTube SRV3                         | `.srv3`   | Milidetik                            |
| XML transkrip YouTube                | `.xml`    | Detik dengan presisi milidetik       |
| MPL2                                 | `.mpl`    | Sepersepuluh detik                   |
| Spruce Subtitle, format teks         | `.stl`    | Bingkai video                        |
| QuickTime Text                       | `.qt.txt` | Milidetik                            |
| JSON                                 | `.json`   | Angka milidetik                      |
| CSV                                  | `.csv`    | Angka milidetik                      |
| TSV                                  | `.tsv`    | Angka milidetik                      |
| Transkrip teks biasa, hanya ekspor   | `.txt`    | Tanpa penanda waktu                  |

Input TTML juga menerima file iTT yang kompatibel. DFXP termasuk dalam keluarga TTML. Mengekspor TTML tidak membuat ulang setiap profil, tata letak, atau aturan gaya khusus platform.

Ekstensi `.sub` di sini dapat berarti MicroDVD atau SubViewer berbasis teks. VobSub biner adalah format yang berbeda. Demikian pula, format `.stl` yang didukung adalah Spruce STL berbasis teks, bukan EBU STL biner. Pilih format berdasarkan nama lengkapnya jika ekstensi tersebut tidak jelas.

## Memilih antara SRT, VTT, ASS, dan teks biasa

**SRT** merupakan pilihan yang berguna saat pemutar video, editor, atau formulir unggahan meminta subtitle SubRip. **VTT** adalah format yang digunakan oleh trek teks video HTML dan juga dapat memuat pengaturan segmen khusus web. Konversi di antara keduanya mempertahankan teks subtitle dan waktu dalam milidetik sambil menyusun ulang sintaks file.

Segmen SRT bernomor menggunakan koma sebelum milidetik:

```text
1
00:00:01,250 --> 00:00:03,500
Hello, world!
```

Subtitle yang sama dalam WebVTT memiliki header file dan penanda waktu dengan titik desimal:

```text
WEBVTT

00:00:01.250 --> 00:00:03.500
Hello, world!
```

**ASS dan SSA** merupakan pilihan pertukaran yang berguna saat aplikasi berikutnya memerlukannya. Pemformatan tebal, miring, dan garis bawah yang didukung dapat dipindahkan di antara format yang mampu merepresentasikannya. Font, penempatan di layar, perintah menggambar, animasi karaoke, dan fitur tampilan lanjutan lainnya disederhanakan; peristiwa grafis ASS tanpa dialog yang dapat dibaca akan dilewati. Konverter berfokus pada subtitle yang dapat dibaca, bukan mereproduksi animasi atau tata letak yang telah dirancang.

**TXT** mengekstrak dialog yang dapat dibaca tanpa penanda waktu atau gaya. Pratinjaunya menampilkan teks yang diekspor sebagai pengganti tabel waktu. Ekspor TXT tidak membuat waktu subtitle, mentranskripsikan ucapan, atau menerjemahkan bahasa yang diucapkan.

## Enkode karakter file dan teks yang dapat dibaca

Dekode file otomatis menggunakan UTF-8, atau UTF-16 jika dikenali melalui penanda urutan byte. Untuk file lama, pilih enkode karakter aslinya jika karakter tampak salah atau file tidak dapat didekode. Pilihan yang tersedia mencakup Windows-1252, Windows-1251, GB18030, Big5, Shift_JIS, dan EUC-KR, serta pilihan UTF-8 dan UTF-16 secara eksplisit.

Misalnya, coba GB18030 untuk subtitle bahasa Tionghoa yang diketahui disimpan dengan enkode karakter tersebut, atau Shift_JIS untuk file bahasa Jepang dari aplikasi lama. Enkode karakter mengubah cara byte yang ada dibaca; enkode karakter tidak menerjemahkan maknanya. Konversi lagi setelah memilih enkode karakter yang berbeda. File subtitle yang diunduh menggunakan UTF-8, apa pun enkode karakter inputnya.

## Menyesuaikan waktu dan laju bingkai

### Geser semua subtitle lebih awal atau lebih lambat

Pergeseran waktu diukur dalam milidetik. Nilai `1500` menunda setiap subtitle selama 1,5 detik; `-500` menampilkan subtitle setengah detik lebih awal. Untuk subtitle yang dimulai pada `00:00:01.250`, kedua pengaturan tersebut masing-masing menghasilkan `00:00:02.750` dan `00:00:00.750`.

Pergeseran menggeser waktu mulai dan selesai, dengan mempertahankan durasi hingga mencapai awal linimasa. Subtitle yang seluruh waktunya bergeser sebelum nol dihapus; subtitle yang sebagian waktunya melewati nol dimulai dari nol. Pergeseran memperbaiki keterlambatan yang konstan. Pergeseran tidak memperbaiki trek subtitle yang selisih waktunya berubah sepanjang video.

### Gunakan laju bingkai untuk penanda waktu berbasis bingkai

MicroDVD dan Spruce STL menggunakan bingkai video, sehingga laju bingkainya menentukan hubungan bingkai dengan waktu yang berlalu. TTML juga dapat berisi waktu berbasis bingkai. Gunakan laju bingkai video sumber, seperti `23.976`, `24`, `25`, atau `29.97`, jika diperlukan untuk menafsirkan input.

Laju bingkai yang tersimpan dalam input diprioritaskan jika format menyediakannya. Untuk output berbasis bingkai, pengaturan yang dipilih menentukan laju bingkai yang ditulis. Mengubah pengaturan ini tidak menskalakan ulang penanda waktu jam SRT atau VTT biasa; pengaturan ini mengubah cara penanda waktu berbasis bingkai ditafsirkan atau ditulis.

### Pahami pembulatan dan waktu selesai yang hilang

SRT dan VTT mempertahankan presisi milidetik. ASS, SSA, SubViewer, dan LRC membulatkan ke seperseratus detik; MPL2 membulatkan ke sepersepuluh detik; output berbasis bingkai membulatkan ke bingkai. Subtitle yang sangat singkat tetap memiliki durasi positif setelah pembulatan. Pratinjau mencerminkan waktu format yang diekspor, bukan menampilkan penanda waktu input yang belum dibulatkan.

LRC dapat menyediakan waktu mulai tanpa waktu selesai. Waktu selesai yang hilang menggunakan waktu mulai berikutnya yang berbeda, atau dua detik untuk subtitle terakhir. Ekspor LRC tidak dapat mempertahankan jeda asli dan waktu selesai yang tumpang tindih, dan subtitle multibaris menjadi satu baris lirik. QuickTime Text menggunakan penanda linimasa; SAMI dan QuickTime dapat menyusun ulang subtitle yang tumpang tindih menjadi teks gabungan pada setiap batas waktu, sehingga hasilnya mungkin berisi jumlah segmen subtitle yang berbeda.

## Konversi banyak file dan unduhan ZIP

Pilih atau letakkan beberapa file untuk mengonversinya dengan format output dan pengaturan yang sama. Pilih hasil dari menu nama file untuk memeriksanya. File yang tidak dapat dikonversi tetap menampilkan kesalahannya masing-masing, sementara hasil yang berhasil tetap tersedia untuk diunduh satu per satu.

Saat setidaknya dua file berhasil dikonversi, **Unduh semua sebagai ZIP** mengumpulkan output tersebut. Arsip hanya berisi hasil konversi yang berhasil. Tinjau kesalahan yang terlihat, sesuaikan format input atau enkode karakter sebagaimana diperlukan, lalu konversi lagi untuk file yang tersisa.

Nama file output mempertahankan nama dasar sumber dan menggunakan ekstensi yang dipilih: misalnya, `episode01.srt` menjadi `episode01.vtt`. Jika beberapa hasil memiliki nama yang sama, akhiran seperti ` (2)` membedakan entri ZIP-nya. ZIP merupakan pilihan unduhan di sini; pilih file subtitle itu sendiri sebagai input.

## Pertukaran JSON, CSV, dan TSV

JSON menggunakan larik objek subtitle dengan nilai `start` dan `end` dalam milidetik serta string `text`:

```json
[
  { "start": 1250, "end": 3500, "text": "Hello, world!" },
  { "start": 4000, "end": 6000, "text": "Another caption." }
]
```

Pembaca juga menerima JSON bergaya Whisper yang berisi larik `segments`, dengan nilai `start` dan `end` segmen dalam detik. Ini merupakan konvensi input yang terpisah; ekspor JSON biasa tetap menggunakan milidetik.

CSV dan TSV menggunakan nama kolom `start`, `end`, dan `text`. Waktu input dapat berupa angka milidetik atau penanda waktu jam. CSV mengapit bidang yang berisi koma, tanda kutip, atau pergantian baris dengan tanda kutip; TSV menggunakan tab di antara kolom. Kedua ekspor menulis angka milidetik. Gunakan format ini saat memindahkan subtitle ke spreadsheet atau alur kerja pemrosesan subtitle lainnya.

## Pertanyaan umum

### Mengapa pratinjau dan teks yang diunduh tampak berbeda?

Tabel pratinjau menampilkan teks subtitle yang dapat dibaca dan waktu dalam format tujuan. Isi file menampilkan file sebenarnya yang telah diserialisasi, termasuk header, penomoran, pemisah, dan sintaks pemformatan yang didukung. Unduhan berisi seluruh konten yang telah diserialisasi tersebut, meskipun tabel berhenti pada 100 subtitle pertama.

### Mengapa gaya atau penempatan berubah?

Setiap format memiliki model gaya yang berbeda. Pemformatan dasar yang didukung dipertahankan jika dapat direpresentasikan; gaya lanjutan, penempatan segmen web, animasi, dan metadata platform tidak direproduksi sepenuhnya. Gunakan tampilan isi file untuk memeriksa ekspor dan uji di pemutar atau editor tempat Anda akan menggunakannya.

### Bisakah alat ini mengekstrak subtitle dari video atau trek gambar?

Mulailah dengan file subtitle teks yang sudah ada. Ekstrak terlebih dahulu trek subtitle yang tertanam dalam video. Trek PGS/SUP dan VobSub/IDX berbasis gambar memerlukan OCR agar menjadi teks; EBU STL biner memerlukan editor subtitle yang dapat membaca format tersebut.

### Di mana saya dapat memeriksa spesifikasi format?

Lihat [spesifikasi WebVTT](https://www.w3.org/TR/webvtt1/), [spesifikasi TTML](https://www.w3.org/TR/ttml2/), dan [format subtitle yang didukung YouTube](https://support.google.com/youtube/answer/2734698) untuk sintaks file dan persyaratan platformnya.
