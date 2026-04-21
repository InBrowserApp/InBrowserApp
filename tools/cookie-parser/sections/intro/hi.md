## यह क्या करता है

यह टूल raw Cookie और Set-Cookie headers को सीधे आपके ब्राउज़र में structured JSON में बदलता है। आप एक लाइन, कई लाइनें, या सामान्य prefixes के बिना केवल values भी पेस्ट कर सकते हैं।

## Cookie बनाम Set-Cookie

Cookie header में आमतौर पर client द्वारा भेजे गए कई name/value pairs होते हैं। Set-Cookie header आमतौर पर एक cookie को Path, Secure, HttpOnly, SameSite, Expires या Max-Age जैसे attributes के साथ परिभाषित करता है।

## नोट्स

यह parser लोकल रूप से चलता है और किसी server पर headers अपलोड नहीं करता। अमान्य segments अलग सूची में रखे जाते हैं ताकि malformed cookie strings को जल्दी पहचाना जा सके।
