## Exportera e-postinnehåll

Öppna en EML-, EMLX- eller MSG-fil och välj HTML eller oformaterad text. Förhandsvisa och ladda ner ett fristående HTML-dokument eller kopiera och ladda ner UTF-8-text. Båda formaten innehåller läsbara sparade meddelandehuvuden, den ursprungliga datumtexten och en bilagelista. Ditt e-postmeddelande stannar i din webbläsare.

## HTML- och textformat

HTML använder en enkel läslayout med markerbar text och inbäddade rasterbilder som stöds. Den läsbara HTML-texten används i första hand, annars den sparade oformaterade texten. Filen öppnas offline. Säkra externa länkar öppnas endast när de väljs; interna referenser stannar i dokumentet. Ursprungliga stilar, skript, formulär, inbäddade appar, SVG och MathML utelämnas. Fjärrbilder och andra externa resurser hämtas inte; utelämnat innehåll anges i resultatet.

Textexport använder i första hand det sparade alternativet med oformaterad text. Om det saknas extraheras läsbar text och säkra länkadresser från HTML, med användbara avgränsningar mellan stycken, listor, citat och tabeller. Resultatet innehåller inga bilder eller formatering. Bilagornas namn, typer, storlekar och roller listas, men bifogade filer och e-postmeddelanden ingår inte i något av formaten.

## Meddelanden som stöds och begränsningar

Använd ett fullständigt, okrypterat e-postmeddelande. Ofullständiga meddelanden, inbäddade bilder som saknas eller inte kan läsas, kalender- och kontaktobjekt i MSG-format samt Outlook-meddelanden vars text bara finns som komprimerad RTF kan inte exporteras. Separata Apple Mail-resurser läses inte in. Datum som saknas eller är felaktigt formaterade och Outlook-tidsstämplar som använder UTC som reserv markeras utan att avsändarens tidszon gissas. Avsändarens identitet, digitala signaturer och leverans verifieras inte.

Webbläsarens minne och formatstöd avgör vad som kan bearbetas, utan någon fast gräns för filstorlek eller sidantal. För att granska det sparade meddelandet och dess alternativ utan att exportera kan du använda [E-postvisaren](../email-viewer/). För en utskrivbar kopia kan du använda [E-post till PDF-konverteraren](../email-to-pdf-converter/).
