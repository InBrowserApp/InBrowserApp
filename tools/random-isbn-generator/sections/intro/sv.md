## Generera slumpmässiga ISBN-10- eller ISBN-13-nummer

Välj `ISBN-13` för aktuella katalog- och försäljningsformulär eller `ISBN-10` för äldre poster. Ange ett antal från `1` till `1000`, välj om bindestreck ska inkluderas och välj **Generera**. Kopiera uppsättningen eller ladda ner en TXT-fil med ett ISBN per rad.

## Förstå formatet och kontrollsiffran

Ett International Standard Book Number (ISBN) identifierar en bokutgåva och dess format. De genererade `ISBN-13`-värdena använder prefixet `978` och slutar med en numerisk kontrollsiffra. Ett `ISBN-10` kan sluta med `X`, som står för tio i beräkningen av kontrollsumman. Två exempel är `978-0-306-40615-7` och `0-8044-2957-X`. Bindestreck gör grupperna lättare att läsa och ändrar inte kontrollsiffran.

## Använd resultaten i testdata

Använd dessa exempelidentifierare för att testa katalogformulär, importer och ISBN-validering. För att testa ett fel i kontrollsumman, ersätt bara det sista tecknet med en annan siffra och försök importera igen. Lagra ISBN som text i ett kalkylblad eller en databas för att behålla en inledande nolla eller ett avslutande `X`. För en utgiven bok hittar du ISBN på utgåvans omslag eller i förlagets post.
