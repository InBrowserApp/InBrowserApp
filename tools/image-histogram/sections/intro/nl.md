## Het histogram van een afbeelding bekijken

Kies een foto, schermafbeelding of illustratie, of sleep het bestand naar de pagina. Het histogram verschijnt naast de afbeelding. Je kunt ook de voorbeeldfoto proberen. Begin met **Helderheid** om de verdeling van de tonen in het hele beeld te zien. Schakel daarna over naar **RGB** om rood, groen en blauw op dezelfde schaal te vergelijken. Kies één kanaal om het in detail te bekijken.

## Schaduwen, middentonen en hooglichten aflezen

De horizontale as loopt van 0 (donkerst) tot 255 (lichtst). Links staan de schaduwen, in het midden de middentonen en rechts de hooglichten. Hoe hoger de staaf, hoe meer pixels dat niveau hebben. Beweeg de muis over de grafiek, tik erop of bedien de niveauschuifregelaar met de pijltjestoetsen om het exacte aantal pixels af te lezen.

Een piek aan een uiteinde kan wijzen op dichtgelopen schaduwen of uitgebeten hooglichten. Daar kan detail verloren gaan. Een piek bij 255 in het rode kanaal kan bijvoorbeeld op clipping in dat kanaal wijzen, ook als het helderheidshistogram rechts nog ruimte heeft. Een zuiver witte achtergrond kan ook voor zo'n piek zorgen. Bekijk de voorbeeldweergave om de piek te duiden. **Schaduwen** en **Hooglichten** geven het percentage geanalyseerde pixels aan dat precies niveau 0 respectievelijk 255 heeft.

## Wanneer een logaritmische schaal handig is

Bij **Lineair** is de hoogte van een staaf recht evenredig met het aantal pixels. Probeer **Logaritmisch** als een groot vlak met één kleur de rest van het histogram moeilijk zichtbaar maakt. Beide schalen gebruiken dezelfde pixelaantallen om de hoogtes van de staven te berekenen.

## Wat de viewer meet

De viewer telt de pixels in de 8-bits afbeelding die de browser rendert, op de oorspronkelijke afmetingen. De helderheid is een gewogen combinatie van rood, groen en blauw, waarbij groen het zwaarst meetelt. Volledig transparante pixels worden overgeslagen. Elke gedeeltelijk transparante pixel telt één keer mee. Bij het renderen kunnen de RGB-waarden van die pixel worden afgerond. Van een geanimeerde afbeelding wordt één stilstaand frame geanalyseerd. Je apparaat verwerkt de afbeeldingen lokaal.
