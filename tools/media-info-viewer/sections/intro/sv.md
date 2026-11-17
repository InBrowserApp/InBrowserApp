## Vad den här visaren visar

Visare för medieinformation läser tekniska metadata i lokala ljud- och videofiler,
bland annat MP4, MOV, MKV, WebM, AVI, MP3, FLAC och WAV. Använd den för att
kontrollera en exporterad fils specifikationer, kontrollera språktaggarna för en
films ljudspår eller ta fram en teknisk rapport för felsökning. Analysen startar
så snart du väljer eller släpper en fil.

## Information om filer, video, ljud och undertexter

- **Filöversikt:** faktiskt behållarformat, filstorlek, längd, total bithastighet,
  titel och kodningsprogram, när uppgifterna finns tillgängliga.
- **Videospår:** kodek, profil och bithastighet, upplösning, bildfrekvens och
  bildfrekvensläge, bildförhållande, rotation, bitdjup, färgrymd, färgundersampling
  och HDR-format.
- **Ljudspår:** kodek, bithastighet, språk, spårtitel, antal kanaler och
  kanallayout, samplingsfrekvens, bitdjup samt markeringar för standardspår eller
  tvingat spår. Varje ljudspår visas separat, så originalljud, dubbning och
  kommentarspår hålls åtskilda.
- **Undertextspår:** format, språk, titel, längd samt markeringar för standardspår
  eller tvingat spår när de finns i filen.

De viktigaste specifikationerna visas direkt. Öppna **Tekniska detaljer** för ett
spår för att se fler fält, eller välj en länk med antalet spår för att hoppa till
det första spåret av den typen. Vilka fält som är tillgängliga beror på formatet
och dess metadata.

## Så granskar du en fil

1. Välj en lokal ljud- eller videofil, eller dra den till filområdet.
2. Kontrollera sammanfattningen och granska sedan de enskilda video-, ljud- och
   undertextspåren.
3. Kopiera den läsbara rapporten till ett meddelande eller supportärende, eller
   ladda ner JSON för en inventering av mediefiler, ett skript eller vidare
   analys. Båda innehåller tekniska fält som är hopfällda i gränssnittet.
4. Välj **Byt fil** för att granska en annan fil, eller **Ta bort fil** för att
   rensa resultaten. Om du väljer en annan fil eller tar bort den aktuella filen
   stoppas också en eventuell pågående analys.

## Så tolkar du siffrorna

- **Behållare och kodek beskriver olika saker.** MP4 och Matroska är behållare;
  AVC/H.264, HEVC/H.265 och AAC beskriver hur strömmar är kodade. En behållare
  kan innehålla flera ljud- eller undertextspår.
- **Den totala bithastigheten gäller hela filen.** Den omfattar alla strömmar
  och behållarens overhead. Ett spårs bithastighet gäller bara den strömmen.
  Bithastigheter anges i kb/s eller Mb/s; filstorlekar anges i B, KiB, MiB, GiB
  eller TiB.
- **Längden anges med millisekunder.** Visningen använder `HH:MM:SS.mmm`.
  Bildfrekvens anges i fps och ljudets samplingsfrekvens i kHz. CFR anger
  konstant bildfrekvens; VFR anger variabel bildfrekvens.
- **Spårmarkeringar beskriver hur spåren är avsedda att väljas.** Standardspår
  markerar ett föredraget spår; tvingat spår används ofta för undertexter som
  ska visas utan att man väljer ett fullständigt undertextspår. Det är två
  separata markeringar som hämtas från filen.

Vissa behållare anger inte en separat bithastighet för varje ström. Värden som
saknas utelämnas eller markeras som ej tillgängliga; de gissas inte utifrån
filnamnet. Inbäddade omslagsbilder räknas inte som videospår.

## Vanliga användningsområden

Kontrollera upplösning och bildfrekvens efter att du har exporterat en video,
granska kanaler och samplingsfrekvens innan du redigerar ljud, identifiera flera
språk- eller kommentarspår eller samla in uppgifter om kodekar när du undersöker
ett uppspelningsproblem. Med rapporten kan du dela de relevanta specifikationerna
utan att skicka mediefilen.

## Lokal bearbetning och export av rapporter

Analysen sker i din webbläsare: mediefilen laddas inte upp och dess innehåll
ändras inte. Analysatorn läser delar av filen efter behov och kan därför granska
metadata även när webbläsaren inte kan spela upp behållaren eller kodeken.

**Kopiera rapport** ger en läsbar textsammanfattning. **Ladda ner JSON** exporterar
de metadata som analysatorn returnerar tillsammans med filnamnet och
filstorleken. I JSON anges `Duration` i sekunder, `BitRate` och `OverallBitRate`
i bitar per sekund och `SamplingRate` i hertz. Gränssnittet formaterar dessa
värden till mer lättlästa enheter. Exporten behåller också ytterligare
metadatafält utöver dem som visas i spårkorten.
