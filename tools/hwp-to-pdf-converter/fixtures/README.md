# Owned compatibility fixtures

`river-survey.hwpx` is an original two-page bilingual Korean/English document:
a title, dated field notes, a 3 × 2 measurement table, and a four-color embedded
PNG illustration. The XML was authored for this viewer using the blank-document
structure bundled with the MIT-licensed `@rhwp/core` 0.8.7, then normalized to
one section definition and explicit page breaks. `river-survey.hwp` is the same
owned content exported as HWP 5 by that engine. These fixtures inherit this
repository's license; they contain no third-party document content.

The actual-WASM tests check both independent input containers, Korean/Latin
text, table values, embedded image output, and 1,001 explicit pages derived
from the owned HWPX. Browser acceptance also uses separately downloaded real
Hancom files; those third-party documents are not redistributed here. See
`../compatibility.md` for their provenance and observed limits.
