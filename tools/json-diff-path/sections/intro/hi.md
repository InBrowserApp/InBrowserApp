## अवलोकन

JSON Diff Path दो JSON दस्तावेज़ों की तुलना करता है और हर संरचनात्मक बदलाव को JSONPath और JSON Pointer output दोनों के साथ एक पढ़ने योग्य path record में बदल देता है।

## कब उपयोग करें

जब आपको API payload changes की समीक्षा करनी हो, configuration migrations की जाँच करनी हो, या automation के लिए RFC 6902 JSON Patch operations जनरेट करनी हों, तब इसका उपयोग करें।

## यह कैसे काम करता है

यह टूल दोनों JSON inputs को parse करता है, `add`, `remove`, और `replace` changes को compute करता है, फिर आपको उन operations को filter करने और उसी result panel में path list और JSON Patch output के बीच स्विच करने देता है।
