## OpenAPI To TypeScript Converter क्या है?

OpenAPI to TypeScript Converter एक OpenAPI 3.x दस्तावेज़ को सीधे आपके browser में generated TypeScript types में बदलता है। यह तब उपयोगी है जब आपको तेज़ type preview, डाउनलोड करने योग्य declaration file, या `openapi-typescript` options को server पर schema भेजे बिना आज़माने का सुरक्षित तरीका चाहिए।

## इसे कब इस्तेमाल करें

इस tool का उपयोग तब करें जब आपके पास JSON या YAML में OpenAPI schema पहले से हो और आपको frontend apps, SDK prototypes, या API reviews के लिए typed request और response models चाहिए हों। Output को repository में commit करने से पहले generation options compare करने में यह खास तौर पर मदद करता है।

## जनरेट करने से पहले

यह browser rewrite bundled OpenAPI 3.0 और 3.1 documents को support करता है। अगर आपके schema में अभी भी external `$ref` targets हैं, तो पहले उन्हें bundle या inline करें, फिर final TypeScript output यहाँ जनरेट करें।
