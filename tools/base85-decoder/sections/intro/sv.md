## Varför Base85-avkodning är viktig

Base85 dyker upp när binärdata måste passera genom textbaserade system med mindre overhead än hexadecimal eller Base64. Du kan stöta på det i PostScript- eller PDF-strömmar, ZeroMQ Z85-laster, felsökningsfångster, arkiverade exporter och verktyg som kräver utskrivbara tecken i stället för råa binära byte.

## Vad den här avkodaren hjälper till med

Det här verktyget omvandlar ASCII85- eller Z85-text tillbaka till de ursprungliga byten direkt i webbläsaren. Du kan klistra in kodade data, importera en fil, byta alfabet för att matcha källsystemet, förhandsgranska det avkodade resultatet och ladda ner den återställda binärfilen utan att skicka något till en server.

## Saker att tänka på

- ASCII85 och Z85 är inte utbytbara. Att välja fel alfabet leder vanligtvis till avkodningsfel eller skadad utdata.
- Base85 är ett kodningsformat, inte kryptering. Det avkodade resultatet kan vara vanlig text, komprimerat innehåll eller godtyckliga binärdata.
- Z85 kräver kompletta grupper om 5 tecken, medan ASCII85 också kan innehålla avgränsare och förkortningar som `z` för nollblock.
