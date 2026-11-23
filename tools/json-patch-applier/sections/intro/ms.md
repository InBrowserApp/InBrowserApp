## Cara menggunakan JSON Patch

Tampal dokumen JSON asal ke dalam editor pertama dan tatasusunan JSON Patch RFC 6902 ke dalam editor kedua. Pilih **Gunakan patch** untuk melihat pratonton dan menyalin JSON yang dikemas kini. Untuk menjana patch, bandingkan dokumen asal dan dokumen yang telah diubah dalam [Perbezaan Laluan JSON](../json-diff-path/), kemudian salin output **JSON Patch**. Gunakan patch pada dokumen asal yang sama.

## Contoh JSON Patch

Dokumen asal mengandungi status dan satu tag.

```json
{
  "status": "draft",
  "tags": ["api"]
}
```

Patch ini menyemak status asal, mengemas kininya dan menambah tag di penghujung tatasusunan.

```json
[
  { "op": "test", "path": "/status", "value": "draft" },
  { "op": "replace", "path": "/status", "value": "published" },
  { "op": "add", "path": "/tags/-", "value": "release" }
]
```

Hasilnya ialah `{"status":"published","tags":["api","release"]}`.

## Operasi yang disokong dan sintaks JSON Pointer

- `add` mencipta atau menulis ganti ahli objek, menyisipkan item ke dalam tatasusunan atau menggantikan seluruh dokumen pada akar.
- `remove` membuang nilai sedia ada. `replace` menggantikan nilai sedia ada dengan nilai baharu.
- `move` mengambil nilai sedia ada daripada penuding `from` dan menyisipkannya pada `path`. `copy` menyisipkan salinan yang bebas daripada nilai asal.
- `test` menyemak sama ada nilai pada `path` sepadan dengan `value` yang ditetapkan tanpa mengubah dokumen.

Laluan mengikut sintaks JSON Pointer RFC 6901. Indeks tatasusunan bermula pada sifar, jadi `/tags/0` merujuk kepada tag pertama. Laluan `/tags/-` menambah nilai di penghujung tatasusunan apabila operasi menambah item padanya. Gunakan `~1` untuk garis miring dan `~0` untuk tilde dalam kekunci objek. Contohnya, `/a~1b` merujuk kepada kekunci `a/b`. Laluan kosong `""` merujuk kepada keseluruhan dokumen, manakala `/` merujuk kepada ahli objek yang mempunyai kekunci kosong.

## Punca operasi JSON Patch gagal

Operasi berjalan mengikut susunan dalam tatasusunan. Setiap operasi menggunakan hasil daripada operasi sebelumnya. Jika sasaran tiada, indeks tatasusunan di luar julat atau nilai `test` tidak sepadan, alat ini akan menyerlahkan kegagalan pertama lalu berhenti. Pratonton JSON dipaparkan hanya apabila seluruh patch berjaya digunakan. Tatasusunan patch kosong `[]` mengembalikan dokumen asal.

Pelayar menggunakan patch secara setempat. JSON asal dan patch kekal dalam pelayar anda.
