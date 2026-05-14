## यह टूल क्या खोजता है

IP Info Lookup किसी IPv4 पते, IPv6 पते, डोमेन या URL को resolve करता है और वह सार्वजनिक metadata दिखाता है जो इंटरनेट सेवाएं हर पते के लिए बता सकती हैं। यह तब उपयोगी है जब आपको देखना हो कि कोई डोमेन कहां इंगित करता है, किसी पते का स्वामित्व किस नेटवर्क के पास है, कौन-सा reverse DNS hostname मौजूद है, या IPv4 और IPv6 records अलग-अलग providers तक ले जाते हैं या नहीं।

## डोमेन और URL लुकअप कैसे काम करते हैं

जब आप कोई डोमेन या URL दर्ज करते हैं, तो टूल hostname निकालता है और A तथा AAAA दोनों records के लिए चुने गए DNS-over-HTTPS resolver से query करता है। लौटाए गए हर पते में फिर अलग से जानकारी जोड़ी जाती है, इसलिए dual-stack डोमेन IPv4 और IPv6 के लिए अलग-अलग देश, ASNs, ISPs, hostnames या time zones दिखा सकते हैं।

## परिणामों का क्या मतलब है

Location और ISP fields सार्वजनिक IP metadata providers जैसे geojs.io और ip.sb से आते हैं, जबकि hostnames उपलब्ध होने पर reverse DNS PTR lookups से आते हैं। ये records बताते हैं कि सार्वजनिक databases उस पते को कैसे देखते हैं, न कि किसी व्यक्ति या device का सटीक physical location।

## गोपनीयता और सटीकता संबंधी नोट्स

लुकअप आपके ब्राउज़र में चलता है और DNS तथा IP metadata अनुरोध third-party सेवाओं को भेजता है। VPNs, proxies, CDNs, mobile networks और cloud platforms रिपोर्ट किए गए location या organization को आपके अपेक्षित end user या server से अलग दिखा सकते हैं। निजी, reserved, नए आवंटित या कम documented पतों के लिए खाली fields सामान्य हैं।
