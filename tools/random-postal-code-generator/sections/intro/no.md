## Generer postnumre til testing

Velg land eller region, angi antall og velg **Generer**. Du kan kopiere listen eller laste ned en UTF-8-kodet tekstfil med ett postnummer per linje. Bruk resultatene til å fylle ut testskjemaer, lage eksempeldata eller se hvordan lokale postnumre vises i betalings- og registreringsskjemaer.

## Sammenlign postnummerformater

Postnumre kan inneholde bokstaver, mellomrom, bindestreker eller nuller først. En amerikansk ZIP-kode kan se ut som `02108`. ZIP+4 legger til en bindestrek og fire sifre, som i `02108-1234`. Et britisk postnummer kan se ut som `SW1 2AB`, et kanadisk som `K1A 0B1`, et japansk som `100-0001` og en brasiliansk CEP som `01001-000`. Landet eller regionen du velger, bestemmer formatet uavhengig av språket på siden.

Når du importerer resultatene i et regneark eller en database, bør du lagre postnumrene som tekst. Hvis du importerer `02108` som et tall, forsvinner nullen først og verdien endres.

## Kan jeg bruke resultatene til å sende post?

Faker.js lager eksempelkoder i det valgte formatet. En kode kan tilfeldigvis tilhøre et virkelig distribusjonsområde. Når du skal sende post, kan du slå opp postnummeret til mottakerens adresse hos den aktuelle posttjenesten.
