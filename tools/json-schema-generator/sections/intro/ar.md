## ما هو JSON Schema؟

JSON Schema هو معيار لوصف بنية بيانات JSON. يتيح لك التعبير عن أنواع الحقول، والبنى المتداخلة، والمفاتيح المطلوبة، والقيود المفيدة لعمليات التحقق.

### ماذا يفعل هذا المولّد

ألصق JSON تجريبياً وسيستنتج هذا الأدوات schema أولياً للكائنات والمصفوفات والأرقام والقيم المنطقية وnull وصيغ السلاسل الشائعة. يمكن بعد ذلك نسخ النتيجة أو تنزيلها أو تعديلها.

### مثال

على سبيل المثال، مع هذه البيانات التجريبية:

**إدخال تجريبي**

```json
{
  "id": "bk-101",
  "title": "In-browser Tools",
  "price": 19.99,
  "tags": ["json", "schema"],
  "published": true
}
```

**الـ schema الناتج**

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

### نصائح

- استخدم بيانات تجريبية ممثلة، خصوصاً داخل المصفوفات، حتى يسهل اكتشاف الحقول الاختيارية.
- عطّل “Infer required properties” إذا كان الإدخال مجرد مثال جزئي.
- عطّل “Allow additional properties” إذا كنت تريد schema أكثر صرامة بشكل افتراضي.
- أبقِ كشف صيغ السلاسل مفعلاً لاستنتاج email وURI وUUID وdate-time.
