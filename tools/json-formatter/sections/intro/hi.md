## यह टूल किस काम आता है

इस टूल का उपयोग कॉम्पैक्ट या बिखरे हुए JSON को साफ और पढ़ने योग्य आउटपुट में
बदलने के लिए करें, ताकि उसे डॉक्यूमेंटेशन, टेस्ट, टिकट या pull request में
चिपकाने से पहले तैयार किया जा सके। सब कुछ ब्राउज़र में लोकली चलता है।

## कहाँ उपयोगी है

- API request और response payloads को देखने के लिए।
- साझा करने से पहले exported JSON files को दोबारा format करने के लिए।
- डेटा बदले बिना deeply nested objects और arrays को पढ़ने के लिए।

## किन बातों का ध्यान रखें

- यह formatter केवल valid JSON स्वीकार करता है।
- comments, trailing commas और अन्य JavaScript-only syntax काम नहीं करेंगे।
- formatting केवल whitespace बदलता है; keys की order और values नहीं बदलतीं।
