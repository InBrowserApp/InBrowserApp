## Vad verktyget gör

- Kodar vanlig text till namngivna, decimala eller hexadecimala HTML-entiteter.
- Avkodar redan entitetskodat innehåll tillbaka till läsbar text.
- Allt körs lokalt i webbläsaren, så dina data stannar på enheten.

## När du använder det

- Escape:a specialtecken innan du klistrar in HTML i dokumentation, mallar eller
  demos.
- Granska kopierad markup som innehåller `&amp;`, `&#60;` eller `&#x3C;`.
- Jämför namngivna, decimala och hexadecimala entiteter för
  kompatibilitetsbehov.

## Att tänka på om entitetsformat

- Namngivna entiteter är lättast att läsa, men alla tecken har inte en
  namngiven form.
- Decimala och hexadecimala entiteter kan representera alla Unicode-tecken,
  inklusive emoji.
- Okända eller ogiltiga entiteter lämnas oförändrade vid avkodning.
