## JSON Schema क्या है?

JSON Schema, JSON डेटा की संरचना बताने का एक मानक है। इसकी मदद से आप फ़ील्ड के प्रकार, nested structure, required keys और validation के लिए उपयोगी constraints को मशीन-पठनीय रूप में व्यक्त कर सकते हैं।

### यह generator क्या करता है

उदाहरण JSON पेस्ट करने पर यह टूल objects, arrays, numbers, booleans, null और सामान्य string formats के लिए शुरुआती schema तैयार करता है। परिणाम को कॉपी, डाउनलोड और आगे refine किया जा सकता है।

### उदाहरण

उदाहरण के लिए, इस sample payload को देखें:

**उदाहरण इनपुट**

```json
{
  "id": "bk-101",
  "title": "In-browser Tools",
  "price": 19.99,
  "tags": ["json", "schema"],
  "published": true
}
```

**जेनरेट किया गया schema**

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

### सुझाव

- जहाँ संभव हो representative sample data दें, खासकर arrays के अंदर, ताकि optional fields बेहतर पकड़े जाएँ।
- अगर इनपुट केवल अधूरा उदाहरण है, तो “Infer required properties” बंद कर दें।
- अगर आपको default रूप से अधिक strict schema चाहिए, तो “Allow additional properties” बंद करें।
- email, URI, UUID और date-time पहचानने के लिए string format detection चालू रखें।
