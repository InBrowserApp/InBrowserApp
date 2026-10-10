## Konvertera ett Word-dokument till Markdown

Välj eller släpp en lokal .docx-, .docm-, .dotx- eller .dotm-fil. Läs den genererade Markdown-texten, kopiera den eller ladda ner en .md-fil i UTF-8 med det ursprungliga filnamnet. När du byter eller stänger dokumentet avbryts pågående konvertering och det föregående resultatet rensas. DOCX-visaren erbjuder också Markdown-export för ett öppet dokument.

## Bevara användbar text och struktur

Rubriker, stycken, enkel textbetoning, listor, tabeller och länkar behåller användbar struktur. Markdown-tecken i dokumentets text skyddas med escape-tecken. Fotnoter, slutnoter och kommentarer behåller hänvisningar där de finns, med innehållet i separata avsnitt. Sidhuvuden och sidfötter samlas också separat. Olika Markdown-program kan återge fotnoter, ankare och radbrytningar i tabeller på olika sätt.

Markdown återskapar inte Words sidlayout, teckensnitt eller exakta läsordning. Bilder, diagram, ekvationer och figurer som inte stöds ersätts med markörer för utelämnat innehåll; tillgänglig text i figurer behålls. Sammanslagna celler och nästlade tabeller förenklas, och tabeller utan rubrikrad får en tom Markdown-rubrikrad. Markeringar för spårade ändringar tas bort, medan den tillgängliga slutliga texten behålls. Fält använder sin sparade text. Kontrollera viktigt innehåll mot originalet.

## Lokal bearbetning och kompatibilitet

Din fil stannar i webbläsaren och laddas inte upp eller sparas av det här verktyget. Makron körs inte och externa resurser läses inte in. Lösenordsskyddade filer, äldre .doc-filer och dokument med enbart bilder utan text som kan extraheras stöds inte. Det finns ingen fast gräns för filstorlek eller antal sidor, men komplexa dokument kan överskrida webbläsarens resurser. Verktyget exporterar text; det redigerar inte originaldokumentet och omvandlar inte skannade bilder till text.
