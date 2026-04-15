## यह टूल क्या करता है

- साधारण टेक्स्ट को named, decimal या hexadecimal HTML entities में encode
  करता है.
- पहले से entity-encoded अंशों को फिर से पढ़ने योग्य टेक्स्ट में decode करता
  है.
- सब कुछ ब्राउज़र में लोकल चलता है, इसलिए आपका डेटा डिवाइस से बाहर नहीं जाता.

## इसे कब इस्तेमाल करें

- HTML को docs, templates या demos में पेस्ट करने से पहले special characters
  को escape करने के लिए.
- `&amp;`, `&#60;` या `&#x3C;` वाले copied markup को जांचने के लिए.
- compatibility की ज़रूरत के लिए named, decimal और hexadecimal entities की
  तुलना करने के लिए.

## Entity formats के बारे में नोट्स

- Named entities पढ़ने में आसान होती हैं, लेकिन हर character की named form
  नहीं होती.
- Decimal और hexadecimal entities किसी भी Unicode character, emoji सहित, को
  दिखा सकती हैं.
- Unknown या invalid entities decode करते समय बिना बदले छोड़ी जाती हैं.
