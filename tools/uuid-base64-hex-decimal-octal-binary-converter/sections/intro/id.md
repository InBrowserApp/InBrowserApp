## Apa yang dikonversi alat ini

Konverter ini memperlakukan UUID sebagai nilai 128-bit sebagaimana aslinya dan
menjaga representasi umum tetap sinkron. Tempel UUID, nilai Base64, string
heksadesimal, bilangan bulat desimal, nilai oktal, atau nilai biner, lalu format
lainnya akan diperbarui secara lokal di browser Anda.

## Cara membaca format

Bidang UUID menampilkan bentuk kanonis dengan tanda hubung. Heksadesimal adalah
16 byte yang sama sebagai 32 digit hex huruf kecil. Base64 adalah Base64 standar
dengan padding untuk 16 byte mentah, bukan Base64 untuk karakter teks UUID.
Desimal, oktal, dan biner menampilkan UUID sebagai satu bilangan bulat 128-bit
tak bertanda; output biner diberi padding di kiri hingga penuh 128 bit agar nol
di awal tetap terlihat.

## Hal yang perlu diperhatikan

Nilai di luar rentang UUID 128-bit ditolak. Input Base64 harus didekode menjadi
tepat 16 byte. Konverter menerima varian umum yang ditempel seperti UUID huruf
besar, prefiks `urn:uuid:`, kurung kurawal, UUID 32-hex ringkas, spasi kosong di
sekitar nilai numerik panjang, dan Base64 URL-safe. Tidak ada apa pun yang
diunggah saat Anda mengonversi atau membuat UUID contoh.
