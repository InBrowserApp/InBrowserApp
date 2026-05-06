## Bygg cron-scheman visuellt

Cron-uttryck är kompakta, men en liten ändring i fel fält kan flytta ett jobb från "vardagsmorgnar" till "varje minut." Den här generatorn ger varje fält egna kontroller så att du kan bygga ett standarduttryck med fem fält utan att memorera varje syntaxregel.

### När det hjälper

- Skapa scheman för CI-jobb, säkerhetskopior, cacheuppvärmare, rapporter och andra återkommande uppgifter.
- Börja med en känd förinställning och finjustera ett fält i taget.
- Förhandsvisa kommande lokala körningstider innan du klistrar in uttrycket i en schemaläggare.

### Så använder du det

1. Välj en snabb förinställning, eller behåll standarduttrycket och redigera varje fält manuellt.
2. Välj om varje fält ska matcha varje värde, ett intervall, specifika värden eller ett spann.
3. Granska det genererade uttrycket och förhandsvisningen av nästa körningar, och kopiera det sedan till din schemaläggare.

### Anteckningar

- Det här verktyget genererar standard-cron med fem fält: minut, timme, dag i månaden, månad och veckodag.
- Söndag visas som `0`, vilket accepteras av vanliga Unix-liknande cron-schemaläggare.
- Om både dag i månaden och veckodag är begränsade kör många cron-implementationer när något av fälten matchar. Vissa system skiljer sig åt, så verifiera den kombinationen i den schemaläggare du ska använda.
