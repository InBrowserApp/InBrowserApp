## यह tool क्या करता है

यह SVG optimizer आपके browser में एक local SVG फ़ाइल या paste किए गए SVG
document को compress करता है। यह comments, metadata, redundant attributes,
unnecessary precision, और ऐसे दूसरे markup को हटाने के लिए SVGO cleanup passes
का उपयोग करता है जो दिखाई देने वाली image को नहीं बदलते।

## यह क्यों मदद करता है

Design tools से export की गई SVG फ़ाइलों में अक्सर editor metadata, verbose
paths, unused IDs, और comments होते हैं। उन्हें optimize करने से download size
कम हो सकता है, page loading बेहतर हो सकती है, और inline SVG code को किसी
website, app, email, या documentation page में ship करने से पहले review करना
आसान हो जाता है।

## यह कैसे काम करता है

एक `.svg` फ़ाइल upload करें या SVG markup paste करें, safe preset चुनें या
अलग-अलग SVGO passes tune करें, फिर optimization चलाएं। Tool original और
optimized previews, byte savings, और final markup दिखाता है ताकि आप उसे copy
कर सकें या `.optimized.svg` फ़ाइल download कर सकें। SVG को आपके device से बाहर
जाने की कभी जरूरत नहीं होती।

## Practical notes

- जब SVG external CSS, scripted IDs, या ऐसे symbol references पर निर्भर हो
  जिन्हें आप आसानी से inspect नहीं कर सकते, तो safe preset रखें।
- Simple exported icons, logos, और illustrations के लिए aggressive preset का
  उपयोग करें, जहां dimensions हटाना और styles inline करना स्वीकार्य हो।
- Source artwork बदलने से पहले optimized image preview करें, खासकर जब source
  masks, gradients, filters, या linked assets का उपयोग करता हो।
