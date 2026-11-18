## Alan türleri nasıl belirlenir?

Dönüştürücü dizideki her öğeyi inceler. Bu örnekte `active` alanı yalnızca ilk kayıtta bulunduğu için isteğe bağlıdır. Her iki kayıtta da bulunan `name` alanı birinde dize, diğerinde `null` değerini alır. Bu nedenle alan zorunludur ve türü `string | null` olur.

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

Dizide örnek öğe yoksa öğe türü `unknown` olur. API yanıtlarını daha doğru yansıtan bir sonuç almak için API’nizin döndürdüğü farklı yapıları gösteren kayıtlar ekleyin.

## TypeScript ve Zod ne zaman kullanılır?

Düzenleyicide ve derleme sırasında türleri denetlemek için **TypeScript** kullanın. Gelen verileri çalışma zamanında doğrulamak için **Zod** ile `apiResponseSchema.safeParse(data)` çağrısını kullanın. Oluşturulan Zod dosyası TypeScript türünü de dışa aktarır. API sözleşmeniz gerektiriyorsa izin verilen değerler veya dize biçimleri gibi kurallar ekleyin.
