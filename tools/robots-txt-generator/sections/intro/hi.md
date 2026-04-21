## robots.txt जनरेटर क्या है?

robots.txt जनरेटर user-agent नियम, allow/disallow पाथ और sitemap लिंक को जोड़कर robots.txt फ़ाइल बनाने में मदद करता है। इसे साइट के रूट में /robots.txt के रूप में प्रकाशित करें ताकि क्रॉलर इसे पढ़ सकें।

### यह जनरेटर आपको क्या करने में मदद करता है

- सर्च इंजन, AI क्रॉलर या कस्टम बॉट्स के लिए अलग-अलग नियम बनाना
- एक ही जगह `Allow`, `Disallow`, sitemap और वैकल्पिक उन्नत निर्देश जोड़ना
- प्रकाशित करने के लिए तैयार `robots.txt` फ़ाइल को कॉपी या डाउनलोड करना

### उदाहरण

```text
User-agent: *
Disallow: /admin/
Allow: /admin/help/
Sitemap: https://example.com/sitemap.xml
```

यह उदाहरण क्रॉलरों से `/admin/` के ज़्यादातर हिस्से से बचने को कहता है, `/admin/help/` को crawlable रखता है, और उन्हें sitemap का स्थान बताता है।

### महत्वपूर्ण बातें

- फ़ाइल को अपनी साइट के root पर `/robots.txt` में प्रकाशित करें
- `robots.txt` सार्वजनिक और परामर्शात्मक है, यह access control नहीं है
- हर क्रॉलर `Host` और `Crawl-delay` को support नहीं करता
