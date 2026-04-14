## Basic Auth क्या है?

Basic Auth, `username:password` को Base64 में encode करके `Authorization` header में भेजता है। यह सरल है और व्यापक रूप से समर्थित है, लेकिन Base64 केवल encoding है, encryption नहीं।

## यह टूल क्या बनाता है

- API clients में paste करने के लिए `Authorization: Basic ...` header।
- तेज़ testing के लिए एक ready-to-run `curl` example।
- सब कुछ ब्राउज़र में local रूप से चलता है।

## किन बातों का ध्यान रखें

- Basic Auth credentials भेजते समय हमेशा HTTPS का उपयोग करें।
- जो भी इस header को देख सकता है, वह मूल username और password को decode कर सकता है।
- Basic Auth internal tools, staging environments और quick API checks के लिए उपयोगी है।
