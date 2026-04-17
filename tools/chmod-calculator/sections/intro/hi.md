## chmod क्या है?

`chmod` ("change mode") Unix/Linux का एक command है जिसका उपयोग file और directory permissions बदलने के लिए किया जाता है. यह calculator आपको `755` जैसे numeric permissions, `rwxr-xr-x` जैसे symbolic permissions और checkbox matrix के बीच बिना manual math किए switch करने देता है.

## Numeric permissions कैसे काम करते हैं?

हर digit एक role को दिखाता है: owner, group और others. एक digit के अंदर `4` का मतलब read, `2` write और `1` execute होता है. मनचाहा permission बनाने के लिए इन values को जोड़ें: `7 = rwx`, `6 = rw-`, `5 = r-x`, और `4 = r--`. Directories के लिए execute bit का मतलब directory के अंदर जा पाना भी होता है.

## Common chmod examples

- `chmod 755 script.sh` owner को full access देता है और बाकी सभी को read और execute की अनुमति देता है.
- `chmod 644 notes.txt` file को owner के लिए writable रखता है, जबकि बाकी लोग केवल read कर सकते हैं.
- `chmod 600 .env` private secrets के लिए common choice है क्योंकि केवल owner ही read या write कर सकता है.
- `chmod 775 shared-folder` team directories के लिए उपयोगी है जब group को भी files बनानी और बदलनी हों.
