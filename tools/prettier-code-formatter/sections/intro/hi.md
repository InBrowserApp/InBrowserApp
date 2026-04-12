## Prettier Code Formatter क्या है?

Prettier Code Formatter आधिकारिक Prettier standalone pipeline को सीधे
आपके ब्राउज़र में चलाता है, ताकि आप कोड को सर्वर पर भेजे बिना source files को
standardize कर सकें। यह तब उपयोगी है जब आपको जल्दी से formatting करनी हो,
अलग-अलग print settings की तुलना करनी हो, या तुरंत copy/download करने लायक
साफ़ फ़ाइल चाहिए हो।

## समर्थित प्रारूप

यह rewrite टूल को उन formats पर केंद्रित रखता है जिन्हें Prettier पहले से
ब्राउज़र में अच्छी तरह संभालता है: JavaScript, TypeScript, Flow, JSON, HTML,
CSS, SCSS, Less, Markdown, MDX, YAML, GraphQL, और Vue तथा Handlebars जैसे
संबंधित template formats। भाषा selector तय करता है कि कौन सा parser चलेगा,
और फ़ाइल import करने पर extension पहचाने जाने पर parser अपने-आप detect हो जाता
है।

## यह rewrite कैसे काम करता है

यह rewrite heavy formatting logic को मुख्य UI path से बाहर रखता है।
Formatting requests pure tool-local config से बनती हैं, फिर lazy worker-backed
Prettier pipeline के ज़रिए चलती हैं ताकि सामान्य typing responsive बनी रहे।
बड़े inputs के लिए automatic formatting pause हो जाती है और `Format now`
action दिखाई देता है, जो हर keystroke पर बड़ी फ़ाइल reformat करने से अधिक
predictable है।
