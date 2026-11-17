## Mengenai penukar sari kata

Tukar fail sari kata sedia ada antara 19 format teks bermasa, atau eksport transkrip teks biasa. Kegunaan lazim termasuk menukar SRT kepada VTT untuk video web, menukar dialog ASS atau SSA kepada SRT, menyediakan sari kata untuk platform video, dan mengumpulkan beberapa episod yang telah ditukar dalam satu ZIP. Penukaran berjalan dalam pelayar anda; fail sari kata dan kandungan yang ditampal tidak dimuat naik.

Alat ini memproses teks sari kata dan pemasaannya. Pilih fail atau tampal sari kata, pilih format output, dan gunakan pratonton untuk menyemak hasil sebelum memuat turun. Anda boleh menyunting input yang ditampal dan menukarnya semula tanpa mengubah fail asal pada peranti anda.

## Cara menukar sari kata

1. Pilih **Pilih fail** untuk membuka satu atau lebih fail sari kata, seret fail ke panel input, atau tampal teks sari kata ke dalam penyunting. **Cuba contoh** memuatkan sampel SRT ringkas dengan dua segmen sari kata.
2. Biarkan **Format input** pada **Kesan secara automatik** untuk kegunaan biasa. Pengesanan meneliti kandungan dan bukan hanya bergantung pada nama fail. Pilih sendiri format sumber jika format fail tidak jelas.
3. Pilih **Format output**. Untuk trek sari kata laman web biasa, pilih WebVTT; untuk pemain atau penyunting yang memerlukan fail SRT, pilih SubRip.
4. Buka **Tetapan penukaran** apabila anda memerlukan pengekodan fail lain, kadar bingkai, atau anjakan masa. Ubah tetapan ini sebelum menukar.
5. Pilih **Tukar sari kata**. Hasilnya menyatakan format sumber dan output, nama fail output, serta bilangan segmen sari kata yang ditukar.
6. Beralih antara **Pratonton** dan **Kandungan fail**, kemudian salin teks yang ditukar atau muat turun fail. Jadual memaparkan sehingga 100 segmen sari kata; kandungan fail dan muat turun merangkumi hasil yang lengkap.

**Kosongkan** mengalih keluar input dan hasil semasa daripada halaman. Memilih kumpulan fail baharu menggantikan pilihan sebelumnya. Penukar ini tidak menyimpan sejarah sari kata, jadi muat turun hasil yang ingin anda simpan.

## Format yang disokong dan ketepatan output

Semua format di bawah menyokong pembacaan dan penulisan kecuali TXT, yang digunakan untuk mengeksport transkrip yang boleh dibaca. Format yang berbeza menyimpan masa dengan cara yang berbeza; memilih format dengan ketepatan lebih rendah membundarkan cap masa kepada unit yang disokongnya.

| Format                               | Sambungan | Pemasaan yang ditulis           |
| ------------------------------------ | --------- | ------------------------------- |
| SubRip                               | `.srt`    | Milisaat                        |
| WebVTT                               | `.vtt`    | Milisaat                        |
| Advanced SubStation Alpha            | `.ass`    | Perseratus saat                 |
| SubStation Alpha                     | `.ssa`    | Perseratus saat                 |
| YouTube SubViewer                    | `.sbv`    | Milisaat                        |
| MicroDVD                             | `.sub`    | Bingkai video                   |
| SubViewer 2.0                        | `.sub`    | Perseratus saat                 |
| SAMI                                 | `.smi`    | Milisaat                        |
| Lirik LRC                            | `.lrc`    | Perseratus saat untuk masa mula |
| Timed Text                           | `.ttml`   | Milisaat                        |
| Distribution Format Exchange Profile | `.dfxp`   | Milisaat                        |
| YouTube SRV3                         | `.srv3`   | Milisaat                        |
| XML transkrip YouTube                | `.xml`    | Saat dengan ketepatan milisaat  |
| MPL2                                 | `.mpl`    | Persepuluh saat                 |
| Spruce Subtitle, format teks         | `.stl`    | Bingkai video                   |
| QuickTime Text                       | `.qt.txt` | Milisaat                        |
| JSON                                 | `.json`   | Nombor milisaat                 |
| CSV                                  | `.csv`    | Nombor milisaat                 |
| TSV                                  | `.tsv`    | Nombor milisaat                 |
| Transkrip teks biasa, eksport sahaja | `.txt`    | Tiada cap masa                  |

Input TTML turut menerima fail iTT yang serasi. DFXP tergolong dalam keluarga TTML. Eksport TTML tidak menghasilkan semula setiap profil, susun atur atau peraturan penggayaan khusus platform.

Sambungan `.sub` di sini boleh merujuk kepada MicroDVD berasaskan teks atau SubViewer. VobSub binari ialah format yang berbeza. Begitu juga, format `.stl` yang disokong ialah Spruce STL berasaskan teks, bukannya EBU STL binari. Pilih format mengikut nama penuhnya apabila sambungan ini tidak jelas.

## Memilih antara SRT, VTT, ASS dan teks biasa

**SRT** ialah pilihan yang berguna apabila pemain video, penyunting atau borang muat naik memerlukan sari kata SubRip. **VTT** ialah format yang digunakan oleh trek teks video HTML dan turut boleh membawa tetapan segmen sari kata khusus web. Penukaran antara kedua-duanya mengekalkan teks sari kata dan pemasaan milisaat sambil membina semula sintaks fail.

Segmen SRT bernombor menggunakan koma sebelum milisaat:

```text
1
00:00:01,250 --> 00:00:03,500
Hello, world!
```

Sari kata yang sama dalam WebVTT mempunyai pengepala fail dan cap masa bertitik perpuluhan:

```text
WEBVTT

00:00:01.250 --> 00:00:03.500
Hello, world!
```

**ASS dan SSA** ialah pilihan pertukaran yang berguna apabila aplikasi seterusnya memerlukannya. Pemformatan tebal, condong dan garis bawah yang disokong boleh dikekalkan antara format yang dapat mewakilinya. Fon, kedudukan pada skrin, arahan lukisan, animasi karaoke dan ciri persembahan lanjutan lain dipermudahkan; peristiwa grafik ASS tanpa dialog yang boleh dibaca dilangkau. Penukar ini menumpukan pada sari kata yang boleh dibaca dan bukannya menghasilkan semula animasi atau susun atur yang dikarang.

**TXT** mengekstrak dialog yang boleh dibaca tanpa cap masa atau penggayaan. Pratontonnya memaparkan teks yang dieksport dan bukannya jadual pemasaan. Eksport TXT tidak mencipta pemasaan sari kata, mentranskripsikan pertuturan atau menterjemahkan bahasa yang dituturkan.

## Pengekodan fail dan teks yang boleh dibaca

Penyahkodan fail automatik menggunakan UTF-8, atau UTF-16 apabila dikenal pasti melalui tanda tertib bait. Untuk fail lama, pilih pengekodan asal jika aksara kelihatan salah atau fail tidak dapat dinyahkod. Pilihan yang tersedia termasuk Windows-1252, Windows-1251, GB18030, Big5, Shift_JIS dan EUC-KR, serta pilihan khusus UTF-8 dan UTF-16.

Contohnya, cuba GB18030 untuk sari kata bahasa Cina yang diketahui telah disimpan dalam pengekodan tersebut, atau Shift_JIS untuk fail bahasa Jepun daripada aplikasi lama. Pengekodan mengubah cara bait sedia ada dibaca; ia tidak menterjemahkan maknanya. Tukar semula selepas memilih pengekodan yang berbeza. Fail sari kata yang dimuat turun menggunakan UTF-8, tanpa mengira pengekodan input.

## Melaraskan pemasaan dan kadar bingkai

### Anjak semua sari kata lebih awal atau lebih lewat

Anjakan masa diukur dalam milisaat. Nilai `1500` melambatkan setiap segmen sari kata sebanyak 1.5 saat; `-500` memaparkan sari kata setengah saat lebih awal. Untuk segmen sari kata yang bermula pada `00:00:01.250`, tetapan tersebut masing-masing menghasilkan `00:00:02.750` dan `00:00:00.750`.

Anjakan mengubah kedua-dua masa mula dan tamat, sambil mengekalkan tempohnya sehingga mencapai permulaan garis masa. Segmen sari kata yang dianjak sepenuhnya ke sebelum sifar dialih keluar; segmen sari kata yang sebahagiannya melintasi sifar bermula pada sifar. Anjakan membetulkan kelewatan yang tetap. Ia tidak membetulkan trek sari kata yang penyimpangan masanya berubah sepanjang video.

### Gunakan kadar bingkai untuk cap masa berasaskan bingkai

MicroDVD dan Spruce STL menggunakan bingkai video, jadi kadar bingkainya menentukan cara bingkai dipadankan dengan masa berlalu. TTML juga boleh mengandungi pemasaan berasaskan bingkai. Gunakan kadar bingkai video sumber, seperti `23.976`, `24`, `25` atau `29.97`, apabila diperlukan untuk mentafsir input.

Kadar bingkai input terbenam diutamakan apabila format menyediakannya. Untuk output berasaskan bingkai, tetapan yang dipilih menentukan kadar bingkai yang ditulis. Mengubah tetapan ini tidak menskalakan semula cap masa jam SRT atau VTT biasa; ia mengubah cara cap masa berasaskan bingkai ditafsir atau ditulis.

### Fahami pembundaran dan masa tamat yang tiada

SRT dan VTT mengekalkan ketepatan milisaat. ASS, SSA, SubViewer dan LRC membundarkan kepada perseratus saat; MPL2 membundarkan kepada persepuluh saat; output berasaskan bingkai membundarkan kepada bingkai. Segmen sari kata yang sangat pendek mengekalkan tempoh positif selepas pembundaran. Pratonton mencerminkan pemasaan format yang dieksport, dan bukannya memaparkan cap masa input yang belum dibundarkan.

LRC boleh menyediakan masa mula tanpa masa tamat. Masa tamat yang tiada menggunakan masa mula berbeza yang seterusnya, atau dua saat untuk segmen sari kata terakhir. Eksport LRC tidak dapat mengekalkan sela asal dan masa tamat yang bertindih, dan sari kata berbilang baris menjadi baris lirik tunggal. QuickTime Text menggunakan penanda garis masa; SAMI dan QuickTime boleh membina semula sari kata yang bertindih sebagai teks gabungan pada setiap sempadan pemasaan, jadi hasilnya mungkin mengandungi bilangan segmen sari kata yang berbeza.

## Penukaran kelompok dan muat turun ZIP

Pilih atau lepaskan beberapa fail untuk menukarnya dengan format output dan tetapan yang sama. Pilih hasil daripada menu nama fail untuk menyemaknya. Fail yang tidak dapat ditukar mengekalkan ralat masing-masing, manakala hasil yang berjaya kekal tersedia untuk dimuat turun secara individu.

Apabila sekurang-kurangnya dua fail berjaya ditukar, **Muat turun semua sebagai ZIP** mengumpulkan output tersebut. Arkib hanya mengandungi penukaran yang berjaya. Semak ralat yang dipaparkan, laraskan format input atau pengekodan mengikut keperluan, dan tukar semula mana-mana fail yang masih berbaki.

Nama fail output mengekalkan nama asas sumber dan menggunakan sambungan yang dipilih: `episode01.srt` menjadi `episode01.vtt`, contohnya. Jika beberapa hasil mempunyai nama yang sama, akhiran seperti ` (2)` membezakan entri ZIP masing-masing. ZIP ialah pilihan muat turun di sini; pilih fail sari kata itu sendiri sebagai input.

## Pertukaran JSON, CSV dan TSV

JSON menggunakan tatasusunan objek sari kata dengan nilai `start` dan `end` dalam milisaat serta rentetan `text`:

```json
[
  { "start": 1250, "end": 3500, "text": "Hello, world!" },
  { "start": 4000, "end": 6000, "text": "Another caption." }
]
```

Pembaca juga menerima JSON gaya Whisper yang mengandungi tatasusunan `segments`, dengan nilai `start` dan `end` segmen dalam saat. Ini ialah konvensyen input yang berasingan; eksport JSON biasa terus menggunakan milisaat.

CSV dan TSV menggunakan nama lajur `start`, `end` dan `text`. Masa input boleh berupa nombor milisaat atau cap masa jam. CSV meletakkan tanda petik pada medan yang mengandungi koma, tanda petik atau pemisah baris; TSV menggunakan tab antara lajur. Kedua-dua eksport menulis nombor milisaat. Gunakan format ini apabila memindahkan sari kata ke dalam hamparan atau aliran kerja pemprosesan sari kata yang lain.

## Soalan lazim

### Mengapakah pratonton dan teks yang dimuat turun kelihatan berbeza?

Jadual pratonton memaparkan teks sari kata yang boleh dibaca dan pemasaan format sasaran. Kandungan fail memaparkan fail sebenar yang telah disirikan, termasuk pengepala, penomboran, pembatas dan sintaks pemformatan yang disokong. Muat turun mengandungi kandungan bersiri yang lengkap itu, walaupun jadual hanya memaparkan 100 segmen sari kata pertama.

### Mengapakah penggayaan atau kedudukan berubah?

Format tidak berkongsi model penggayaan yang sama. Pemformatan asas yang disokong dikekalkan apabila dapat diwakili; gaya lanjutan, kedudukan segmen sari kata web, animasi dan metadata platform tidak dihasilkan semula sepenuhnya. Gunakan paparan kandungan fail untuk menyemak eksport dan mengujinya dalam pemain atau penyunting yang akan anda gunakan.

### Bolehkah alat ini mengekstrak sari kata daripada video atau trek imej?

Mulakan dengan fail sari kata teks sedia ada. Ekstrak trek sari kata terbenam daripada video terlebih dahulu. Trek PGS/SUP dan VobSub/IDX berasaskan imej memerlukan OCR untuk menjadi teks; EBU STL binari memerlukan penyunting sari kata yang boleh membaca format tersebut.

### Di manakah saya boleh menyemak spesifikasi format?

Lihat [spesifikasi WebVTT](https://www.w3.org/TR/webvtt1/), [spesifikasi TTML](https://www.w3.org/TR/ttml2/), dan [format sari kata yang disokong YouTube](https://support.google.com/youtube/answer/2734698) untuk sintaks fail dan keperluan platform masing-masing.
