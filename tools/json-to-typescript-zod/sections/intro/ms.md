## Cara jenis medan disimpulkan

Penukar memeriksa setiap item dalam tatasusunan. Dalam contoh ini, hanya rekod pertama mempunyai `active`, jadi medan itu boleh ditinggalkan. Kedua-dua rekod mempunyai `name`, dengan nilai rentetan pada satu rekod dan `null` pada rekod yang lain. Oleh itu, medan ini wajib dan jenisnya ialah `string | null`.

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

Jika tatasusunan tiada item contoh, jenis elemennya ialah `unknown`. Sertakan rekod yang menunjukkan pelbagai struktur yang dikembalikan oleh API supaya hasilnya lebih mencerminkan data sebenar.

## Bila menggunakan TypeScript atau Zod

Gunakan **TypeScript** untuk semakan jenis dalam penyunting kod dan semasa kompilasi. Gunakan **Zod** untuk mengesahkan data masuk semasa program berjalan dengan `apiResponseSchema.safeParse(data)`. Fail Zod yang dijana turut mengeksport jenis TypeScript. Tambahkan peraturan khusus API, seperti nilai yang dibenarkan atau format rentetan, mengikut kontrak API anda.
