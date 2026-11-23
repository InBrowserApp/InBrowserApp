## Cara menerapkan JSON Patch

Tempel dokumen JSON asli di editor pertama dan array JSON Patch RFC 6902 di editor kedua. Pilih **Terapkan patch** untuk melihat pratinjau dan menyalin JSON yang diperbarui. Untuk membuat patch, bandingkan dokumen asli dan dokumen yang diubah di [Pembanding JSON Berbasis Jalur](../json-diff-path/), lalu salin keluaran **JSON Patch**. Terapkan patch ke dokumen asli yang sama.

## Contoh JSON Patch

Dokumen asli berisi sebuah status dan satu tag.

```json
{
  "status": "draft",
  "tags": ["api"]
}
```

Patch ini memeriksa status awal, memperbaruinya, lalu menambahkan tag di akhir array.

```json
[
  { "op": "test", "path": "/status", "value": "draft" },
  { "op": "replace", "path": "/status", "value": "published" },
  { "op": "add", "path": "/tags/-", "value": "release" }
]
```

Hasilnya adalah `{"status":"published","tags":["api","release"]}`.

## Operasi yang didukung dan sintaks JSON Pointer

- `add` membuat atau menimpa anggota objek, menyisipkan item dalam array, atau mengganti seluruh dokumen di akar.
- `remove` menghapus nilai yang ada. `replace` mengganti nilai yang ada dengan nilai baru.
- `move` mengambil nilai yang ada dari pointer `from` dan menyisipkannya di `path`. `copy` menyisipkan salinan yang independen.
- `test` memeriksa apakah nilai pada `path` sama dengan `value` yang diberikan tanpa mengubah dokumen.

Jalur mengikuti sintaks JSON Pointer RFC 6901. Indeks array dimulai dari nol, jadi `/tags/0` merujuk ke tag pertama. Jalur `/tags/-` menambahkan nilai di akhir array saat operasi menyisipkan item ke array tersebut. Gunakan `~1` untuk garis miring dan `~0` untuk tilde di dalam kunci objek. Misalnya, `/a~1b` merujuk ke kunci `a/b`. Jalur kosong `""` merujuk ke seluruh dokumen, sedangkan `/` merujuk ke anggota dengan kunci kosong.

## Mengapa operasi JSON Patch gagal

Operasi dijalankan sesuai urutan dalam array. Setiap operasi memakai hasil dari operasi sebelumnya. Jika tujuan tidak ditemukan, indeks array di luar batas, atau nilai `test` tidak cocok, alat menyorot kegagalan pertama dan berhenti. Pratinjau JSON muncul hanya jika seluruh patch berhasil diterapkan. Array patch kosong `[]` mengembalikan dokumen asli.

Browser menerapkan patch secara lokal. JSON asli dan patch tetap di browser Anda.
