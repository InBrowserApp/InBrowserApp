# Tool terminology

Translate a tool's descriptive name; preserve format names and product brands.
For example, `CAJ Viewer` is a format name plus a generic tool role, not an
untranslatable brand. Use the same localized identity in discovery metadata,
page copy, related-tool references, and accessible viewing-area labels.

## Roles

| Role      | Use                                                       | Simplified Chinese | Traditional Chinese |
| --------- | --------------------------------------------------------- | ------------------ | ------------------- |
| Viewer    | Inspect existing documents, images, archives, or metadata | 查看器             | 檢視器              |
| Reader    | Read books and comics: EPUB, MOBI/AZW3, FB2, CBZ          | 阅读器             | 閱讀器              |
| Previewer | Preview rendered source: Markdown, LaTeX                  | 预览器             | 預覽器              |

Use natural equivalents consistently within each language. Grammar, inflection,
compound words, and established loanwords may vary; consistency does not require
identical word forms in every sentence.

## Locale conventions

These are the preferred tool-name terms. Apply normal capitalization, compounds,
and grammatical inflection in titles and sentences.

| Locale | Viewer         | Book/comic Reader | Source Previewer  |
| ------ | -------------- | ----------------- | ----------------- |
| ar     | عارض           | قارئ              | معاين             |
| de     | Betrachter     | Reader            | Vorschau          |
| en     | Viewer         | Reader            | Previewer         |
| es     | Visor          | Lector            | Vista previa      |
| fr     | Visionneuse    | Lecteur           | Aperçu            |
| he     | מציג           | קורא              | תצוגה מקדימה      |
| hi     | व्यूअर         | रीडर              | प्रीव्यूअर        |
| id     | Penampil       | Pembaca           | Pratinjau         |
| it     | Visualizzatore | Lettore           | Anteprima         |
| ja     | ビューアー     | リーダー          | プレビューアー    |
| ko     | 뷰어           | 리더              | 미리보기          |
| ms     | Pemapar        | Pembaca           | Pratonton         |
| nl     | viewer         | lezer             | voorvertoner      |
| no     | viser          | leser             | forhåndsviser     |
| pl     | Przeglądarka   | Czytnik           | Podgląd           |
| pt     | Visualizador   | Leitor            | Pré-visualizador  |
| ru     | Просмотр       | Читалка           | Предпросмотр      |
| sv     | visare         | läsare            | förhandsgranskare |
| th     | โปรแกรมดู      | โปรแกรมอ่าน       | โปรแกรมดูตัวอย่าง |
| tr     | Görüntüleyici  | Okuyucu           | Önizleyici        |
| vi     | Trình xem      | Trình đọc         | Trình xem trước   |
| zh-CN  | 查看器         | 阅读器            | 预览器            |
| zh-TW  | 檢視器         | 閱讀器            | 預覽器            |

## Context matters

- These roles identify tools. They do not replace ordinary verbs such as
  **read**, **view**, or **preview**.
- Keep labels such as **reading area**, **reading mode**, **preview limitations**,
  and **image preview** when they describe a region, action, or rendered result.
- A viewer may offer a limited visual preview without becoming a Previewer.
  Preserve its compatibility and feature descriptions.
- References to external dedicated readers or other applications may use their
  established terminology.
- Barcode Reader and QR Code Reader identify decoding tools, not book readers.
  Their translations follow that separate meaning.

When changing an existing term, review its metadata, messages, introduction, and
references from related tools together. Preserve JSON keys, placeholders, links,
and locale structure. Regenerate discovery data after changing metadata.
