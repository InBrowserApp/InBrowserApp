## Så konverterar du CBR till CBZ

Välj en `.cbr`-fil eller dra den till konverteraren. Det går också bra att använda ett `.rar`-arkiv med bilderna från en serie. Kontrollera filnamnen för första och sista sidan och välj **Ladda ner CBZ**. Till exempel blir `volume-01.cbr` till `volume-01.cbz`. Konverteringen sker på din enhet.

## Seriens originalsidor och metadata

CBR lagrar seriebilder i ett RAR-arkiv. CBZ använder ZIP, ett format som många serieläsare och appar för seriesamlingar kan öppna. Konverteraren kopierar sidfilerna till ZIP-arkivet utan att koda om dem, så upplösningen och bildkvaliteten bevaras. Filerna behåller sina namn och mappar. Verktyget sorterar efter hela sökvägen och behandlar siffrorna som tal, så `chapter2/page2.jpg` kommer före `chapter2/page10.jpg`. Befintliga `ComicInfo.xml`-filer följer också med.

## Så öppnar du den nya CBZ-filen

Öppna den nedladdade filen i [CBZ-serieläsaren](/sv/tools/cbz-reader/) eller importera den till din seriesamling. Om du behöver en version för utskrift kan du använda [CBZ till PDF](/sv/tools/cbz-to-pdf-converter/). Om RAR-arkivet är lösenordsskyddat eller uppdelat i flera delar behöver du först packa upp det och samla filerna i ett enda arkiv utan lösenord.
