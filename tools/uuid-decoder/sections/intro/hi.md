# UUID डिकोडर क्या है?

UUID डिकोडर Universally Unique Identifier के अंदर की संरचना समझाता है। यह आम तौर पर पेस्ट किए गए प्रारूपों को सामान्यीकृत करता है, जांचता है कि मान 128-bit UUID है, और वर्ज़न, वैरिएंट, raw hexadecimal bytes तथा कॉपी के लिए तैयार संख्यात्मक रूप दिखाता है।

UUIDs को अक्सर opaque strings की तरह माना जाता है, लेकिन version nibble बताता है कि पहचानकर्ता कैसे बनाया गया था। Version 4 UUIDs random होते हैं, versions 3 और 5 name-based hashes होते हैं, और 1, 6 तथा 7 जैसे time-ordered versions timestamp जानकारी रख सकते हैं।

## इसका उपयोग कब करें

इस टूल का उपयोग तब करें जब आपको logs, databases, APIs, traces या test fixtures से मिले किसी पहचानकर्ता की जांच करनी हो। यह पुष्टि करने में उपयोगी है कि UUID random है या time-based, उसे किसी दूसरे system के लिए decimal या Base64 में convert करने में, और यह पहचानने में कि UUID v1 या v6 का node field MAC-style identifier expose कर सकता है या नहीं।

डिकोडर आपके browser में चलता है और UUID values को server पर नहीं भेजता। यह canonical UUIDs, `urn:uuid:` values, braces वाले UUIDs, uppercase input, और बिना hyphens वाले 32-अक्षरीय हेक्साडेसिमल UUIDs स्वीकार करता है।

## किन बातों पर ध्यान दें

UUID version और variant fields bit layout बताते हैं, यह नहीं कि पहचानकर्ता व्यवहार में globally unique है या नहीं। Valid-looking UUID तब भी duplicate हो सकता है अगर उसे गलत तरीके से generate किया गया हो या गलती से copy किया गया हो।

Version 1 और version 6 UUIDs के लिए, node field MAC address जैसा दिख सकता है। Modern generators इसके बजाय multicast bit set करके random node इस्तेमाल कर सकते हैं, इसलिए जब तक आप generator को control नहीं करते, इसे node identifier की तरह ही मानें।
