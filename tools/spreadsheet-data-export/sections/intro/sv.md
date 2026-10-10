## Exportera ett kalkylblad till ett överförbart format

Öppna en lokal .xlsx-, .xlsm-, .xltx- eller .xltm-fil eller släpp den i exportverktyget. Välj ett kalkylblad efter dess ursprungliga namn, även bland dolda kalkylblad, och välj CSV, TSV, JSON eller Markdown. Förhandsvisa resultatet, kopiera det eller ladda ner en UTF-8-fil som namnges efter arbetsboken och kalkylbladet. Om du byter eller stänger filen avbryts pågående arbete och tidigare nedladdningar tas bort. XLSX-visaren erbjuder också åtgärden Exportera kalkylblad för det aktuella bladet.

Standardområdet är den minsta rektangel som innehåller sparade värden eller formler. Tomma celler och rader inom rektangeln finns kvar i resultatet. Du kan ange ett annat område, till exempel A1:D20, och välja Tillämpa område. Ett tomt blad ger en tom textfil eller en tom JSON-array, om du inte uttryckligen väljer ett område.

## Välj hur värden och rubriker ska återges

Formaterad text följer talformat som stöds och bevarar visade datum och talformat med inledande nollor där det är möjligt. Format som beror på regionala inställningar kan skilja sig från Excel. Lagrade värden bevarar tal och booleska värden; datum förblir Excels serienummer utan att tilldelas en tidszon. Textceller behåller sin text i båda lägena. Formler använder sina sparade resultat utan omberäkning. Ett saknat sparat resultat blir en tom cell, med en notis i gränssnittet. Kalkylbladsfel förblir läsbara strängar som #DIV/0!.

CSV och TSV omger fält som innehåller avgränsare, citattecken eller radbrytningar med citattecken. JSON är en array med radarrayer: första raden finns kvar i data, dubbla eller tomma rubriker blir inte objektnycklar och tomma celler använder null. Markdown kan använda första raden som rubrikrad eller lägga till en tom rubrikrad ovanför alla datarader. Markdown-tecken, HTML, lodstreck och radbrytningar i celler skyddas med escape-tecken eller återges på ett säkert sätt. Nedladdningar använder UTF-8 utan byteordningsmarkering; välj UTF-8 när du importerar till ett annat program.

## Lokal behandling och kompatibilitet

Arbetsboken stannar i den här webbläsaren och laddas inte upp eller sparas av verktyget. Makron, skript och externa dataanslutningar körs inte och uppdateras inte. Dolda rader och kolumner tas med i det valda området. Sammanfogade celler utökas inte till upprepade värden. Diagram, bilder, kommentarer och arbetsbokens formatering ingår inte i dessa textformat.

Krypterade eller skadade arbetsböcker och arbetsböcker som inte stöds ger ett tydligt felmeddelande. Det finns inga fasta gränser för filstorlek eller antal kalkylblad, rader eller kolumner, men en stor export kan överskrida webbläsarens minne. Verktyget exporterar sparade data; det redigerar inte arbetsboken och garanterar inte att ett annat kalkylprogram tolkar fält med vanlig text på samma sätt.
