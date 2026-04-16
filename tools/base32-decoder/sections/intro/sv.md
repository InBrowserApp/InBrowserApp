## Vad är Base32?

Base32 är användbart när en textkanal eller en kanal som inte skiljer på versaler och gemener behöver bära binärdata, som OTP-hemligheter, DNS-säkra token eller exporterade konfigurationsvärden. Det är ett kodningslager, inte ett säkerhetslager.

## När du bör använda det

- Avkoda Base32-hemligheter eller token tillbaka till sina ursprungliga byte.
- Granska värden som kopierats från TOTP-inställningar, integrations-exporter eller konfigurationsfiler.
- Kontrollera att inklistrade Base32-data har giltiga tecken och korrekt padding innan de används.

## Att tänka på

- Base32 ökar datastorleken mer än Base64.
- Det krypterar eller döljer inte det ursprungliga värdet.
- Vissa system utelämnar `=`-padding, men ogiltiga tecken orsakar fortfarande avkodningsfel.
