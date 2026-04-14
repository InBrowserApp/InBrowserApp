## Apakah JSON Schema?

JSON Schema ialah standard untuk menerangkan struktur data JSON. Ia membolehkan anda menyatakan jenis medan, struktur bersarang, kunci wajib dan kekangan yang berguna untuk pengesahan.

### Apa yang dilakukan penjana ini

Tampal JSON contoh dan alat ini akan menganggar schema awal untuk objek, tatasusunan, nombor, boolean, null dan format rentetan yang lazim. Hasilnya boleh disalin, dimuat turun dan diperhalus lagi.

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

**Schema yang dijana**

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

### Petua

- Gunakan data contoh yang mewakili keadaan sebenar, terutama dalam tatasusunan, supaya medan pilihan lebih mudah dikenal pasti.
- Matikan “Infer required properties” jika input anda hanyalah contoh yang tidak lengkap.
- Matikan “Allow additional properties” jika anda mahukan schema yang lebih ketat secara lalai.
- Biarkan pengesanan format rentetan aktif untuk mengenal pasti email, URI, UUID dan date-time.
