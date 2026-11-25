## Reparer en STL-fil på nett

Velg **Åpne fil**, eller dra en `.stl`-fil i ASCII- eller binærformat inn i verktøyet. Reparasjonen skjer på enheten din. Velg **Prøv et eksempel** for å se et lite nett med duplikate flater, flater uten areal og flater som vender feil vei. Sammenlign resultatene og velg **Last ned STL** for å lagre en ny fil med samme størrelse og koordinater. Filen lagres i ASCII-format hvis binær STL ville ha avrundet de opprinnelige koordinatene.

## Dette endres når nettet repareres

Verktøyet fjerner helt like trekanter og trekanter med areal på null. Det sammenligner orienteringen til naboflatene. Når det finnes to mulige konsistente orienteringer, velger det den som krever at færrest flater snus. Hjørnepunktene beholder plasseringen. Åpne kanter, tvetydig flateorientering og ikke-manifolde forbindelser kan kreve manuell reparasjon. Hull, nesten sammenfallende hjørnepunkter og skjæringer beholdes. [Vanlige nettproblemer ved 3D-utskrift](https://help.prusa3d.com/article/corrupted-3d-models-for-printing_2205)

## Sammenlign topologien før og etter

Sjekk antallet trekanter, duplikate flater og degenererte flater. Rapporten viser også gjenværende kanter med inkonsekvent flateorientering, åpne kanter og ikke-manifolde kanter og hjørnepunkter. Åpne den nedlastede filen i [STL-viseren](../stl-viewer/) for å se modellen i 3D. Bruk [Sjekk volum og topologi i 3D-nett](../mesh-inspector/) for å måle overflateareal eller innelukket volum. STL-rapporten viser **Reparer STL** hvis kontrollen finner duplikate eller degenererte flater eller inkonsekvent flateorientering.
