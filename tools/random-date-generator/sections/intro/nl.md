## Willekeurige kalenderdatums binnen een datumbereik genereren

Vul de velden **Startdatum** en **Einddatum** in, kies een uitvoernotatie en klik op **Genereren**. Beide grensdatums tellen mee. In het bereik van `2024-02-28` tot en met `2024-03-01` kan daarom ook de schrikkeldag `2024-02-29` voorkomen. Dezelfde datum kan meerdere keren in de lijst staan. Kopieer de resultaten of download een `UTF-8`-tekstbestand met één datum per regel.

## Kiezen tussen ISO en lokale datumnotatie

Gebruik **ISO (YYYY-MM-DD)** voor testgegevens, bij het importeren in spreadsheets of om datums als tekst chronologisch te sorteren. Kies **Datum in lokale notatie** om een datum uit de gregoriaanse kalender weer te geven in de taal van de pagina. Zo verschijnt `2024-02-29` op de Engelse pagina als `Feb 29, 2024` en op de Duitse pagina als `29.02.2024`.

## Dezelfde kalenderdag in elke tijdzone

Het datumbereik gebruikt het begin en einde van de dag in UTC. Een gekozen datum blijft dezelfde kalenderdag, ook als die op de start- of einddatum valt. Als de startdatum en einddatum gelijk zijn, genereert de tool telkens die datum. Dat is handig om schrikkeldagen of de eerste of laatste dag van een maand te testen.
