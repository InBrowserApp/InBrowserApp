## Vad är Base64?

Base64 är användbart när en textbaserad kanal behöver bära binärvänliga nyttolaster, såsom e-postinnehåll, JSON-blobbar eller små data URL:er. Det är ett kodningslager, inte ett säkerhetslager.

## När du bör använda det

- Snabb felsökning när ett API returnerar eller förväntar sig Base64-strängar.
- Konvertering av webbläsartext till ett säkert transportformat för loggar eller nyttolaster.
- Kontrollera om en inklistrad Base64-blob avkodas till det innehåll du förväntar dig.

## Att tänka på

- Base64 ökar storleken med ungefär en tredjedel.
- Det krypterar eller döljer inte det ursprungliga värdet.
- Ogiltig utfyllnad eller trasig kopiera-och-klistra dyker oftast upp som ett avkodningsfel.
