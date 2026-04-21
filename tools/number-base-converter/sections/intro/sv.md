Konvertera heltal direkt i webbläsaren mellan binärt, oktalt, decimalt, hexadecimalt, Base32, Base36, Base62, Base64 och anpassade baser från 2 till 64. Allt beräknas lokalt med BigInt, så du kan granska stora värden utan att skicka dem till en server.

## När det är användbart

Använd verktyget när samma heltal förekommer i loggar, protokoll, ID:n eller specifikationer med olika alfabet. När du ändrar ett fält räknas de andra om direkt, vilket är användbart för felsökning, dokumentation och manuell kontroll.

## Skillnader mellan baser

Upp till bas 36 accepteras bokstäver utan skillnad på stora och små bokstäver. Högre baser behandlar versaler och gemener som olika siffror, och Base64-raden använder det numeriska alfabetet `A-Z a-z 0-9 + /`, inte byteorienterad Base64-textkodning.

## Saker att tänka på

Endast icke-negativa heltal stöds. Inledande nollor behandlas som formatering, så den konverterade utdata normaliseras och kan förlora den utfyllnad du skrev in.
