## Sjekk et STL- eller OBJ-nett på nett

Velg **Åpne fil**, eller dra en `.stl`- eller `.obj`-modell inn i verktøyet. Det leser nettet på enheten din og viser overflateareal, innelukket volum og topologiproblemer. Velg **Prøv et eksempel** for å sjekke en lukket monteringsbrakett før du åpner din egen fil.

## Les av overflateareal og volum

STL og OBJ fastsetter ingen felles fysisk måleenhet for koordinatene. Under **Koordinatenhet** velger du enheten du brukte da du eksporterte modellen. Arealet vises i kvadratenheter og volumet i kubikkenheter. Valget angir hvilken enhet de lagrede koordinatene har. Verdiene endres ikke. Braketten i eksemplet har et volum på 16 016 mm³ når koordinatene angir millimeter.

Overflatearealet er summen av arealene til alle trekantene i filen. Duplikate flater blir derfor telt med på nytt. Hvis nettet består topologikontrollene, beregner verktøyet volumet ut fra orienteringen til flatene. Flater som skjærer gjennom seg selv, og skall som er feilvendte eller overlapper, kan fortsatt påvirke beregningen. Sammenlign viktige resultater med den opprinnelige solidmodellen.

## Forstå topologiresultatene

- En **randkant** tilhører én trekant. Randkanter følger de åpne kantene i nettet, for eksempel rundt hull.
- En **ikke-manifold kant** tilhører mer enn to trekanter. Et **ikke-manifold hjørnepunkt** ligger på en slik kant eller forbinder grupper av flater som ellers ikke henger sammen.
- Ved **inkonsekvent flateorientering** følger to trekanter den felles kanten i samme retning. Riktig orienterte naboflater følger kanten i motsatt retning av hverandre.
- **Degenererte flater** har et areal på null. **Duplikate flater** gjentar den samme trekanten.

Verktøyet teller posisjoner som sammenfaller nøyaktig, som ett hjørnepunkt. Det teller skall ut fra kantene som trekantene deler. Ved topologifeil vises fortsatt overflatearealet og antall problemer. Tallene kan hjelpe deg med å finne ut hva du må reparere før du bruker volumet.

## Se på modellen eller konverter den

Bruk [STL-viseren](../stl-viewer/) eller [OBJ-viseren](../obj-viewer/) til å se på modellen i 3D, også som trådmodell. Bruk [OBJ til STL-konvertereren](../obj-to-stl-converter/) hvis neste verktøy trenger en STL-fil.

Hvis STL-kontrollen finner topologiproblemer, kan du velge **Reparer STL** for å jobbe videre med samme fil. På siden [Reparer STL-nett](../stl-mesh-repair/) kan du også sammenligne duplikate flater, flater uten areal, flatenes orientering og gjenværende topologiproblemer før du laster ned en ny STL-fil.
