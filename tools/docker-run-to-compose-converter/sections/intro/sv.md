## Vad verktyget gör

Docker Run till Compose-omvandlare omvandlar ett eller flera `docker run`-kommandon till en
`docker-compose.yml`-fil i webbläsaren. Du kan granska den genererade YAML-koden,
kopiera den eller ladda ner den innan du lägger in den i ditt projekt.

## När det är användbart

Använd verktyget när du vill omvandla ett tillfälligt containerkommando till en återanvändbar
Compose-tjänstdefinition, eller när du vill se hur portar, volymer,
miljövariabler och resursflaggor motsvaras i Compose.

## Vad du kan förvänta dig

Vanliga alternativ som portar, miljövariabler, omstartspolicy,
hälsokontroller, monteringar och resursgränser bevaras. Flaggor som inte stöds
eller är tvetydiga visas som varningar så att du kan granska resultatet innan
du använder det.
