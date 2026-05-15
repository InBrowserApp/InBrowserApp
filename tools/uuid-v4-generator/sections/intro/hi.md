जब आपको test records, database rows, API examples, event payloads, fixtures या configuration files के लिए नया identifier चाहिए हो, तब अपने ब्राउज़र में स्थानीय रूप से UUID v4 जनरेट करें। यह टूल एक बार में एक canonical lowercase UUID बनाता है, इसलिए यह अलग bulk generator से ओवरलैप किए बिना single-value workflow पर केंद्रित रहता है।

## UUID v4 का अर्थ

UUID v4 एक 128-bit identifier है जिसमें version और variant bits तय होते हैं और बाकी 122 bits रैंडम data से आते हैं। इसलिए यह तब उपयोगी है जब आपको ऐसे identifiers चाहिए हों जो creation time, machine information, sequence counters या user details उजागर न करें।

## कब उपयोग करें

client-generated IDs, mock objects, temporary records, public examples और distributed systems के लिए UUID v4 उपयोग करें, जहाँ central counter coordinate करना असुविधाजनक होगा। जब sort order महत्वपूर्ण न हो और आपको सिर्फ low-collision identifier चाहिए हो, तब यह एक अच्छा default है।

## गोपनीयता और विश्वसनीयता

जनरेशन इस ब्राउज़र टैब में Web Crypto के साथ चलता है, इसलिए UUID InBrowser.App या किसी दूसरी सेवा को नहीं भेजा जाता। मान सही दिखने पर उसे कॉपी करें, फिर अगले record या example के लिए नया identifier चाहिए हो तो फिर से जनरेट करें।
