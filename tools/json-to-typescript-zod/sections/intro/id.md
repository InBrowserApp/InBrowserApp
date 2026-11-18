## Cara menyimpulkan tipe properti

Konverter memeriksa setiap item dalam array. Dalam contoh ini, hanya entri pertama yang memiliki `active`, sehingga properti itu bersifat opsional. Kedua entri memiliki `name`, yang bernilai string pada satu entri dan `null` pada entri lainnya. Karena itu, properti ini wajib dan bertipe `string | null`.

```json
[
  { "id": 1, "name": "Ada", "active": true },
  { "id": 2, "name": null }
]
```

```ts
export type ApiResponse = Array<{
  id: number
  name: string | null
  active?: boolean
}>
```

Jika array tidak memiliki item contoh, tipe elemennya adalah `unknown`. Sertakan entri dengan berbagai struktur yang dikembalikan API agar hasilnya lebih mewakili data sebenarnya.

## Kapan menggunakan TypeScript atau Zod

Gunakan **TypeScript** untuk pemeriksaan tipe di editor dan saat kompilasi. Gunakan **Zod** untuk memvalidasi data masuk saat program berjalan dengan `apiResponseSchema.safeParse(data)`. File Zod yang dihasilkan juga mengekspor tipe TypeScript. Tambahkan aturan khusus API, seperti nilai yang diizinkan atau format string, sesuai kontrak API Anda.
