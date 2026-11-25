## Reparera en STL-fil online

Välj **Öppna fil** eller dra en binär `.stl`-fil eller en `.stl`-fil i ASCII-format till verktyget. Reparationen sker på din enhet. Välj **Prova ett exempel** för att se ett litet nät med dubbla ytor, ytor utan area och omvända ytor. Jämför resultaten och välj **Ladda ner STL** för att spara en ny fil med samma storlek och koordinater. Filen sparas i ASCII-format om binär STL skulle avrunda de ursprungliga koordinaterna.

## Det här ändras vid reparation

Verktyget tar bort exakt dubbla trianglar och trianglar med arean noll. Det jämför orienteringen hos angränsande ytor. När det finns två möjliga konsekventa orienteringar väljer det den som kräver att färre ytor vänds. Hörnen behåller sina positioner. Öppna gränser, tvetydig ytorientering och icke-manifoldanslutningar kan kräva manuell reparation. Hål, nästan sammanfallande hörn och skärningar finns kvar. [Vanliga nätproblem vid 3D-utskrift](https://help.prusa3d.com/article/corrupted-3d-models-for-printing_2205)

## Jämför topologin före och efter

Kontrollera antalet trianglar, dubbla ytor och degenererade ytor. Rapporten visar också kvarvarande kanter med inkonsekvent ytorientering, öppna gränser samt icke-manifoldkanter och icke-manifoldhörn. Öppna den nedladdade filen i [STL-visaren](../stl-viewer/) för att granska den i 3D. Använd [Kontrollera nätets volym och topologi](../mesh-inspector/) för att mäta ytarean eller den inneslutna volymen. I STL-rapporten visas **Reparera STL** när kontrollen hittar dubbla eller degenererade ytor eller inkonsekvent ytorientering.
