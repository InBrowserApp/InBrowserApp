## מהו JSON Schema?

JSON Schema הוא תקן לתיאור המבנה של נתוני JSON. הוא מאפשר להגדיר סוגי שדות, מבנים מקוננים, מפתחות חובה ומגבלות שמתאימות לאימות נתונים.

### מה המחולל הזה עושה

הדביקו JSON לדוגמה והכלי יסיק schema ראשוני עבור אובייקטים, מערכים, מספרים, ערכים בוליאניים, null ופורמטים נפוצים של מחרוזות. את התוצאה אפשר להעתיק, להוריד ולחדד ידנית.

### דוגמה

לדוגמה, עבור נתוני הדוגמה הבאים:

**קלט לדוגמה**

```json
{
  "id": "bk-101",
  "title": "In-browser Tools",
  "price": 19.99,
  "tags": ["json", "schema"],
  "published": true
}
```

**Schema שנוצר**

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

### טיפים

- השתמשו בנתוני דוגמה מייצגים, במיוחד בתוך מערכים, כדי להבחין טוב יותר בשדות אופציונליים.
- כדאי לכבות את “Infer required properties” אם הקלט הוא רק דוגמה חלקית.
- כדאי לכבות את “Allow additional properties” אם אתם רוצים schema קשיח יותר כברירת מחדל.
- השאירו את זיהוי פורמטי המחרוזות פעיל כדי להסיק email, URI, UUID ו-date-time.
