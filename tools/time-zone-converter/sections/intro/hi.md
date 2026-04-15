## यह टूल किस काम का है?

इस कन्वर्टर की मदद से आप किसी एक IANA time zone की local date और time को किसी दूसरे time zone के उसी moment की local time में बदल सकते हैं. अलग-अलग शहरों के बीच schedule compare करते समय आपको offset हाथ से नहीं जोड़ना पड़ता और न ही यह अनुमान लगाना पड़ता है कि daylight saving time लागू है या नहीं.

## आम उपयोग

- यह देखना कि टोक्यो की meeting का समय न्यूयॉर्क या लंदन में उसी calendar day पर पड़ता है या नहीं.
- schedules, alerts, या support hours प्रकाशित करने से पहले offset verify करना.
- logs और APIs के लिए matching ISO 8601, UTC, या Unix timestamp values कॉपी करना.

## यह converter कैसे काम करता है?

- किसी भी एक side पर `YYYY-MM-DD HH:mm:ss.SSS` format में local date और time दर्ज करें, फिर source और target time zones चुनें.
- जिस side को आपने सबसे हाल में edit किया है वही source of truth बनती है. टूल पहले उस instant को अंदरूनी रूप से UTC में बदलता है, फिर दूसरे time zone की equivalent local time दिखाता है.
- `Now` से current time जल्दी भर सकते हैं, और `Swap` से comparison की दिशा पलट सकते हैं. daylight saving time transition के आसपास offset बदल सकता है.
