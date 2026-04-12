## Apa itu JSON Schema?

JSON Schema adalah standar untuk menjelaskan struktur data JSON. Standar ini membantu Anda menyatakan tipe bidang, struktur bertingkat, kunci wajib, dan batasan yang berguna untuk validasi.

### Apa yang dilakukan generator ini

Tempel JSON contoh dan alat ini akan menurunkan schema awal untuk objek, array, angka, boolean, null, dan format string umum. Hasilnya bisa disalin, diunduh, lalu disempurnakan.

### Contoh

Sebagai contoh, untuk data berikut:

**Input contoh**

```json
{
  "id": "bk-101",
  "title": "In-browser Tools",
  "price": 19.99,
  "tags": ["json", "schema"],
  "published": true
}
```

**Schema yang dihasilkan**

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "title": { "type": "string" },
    "price": { "type": "number" },
    "tags": {
      "type": "array",
      "items": { "type": "string" }
    },
    "published": { "type": "boolean" }
  },
  "required": ["id", "title", "price", "tags", "published"]
}
```

### Tips

- Gunakan data contoh yang representatif, terutama di dalam array, agar bidang opsional lebih mudah terdeteksi.
- Matikan “Infer required properties” jika input Anda hanya contoh yang belum lengkap.
- Matikan “Allow additional properties” jika Anda ingin schema yang lebih ketat secara default.
- Biarkan deteksi format string aktif untuk mengenali email, URI, UUID, dan date-time.
