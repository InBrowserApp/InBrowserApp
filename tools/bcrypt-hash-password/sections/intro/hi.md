## bcrypt क्या है?

bcrypt password storage के लिए बनाया गया password hashing algorithm है. यह password को random salt के साथ जोड़ता है और cost factor के आधार पर महंगा काम बार-बार दोहराता है, ताकि हमलावरों को हर अनुमान test करने में ज्यादा समय लगे.

## इस tool का उपयोग कब करें

- किसी test account, seed script, या local development environment के लिए bcrypt hash जनरेट करें.
- देखें कि अलग-अलग cost factors output format और runtime को कैसे बदलते हैं.
- Password को server पर भेजे बिना copy-ready hash बनाएं.

## Cost factor कैसे चुनें

ज्यादा cost values धीमी होती हैं और आम तौर पर अधिक सुरक्षित होती हैं, लेकिन वे आपकी application में हर login attempt को भी धीमा बनाती हैं. Interactive systems के लिए लगभग 10-12 का cost आम है; admin-only या low-volume workflows के लिए अधिक values उचित हो सकती हैं. Cost को उसी तरह के hardware पर test करें जो password verify करेगा.

## किन बातों का ध्यान रखें

- हर जनरेट किया गया hash नया random salt इस्तेमाल करता है, इसलिए password और cost समान रहने पर भी output बदल जाता है.
- Original password नहीं, bcrypt hash store करें.
- bcrypt का उपयोग passwords के लिए करें, file checksums, signatures, या general hashing के लिए नहीं.
- Verification behavior को constant रखें और यह प्रकट करने से बचें कि कोई user account मौजूद है या नहीं.
