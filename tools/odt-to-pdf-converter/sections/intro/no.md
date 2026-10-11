## Konverter OpenDocument-tekst lokalt

Åpne et OpenDocument-dokument av typen `.odt` eller en `.ott`-mal, konverter det til PDF, kontroller sidene som opprettes, og last ned den samme PDF-en som vises i forhåndsvisningen. Bruk [ODT-viser](../odt-viewer/) for å lese uten konvertering.

## PDF-utseende og kompatibilitet

Konverteringsmotoren gjengir sidestiler, papirformater, retning, topptekster, bunntekster, spalter, tabeller og innebygde bilder. Sidene beholder rekkefølgen fra gjengivelsen, inkludert tomme sider som settes inn av sidestiler. Tekst som støttes, kan fortsatt merkes; OCR legges ikke til for skannet tekst. Manglende skrifttyper erstattes med medfølgende skrifttyper, så linjeskift, avstander og sideinndeling kan endres. Komplekse oppsett kan avvike fra det opprinnelige programmet. Kontroller hver side før du stoler på PDF-en.

PDF-en er en statisk eksport. Skjemakontroller vises slik de ser ut på utskrift. Kommentarer, makroer og digitale signaturer blir ikke bevart eller verifisert. Innebygde objekter, medier og eksterne dokumentressurser støttes ikke. Beskyttede dokumenter, skadede pakker eller oppdaget manglende innhold gir en feil, uten at en ufullstendig fil tilbys for nedlasting. Å endre filendelsen endrer ikke det underliggende formatet.

## Personvern og nettleserressurser

Konverteringen kjører på enheten din. Den første konverteringen laster ned omtrent 90 MB med motor- og skriftfiler, som nettleseren kan mellomlagre; selve dokumentet lastes aldri opp. Motoren lastes først etter at du har valgt en fil. Det kreves en oppdatert nettleser som støtter WebAssembly og delt minne. Store eller komplekse dokumenter kan kreve tid og minne. Du kan avbryte, lukke eller bytte filen. Det er ingen fast grense for filstørrelse eller antall sider.
