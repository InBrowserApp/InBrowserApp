## यह टूल क्या करता है

यह URL parser और builder दोनों दिशाओं में काम करता है। आप पूरा URL चिपकाकर उसका protocol, credentials, host, path, query parameters और fragment देख सकते हैं, या इन हिस्सों को एक-एक करके बदलकर अंतिम पता फिर से बनवा सकते हैं।

## यह कब काम आता है

टूटा हुआ लिंक डिबग करने, API endpoints तैयार करने, campaign parameters जाँचने या साझा करने से पहले लंबे URL साफ़ करने में यह उपयोगी है। जब duplicate keys या encoded spaces की वजह से manual editing जोखिमभरी हो जाए, तब structured query editor खास मदद करता है।

## व्यावहारिक नोट्स

यह टूल `https://example.com/path` जैसे पूर्ण absolute URL पर सबसे अच्छा काम करता है। Browser normalized output में reserved characters को अपने आप encode कर देता है, इसलिए path, credentials, fragments और query values में मौजूद spaces सुरक्षित रूप से बदल जाते हैं।
