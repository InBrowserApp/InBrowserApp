## यह टूल क्या बदलता है

यह कन्वर्टर UUID को उसके वास्तविक 128-bit value की तरह मानता है और आम
representations को sync में रखता है. UUID, Base64 value, hexadecimal string,
decimal integer, octal value, या binary value पेस्ट करें, और बाकी formats आपके
ब्राउज़र में locally update हो जाते हैं.

## formats को कैसे पढ़ें

UUID field canonical hyphenated form दिखाता है. Hexadecimal वही 16 bytes हैं,
जो 32 lowercase hex digits के रूप में लिखे जाते हैं. Base64 raw 16 bytes के लिए
standard padded Base64 है, UUID के text characters के लिए Base64 नहीं. Decimal,
octal, और binary UUID को एक unsigned 128-bit integer के रूप में दिखाते हैं;
binary output को पूरे 128 bits तक left-padded किया जाता है ताकि leading zeroes
दिखाई देते रहें.

## किन बातों का ध्यान रखें

128-bit UUID range से बाहर के values अस्वीकार किए जाते हैं. Base64 input को
ठीक 16 bytes में decode होना चाहिए. कन्वर्टर आम pasted variants स्वीकार करता
है, जैसे uppercase UUIDs, `urn:uuid:` prefixes, braces, compact 32-hex UUIDs,
लंबे numeric values के आसपास whitespace, और URL-safe Base64. जब आप sample UUID
convert या generate करते हैं, तब कुछ भी upload नहीं किया जाता.
