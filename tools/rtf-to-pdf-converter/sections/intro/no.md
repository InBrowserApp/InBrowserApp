## Konverter rik tekst lokalt

Åpne et lokalt `.rtf`-dokument, konverter det til PDF, kontroller de ferdige sidene og last ned den samme PDF-en som vises i forhåndsvisningen. Bruk [RTF-viseren](../rtf-viewer/) for å lese uten å konvertere.

## PDF-utseende og kompatibilitet

Konverteringsmotoren gjengir sidestørrelser, retning, topptekster, bunntekster, sideskift, tabeller og støttede innebygde PNG- og JPEG-bilder. Tekst som støttes, kan fortsatt merkes. Opprinnelige RTF-tegnkodinger og Unicode-escapesekvenser sendes til motoren; OCR legges ikke til skannet tekst. Manglende skrifttyper erstattes med medfølgende skrifttyper, så linjeskift, avstander og sideinndeling kan endres. Komplekse oppsett kan avvike fra det opprinnelige programmet. Kontroller hver side før du baserer deg på PDF-en.

PDF-en er en statisk eksport. Skjemakontroller gjengis slik de ser ut på utskrift. Kommentarer, makroer og digitale signaturer blir ikke bevart eller verifisert. Innebygde objekter, eksterne dokumentressurser, bildeformater som ikke støttes, og feltinstruksjoner som ikke støttes, avvises. Skadede eller uleselige filer gir en feilmelding uten at en ufullstendig fil blir tilgjengelig for nedlasting. Å endre filendelsen endrer ikke det underliggende formatet.

## Personvern og nettleserressurser

Konverteringen kjører på enheten din. Den første konverteringen laster ned omtrent 90 MB med motor- og skriftfiler, som nettleseren kan mellomlagre; selve dokumentet lastes aldri opp. Motoren lastes først etter at du har valgt en fil. En oppdatert nettleser med støtte for WebAssembly og delt minne kreves. Store eller komplekse dokumenter kan kreve tid og minne. Du kan avbryte, lukke eller bytte filen. Det er ingen fast grense for filstørrelse eller antall sider.
