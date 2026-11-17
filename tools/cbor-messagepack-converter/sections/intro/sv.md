## Granska binära API-data

CBOR och MessagePack är kompakta binära serialiseringsformat för strukturerade data. Använd konverteraren för att granska API-svar, WebSocket-meddelanden eller cachade värden som JSON, eller skapa binära data från JSON för felsökning. Allt bearbetas i webbläsaren; indata laddas inte upp eller sparas.

## Koda JSON eller avkoda byte

Välj binärt format och konverteringsriktning. För att koda anger du JSON och väljer Hex, Base64 eller Base64URL för utdata. För att avkoda klistrar du in byte och väljer deras indatakodning. Om du ändrar indatakodningen tolkas texten som redan finns i redigeraren på nytt.

Öppna en JSON-fil vid kodning eller en rå `.cbor`-, `.msgpack`- eller `.bin`-fil vid avkodning. Kodad text som Hex eller Base64 ska klistras in i redigeraren. Konvertera och kopiera sedan den visade texten eller ladda ned resultatet. Binära nedladdningar innehåller de faktiska byten och kan importeras igen.

## Bevara värden och förstå begränsningarna

Heltalsliteraler behåller alla siffror inom det 64-bitarsintervall som formatet stöder. Värden som JSON inte kan representera, till exempel binära fält, CBOR-taggar och MessagePack-tillägg, visas som uttryckliga typade omslag. Aktivera Utökad JSON för att koda dessa omslag tillbaka till binärt format; låt funktionen vara avstängd för vanliga JSON-objekt som råkar använda omslagsnycklar.

Med Utökad JSON aktiverat kodar exempelvis `{"id":{"$integer":"9007199254740993"},"data":{"$binary":"AQI="}}` ett exakt heltal och två binära byte.

Varje konvertering hanterar ett värde, med en indatagräns på 1 MiB. Byte i formaterad JSON räknar den visade, formaterade JSON-texten och inte de ursprungliga indata. Omkodning bevarar värden som stöds men kan ändra ordningen i mappningar eller valet av binär kodning. Öppna ”Format och bevarande av typer” ovan för omslagssyntax och typer som inte stöds.
