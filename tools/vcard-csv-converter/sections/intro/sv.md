## Konvertera VCF-kontakter till ett CSV-kalkylblad

Välj **vCard till CSV**, öppna en `.vcf`-fil eller klistra in innehållet och välj **Konvertera**. CSV-filen får en rad per kontakt. Ladda ner den om du vill sortera eller redigera adressboken i Excel, Google Kalkylark eller ett annat kalkylprogram. Med **Prova ett exempel** ser du hur indata kan se ut i båda riktningarna.

## Gör vCard-filer av en CSV-kontaktlista

Välj **CSV till vCard** och använd en UTF-8-kodad CSV-fil med kolumnrubriker på första raden. Verktyget känner igen `Full Name`, `First Name`, `Last Name`, `Email`, `Phone`, `Company`, `Job Title`, `Website`, `Address` och `Notes` samt vanliga varianter från adressböcker. En rad under `First Name,Last Name,Email` kan exempelvis bli en kontakt med både visningsnamn och separata för- och efternamn.

Ladda ner VCF-filen och importera den till adressboken. Filen innehåller en post i vCard 3.0-format per kontaktrad.

## Vilka uppgifter ryms i CSV?

CSV är ett enkelt tabellformat. Verktyget behåller den första e-postadressen, det första telefonnumret, den första webbadressen och den första postadressen från varje kort. Foton, fältetiketter och egna vCard-egenskaper finns kvar i den ursprungliga VCF-filen. Behåll originalet om du behöver en komplett säkerhetskopia. Konverteringen sker i webbläsaren.
