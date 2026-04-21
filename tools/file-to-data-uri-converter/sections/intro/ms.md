## Apa itu Data URI?

Data URI (atau data URL) menyematkan fail kecil terus ke dalam teks. Format: `data:[mime][;charset][;base64],data`.

**Penggunaan biasa:**

- Imej atau fon sebaris dalam HTML/CSS
- Simpan aset kecil dalam JSON/konfig

**Nota:**

- Sesuai untuk fail kecil; rentetan panjang boleh memperlahankan halaman
- Base64 biasa digunakan untuk data binari

### Contoh

```text
data:image/svg+xml;base64,PHN2ZyB4bWxucz0i...
```

Bahagian sebelum koma menerangkan fail, seperti jenis MIME dan sama ada ia menggunakan Base64. Bahagian selepas koma ialah muatan yang telah dikodkan.

### Bila penukar ini sesuai digunakan

- Menukar fail setempat kepada rentetan yang boleh dibenamkan dalam HTML, CSS, JSON atau templat e-mel
- Membina demo kendiri dengan cepat tanpa perlu mengehos aset di tempat lain
- Menyemak jenis MIME yang dikesan sebelum menampal hasil ke alat lain

### Had praktikal

- Data URI paling sesuai untuk fail kecil seperti ikon, imej kecil atau petikan pendek
- Base64 menambah kira-kira 33% lebihan, jadi rentetan akhir lebih besar daripada fail asal
- Rentetan yang sangat panjang boleh menyukarkan penampalan ke dalam borang, konfigurasi atau editor yang mempunyai had saiz
