Skapa BIP39-seed-fraser i webbläsaren, granska importerade mnemonics innan du litar på dem och konvertera mellan rå entropi och plånboksord utan att skicka känsligt material till en annan tjänst. Verktyget är användbart när du behöver en enda arbetsyta för generering, checksum-validering och återställningsarbete på låg nivå.

## Generera med avsikt

Välj en ordlista som stöds och ett antal ord och generera om tills du har den seed-fras du vill spara. Den matchande entropin visas bredvid frasen så att du kan kontrollera den exakta styrkan och behålla båda representationerna tillsammans när du dokumenterar ett återställningsflöde.

## Validera innan import

Använd valideringsläget när någon ger dig en mnemonic-fras och du vill göra en snabb kontroll av checksum och ordantal innan du importerar den i en annan plånbok. Ett giltigt resultat visar också den återställda entropin, vilket hjälper när du jämför två återställningskällor eller felsöker derivationssteg.

## Konvertera entropi försiktigt

Konverteringsläget fungerar i båda riktningarna: från rå entropi till ord och från mnemonic-ord tillbaka till entropi. Det gör det praktiskt för testdata, deterministiska plånboksdemonstrationer och incidentgranskningar där du behöver bekräfta att en fras fortfarande motsvarar de förväntade bytena under en viss BIP39-ordlista.
