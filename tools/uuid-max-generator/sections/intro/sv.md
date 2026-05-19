## Vad Är en Max UUID?

En max-UUID är den standardiserade UUID vars 128 bitar alla är satta till ett. Dess kanoniska textform är `ffffffff-ffff-ffff-ffff-ffffffffffff`, och den används ofta för att betyda det högsta möjliga UUID-värdet.

## När den ska användas

Använd en max-UUID när ett API, en databasfråga, en testfixture eller en intervallkontroll behöver en UUID-formad övre gräns eller ett sentinelvärde. Den är användbar i tester, migreringsskript, pagineringsmarkörer och protokoll som definierar ett uttryckligt maximalt UUID-värde.

## Vad du bör se upp med

Behandla inte max-UUID:n som en genererad unik identifierare. Den är samma värde varje gång, så om den lagras där ett verkligt objekt-ID förväntas kan den dölja sentinellogik, bryta antaganden om unikhet eller göra att poster oväntat sorteras sist.
