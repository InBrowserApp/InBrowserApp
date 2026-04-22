## Vad är Base32?

Base32 är användbart när en textkanal eller en kanal som inte skiljer på versaler och gemener behöver bära binärdata, som OTP-hemligheter, DNS-säkra token eller exporterade konfigurationsvärden. Det är ett kodningslager, inte ett säkerhetslager.

## När du bör använda det

- Koda bytes, text eller filer till Base32 innan de skickas via textkanaler.
- Förbereda OTP-hemligheter, exporterade inställningar eller binära blobbar för system som väntar sig Base32-indata.
- Omvandla råa filbytes till en kopierbar sträng för överföring, loggning eller manuell inmatning.

## Att tänka på

- Base32 ökar datastorleken mer än Base64.
- Det krypterar eller döljer inte det ursprungliga värdet.
- Vissa system kräver `=`-padding medan andra accepterar utdata utan padding, så anpassa dig till mottagaren.
