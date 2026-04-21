## Vad är ett PRC Resident ID?

Det 18-siffriga PRC Resident ID-numret innehåller adresskod, födelsedatum, sekvenskod och kontrollsiffra. Den här validatorn kontrollerar dessa delar offline och hjälper dig att förstå hur numret är uppbyggt.

### Så fungerar valideringen

- Tar bort mellanslag och bindestreck och normaliserar sista tecknet till versalt `X`
- Kräver exakt 18 tecken: 17 siffror och en sista siffra eller `X`
- Matchar de första 6 siffrorna mot datasetet för administrativa indelningar 2023 och tolkar födelsedatumet på 8 siffror
- Räknar om kontrollsiffran från de första 17 siffrorna och jämför den med sista tecknet

### Vad resultatet visar

- Regionuppdelning: provins, stad, distrikt/grevskap och den råa regionkoden
- Födelsedatum, aktuell ålder, sekvenskod och könsvärdet som härleds från sekvenskoden
- Det normaliserade ID-numret samt förväntad och faktisk kontrollsiffra för felsökning

### Exempel

`110101199001010015` kan läsas så här:

- `110101` -> Dongcheng-distriktet, Peking
- `19900101` -> födelsedatum `1990-01-01`
- `001` -> sekvenskod
- `5` -> kontrollsiffra

### Viktig anmärkning

Det här verktyget gör bara strukturell och checksummabaserad validering offline. Ett nummer som klarar dessa kontroller bevisar inte att det tillhör en verklig eller fortfarande giltig identitetshandling.

Regionsnamnen bygger på datasetet för administrativa indelningar från 2023.
