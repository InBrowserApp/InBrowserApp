Generera CUID2-identifierare lokalt i webbläsaren utan att skicka den aktuella batchen till någon annan tjänst. Verktyget är användbart när du behöver kompakta offentliga ID:n för poster, URL:er, inbjudningslänkar, testdata eller klientsidans platshållare och vill styra både antal och längd direkt.

## Vad Som Gör CUID2 Annorlunda

CUID2 är utformat för att minska kollisioner i distribuerade system och samtidigt vara URL-vänligt. Varje värde börjar med en liten bokstav, använder bara små base36-tecken och blandar räknare, värdfingeravtryck och slumpentropi innan slutvärdet hashats.

## Välj Antal Och Längd

Använd kortare utdata när du vill ha kompakta slugs för demomiljöer, testdata eller tillfälliga länkar. Öka längden när du behöver mer utrymme för långlivade poster eller större distribuerade arbetslaster, och öka antalet när du vill skapa en hel batch i ett steg.

## Kopiera Eller Exportera Den Slutliga Batchen

Granska den genererade listan och kopiera den eller ladda ner den som en textfil när formatet känns rätt. Eftersom allt körs lokalt stannar identifierarna i din webbläsare tills du själv väljer att använda eller dela dem.
