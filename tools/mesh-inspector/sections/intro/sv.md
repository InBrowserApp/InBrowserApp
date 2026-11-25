## Kontrollera ett STL- eller OBJ-nät online

Välj **Öppna fil** eller dra en `.stl`- eller `.obj`-modell till verktyget. Det läser nätet på din enhet och visar ytarea, innesluten volym och eventuella topologiproblem. Välj **Prova ett exempel** för att analysera ett slutet monteringsbeslag innan du öppnar din egen fil.

## Läs av ytarea och volym

STL och OBJ anger ingen gemensam fysisk måttenhet för koordinaterna. Välj den enhet du använde vid exporten under **Koordinatenhet**. Ytarean anges i kvadratenheter och volymen i kubikenheter. Valet anger en enhet för de lagrade koordinaterna, vars värden förblir desamma. Beslaget i exemplet har volymen 16 016 mm³ när koordinaterna anges i millimeter.

Ytarean är summan av areorna för alla trianglar i filen. Dubbla ytor räknas därför med igen. Om nätet klarar topologikontrollerna beräknar verktyget volymen utifrån ytornas orientering. Ytor som korsar sig själva samt felvända eller överlappande skal kan fortfarande påverka uppskattningen. Jämför viktiga resultat med den ursprungliga solidmodellen.

## Förstå topologikontrollerna

- En **randkant** tillhör en enda triangel. Randkanterna följer öppna gränser, till exempel runt hål.
- En **icke-manifoldkant** tillhör fler än två trianglar. Ett **icke-manifoldhörn** ligger vid en sådan kant eller förenar grupper av ytor som i övrigt inte hänger ihop.
- Vid **inkonsekvent ytorientering** går två trianglar längs sin gemensamma kant i samma riktning. Korrekt orienterade grannytor går längs kanten i motsatta riktningar.
- **Degenererade ytor** har arean noll. **Dubbla ytor** upprepar samma triangel.

Verktyget räknar positioner som sammanfaller exakt som ett enda hörn. Skal räknas utifrån vilka kanter trianglarna delar. Om verktyget hittar ett topologifel visar det fortfarande ytarean och antalet problem. Antalen kan hjälpa dig att se vad som behöver åtgärdas innan du använder volymen.

## Granska eller konvertera modellen

Använd [STL-visaren](../stl-viewer/) eller [OBJ-visaren](../obj-viewer/) för att granska modellen i 3D, även som trådram. Använd [OBJ till STL-konverteraren](../obj-to-stl-converter/) om nästa verktyg behöver en STL-fil.
