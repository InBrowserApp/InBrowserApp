## यह टूल किस काम आता है

यह टूल आपके डिवाइस की घड़ी को नेटवर्क से मिले समय के साथ तुलना करने के लिए है।
यह Cloudflare के trace endpoint से timestamp लाता है, request latency के midpoint का अनुमान लगाता है, और ब्राउज़र में network clock दिखाता है।

## यह किन स्थितियों में उपयोगी है

- यह जांचने के लिए कि आपकी local system clock आगे है या पीछे।
- TLS, token, scheduler या log समस्याओं की जांच से पहले time drift की पुष्टि करने के लिए।
- NTP tools इंस्टॉल किए बिना जल्दी से network-based reference time पाने के लिए।

## किन बातों का ध्यान रखें

- दिखाया गया offset एक अनुमान है और network latency पर निर्भर करता है।
- अगर trace request विफल हो जाती है, तो अगली सफल sync तक टूल local clock दिखाएगा।
- अगर आपको system level पर सटीक सुधार चाहिए, तो device time sync settings या NTP configuration समायोजित करें।
