## यह टूल क्या करता है

इस टाइमर की मदद से आप अपने ब्राउज़र में start, pause, reset और fullscreen controls के साथ countdown चला सकते हैं. यह timer configured duration और current state को local storage में रखता है, इसलिए refresh होने पर countdown को संभव होने पर वापस लाया जा सकता है.

## alerts कैसे काम करते हैं

- countdown शून्य पर पहुंचने पर छोटा beep चलाने के लिए sound सक्षम करें.
- अगर आपका device support करता है तो vibration सक्षम करें.
- अगर tab सामने न भी हो तब भी browser alert चाहिए तो notifications सक्षम करें.

## ध्यान देने योग्य बातें

- display में hours, minutes, seconds और hundredths of a second दिखते हैं.
- reset timer को अभी configured duration पर वापस ले आता है.
- अगर active countdown के दौरान reload करते हैं, तो tool saved end time से resume करने की कोशिश करता है.
