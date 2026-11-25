## How to normalize Unicode text

Paste or type text into **Original text**, then choose a normalization form. The result updates as you type or switch forms. Select **Copy result** to use the normalized text in another app. The conversion runs in your browser and your input stays on your device.

## Which Unicode normalization form should I use?

- **NFC (canonical composition)** is a good default for general text. It combines a letter and its accent into a single code point where a composed character exists. Use it to make equivalent spellings consistent before storing or comparing text.
- **NFD (canonical decomposition)** separates sequences into their canonical components, such as a base letter and a combining accent. Use it when you need to inspect or work with individual marks.
- **NFKC (compatibility composition)** also folds compatibility variants such as full-width letters and ligatures. It can be useful for search or matching when those differences do not matter.
- **NFKD (compatibility decomposition)** applies the same compatibility mappings but leaves the result decomposed, which can help with text analysis.

## Why can normalized text look the same?

The letter **é** can be stored as `U+00E9`, or as an **e** followed by a combining acute accent (`U+0065 U+0301`). NFC produces the first representation, and NFD produces the second. Open **Compare code points** to see the underlying sequence for the beginning of each text, even if both look identical.

Choose **Try an example** to see this alongside characters that visibly change. With NFKC, **ＡＢＣ ① ﬁ** becomes **ABC 1 fi**. NFC preserves these compatibility distinctions.

## When does normalization change the meaning?

NFKC and NFKD can drop formatting distinctions, such as a superscript in a formula or a circled number in a list. Choose NFC if those distinctions matter. Normalization also differs from changing letter case, removing accents, or converting between encodings such as UTF-8 and UTF-16.

Read more in the [Unicode Standard Annex on normalization forms](https://www.unicode.org/reports/tr15/).
