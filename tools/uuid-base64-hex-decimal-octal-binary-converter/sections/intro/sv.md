## Vad det här verktyget konverterar

Den här konverteraren behandlar ett UUID som det 128-bitarsvärde det faktiskt
är och håller de vanliga representationerna synkroniserade. Klistra in ett
UUID, Base64-värde, en hexadecimal sträng, ett decimalt heltal, ett oktalt
värde eller ett binärt värde, så uppdateras de andra formaten lokalt i din
webbläsare.

## Så läser du formaten

UUID-fältet visar den kanoniska formen med bindestreck. Hexadecimal är samma
16 byte som 32 hexadecimala siffror med gemener. Base64 är standardutfyllt
Base64 för de råa 16 byte, inte Base64 för texttecknen i UUID:et. Decimal,
oktal och binär visar UUID:et som ett osignerat 128-bitars heltal; den binära
utmatningen vänsterutfylls till alla 128 bitar så att inledande nollor förblir
synliga.

## Vad du bör se upp med

Värden utanför UUID:ets 128-bitarsintervall avvisas. Base64-inmatning måste
avkodas till exakt 16 byte. Konverteraren accepterar vanliga inklistrade
varianter som UUID:er med versaler, `urn:uuid:`-prefix, klamrar, kompakta
UUID:er med 32 hextecken, blanksteg runt långa numeriska värden och URL-säker
Base64. Ingenting laddas upp medan du konverterar eller genererar exempel-UUID.
