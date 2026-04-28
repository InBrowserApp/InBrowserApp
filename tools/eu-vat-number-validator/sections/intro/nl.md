## Wat is een EU-btw-nummer?

Een btw-identificatienummer wordt afgegeven door een EU-lidstaat aan bedrijven die geregistreerd zijn voor de belasting over de toegevoegde waarde. Het begint met een landcode van twee letters (bijvoorbeeld `BE` voor België of `EL` voor Griekenland), gevolgd door een landspecifieke reeks cijfers en soms letters. Belastingdiensten gebruiken het om grensoverschrijdende handel en btw-teruggaven te volgen, dus fouten op facturen, contracten of inkoopdocumenten kunnen een betaling eenvoudig blokkeren of een controle uitlokken.

## Wat deze tool daadwerkelijk controleert

Deze checker voert drie onafhankelijke validaties uit, allemaal in je browser:

1. **Landcode** — de eerste twee letters moeten overeenkomen met een EU-lidstaat die deelneemt aan het btw-stelsel (inclusief de speciale code `EL` die voor Griekenland wordt gebruikt).
2. **Formaat** — de overige tekens moeten overeenkomen met het gedocumenteerde btw-formaat van het land. Zo bestaat een Belgisch btw-nummer uit precies tien cijfers, begint een Oostenrijks btw-nummer met `U` gevolgd door acht cijfers, en heeft een Nederlands btw-nummer de vorm `<negen cijfers>B<twee cijfers>`.
3. **Controlegetal** — waar er een deterministisch controlegetal bestaat in de btw-regels van het land (Oostenrijk, België, Denemarken, Finland, Frankrijk, Duitsland, Italië, Nederland, Polen, Portugal, Spanje, Zweden), wordt het laatste cijfer of de laatste letter opnieuw berekend en vergeleken.

Een nummer dat door alle drie de controles komt, is syntactisch correct opgebouwd. Dat is niet hetzelfde als bevestigen dat het bedrijf op dit moment geregistreerd is — daarvoor heb je nog steeds de VIES-dienst van de Europese Commissie of de lokale belastingdienst nodig. Gebruik deze tool het best vóór die laatste controle, om de typefouten, verwisselde cijfers en plakfouten eruit te halen die een VIES-opvraging om de verkeerde reden laten mislukken.

## Veelvoorkomende fouten die eruit gehaald worden

- Nummers die er op het eerste gezicht goed uitzien maar een letter tekort komen (bijvoorbeeld beginnend met `US` of `UK`).
- Voorloopnullen die door een spreadsheet zijn weggelaten, waardoor het nummer één cijfer te kort is.
- Spaties, punten of streepjes die een facturatiesysteem heeft meegeplakt — de tool normaliseert ze weg en controleert het resultaat.
- De klassieke verwarring tussen het Griekse `GR` en het btw-voorvoegsel `EL`, die de formaatcontrole meteen afwijst.

## Wat de resultaatkaart laat zien

Naast een simpele geldig/ongeldig-badge splitst het resultaat het land, het genormaliseerde nummer, het formaat dat het land verwacht en of het controlegetal geslaagd, mislukt of overgeslagen is omdat het land er geen publiceert, uit. Dat detail is handig wanneer je een afwijzing moet uitleggen — "formaat klopt, controlegetal niet" is veel bruikbaarder dan "ongeldig".

## Privacy

Elke controle wordt lokaal in je browser uitgevoerd. Er wordt niets naar een server gestuurd, gelogd of ergens opgeslagen, behalve in de localStorage van je eigen browser (voor het laatst ingevoerde nummer, zodat het een pagina-herlaad overleeft). Je kunt het btw-nummer van een klant plakken zonder je zorgen te maken over waar het terechtkomt.
