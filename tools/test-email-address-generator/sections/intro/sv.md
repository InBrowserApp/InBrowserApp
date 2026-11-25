## Generera en uppsättning test-e-postadresser

Välj domän, ange antal adresser och välj **Generera**. Välj **Slumpmässig exempeldomän** för att få adresser från flera domäner i samma lista. Varje adress förekommer en gång i listan. Kopiera resultatet till ett formulär eller kalkylblad, eller ladda ner en UTF-8-textfil med en adress per rad som testdata.

## Vilka e-postdomäner kan jag använda?

Faker.js genererar adresser med `example.com`, `example.net` och `example.org`. De här [reserverade exempeldomänerna](https://www.iana.org/help/example-domains) används i dokumentation och exempeldata. I `alex.morgan42@example.com` är delen före `@` den lokala delen och `example.com` är domänen. Välj en domän om testet kräver ett fast värde, eller blanda domäner för att testa filtrering och import.

## Vad kan jag testa med adresserna?

Använd exempeladresserna för att testa registreringsformulär, formatering av e-postadresser, listor med konton eller borttagning av dubbletter i en databas. Verktyget ger dig adresser i textform utan att skapa några inkorgar. Om du vill testa e-postleverans eller verifieringslänkar kan du använda en inkorg du kontrollerar eller projektets testmiljö för e-post.
