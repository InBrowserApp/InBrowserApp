जब आपको ऐसे मान चाहिए जिनमें creation time और node identifier शामिल हों, तो अपने ब्राउज़र में locally UUID v1 identifiers जनरेट करें। यह tool legacy integrations, database imports, ordered fixtures, और उन systems के लिए उपयोगी है जो अभी भी RFC 4122 version 1 UUIDs की अपेक्षा करते हैं।

## UUID v1 कब मदद करता है

UUID v1 एक standard 36-character UUID string में timestamp, clock sequence, और 48-bit node value store करता है। इससे generated IDs creation time के अनुसार लगभग sortable रहते हैं, और फिर भी ordinary UUID columns, URLs, logs, और API payloads स्वीकार करने वाले systems में fit होते हैं।

## Privacy और Node Identifiers

Classic UUID v1 generation में वास्तविक network card MAC address का उपयोग होता था, जिससे hardware information उजागर हो सकती है। यह tool इसके बजाय locally administered random MAC address से शुरू करता है। किसी legacy system से match करने के लिए आप specific node value दर्ज कर सकते हैं, लेकिन public samples या shared data में वास्तविक hardware addresses का उपयोग करने से बचें।

## Clock Sequence और Batch Generation

Clock sequence एक 14-bit value है जो same node द्वारा लगभग same time पर IDs generate करने पर collisions से बचने में मदद करती है। Batch generation सभी IDs को same millisecond में रखता है और हर row के लिए 100-nanosecond tick increment करता है, इसलिए result में हर value अलग रहती है।
