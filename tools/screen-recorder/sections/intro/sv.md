# Skärminspelare

Spela in en skärm, ett fönster eller en flik som du väljer i webbläsaren utan
att ladda upp videon till en server. Verktyget använder webbläsarens Screen
Capture- och MediaRecorder-API:er, så inspelningen stannar lokalt tills du
laddar ner den.

## När du ska använda den

Använd inspelaren för korta demonstrationer, felrapporter, genomgångar,
QA-anteckningar eller snabba interna videor där ett lättviktigt arbetsflöde i
webbläsaren räcker. Du kan be webbläsaren att ta med flik- eller systemljud och
valfritt blanda in mikrofonen innan inspelningen startar.

## Integritet och webbläsarstöd

Webbläsaren avgör vilka inspelningskällor och ljudalternativ som är
tillgängliga. Vissa webbläsare delar bara ljud från den aktuella fliken, vissa
kräver HTTPS och vissa stöder inte pausning eller inspelning alls. Om
behörigheten nekas sparas ingen ström, och du kan försöka igen med andra
inställningar.

## Tips för tillförlitliga inspelningar

Stäng orelaterade inspelningssessioner innan du börjar, välj den minsta
användbara källan och gör ett kort test när ljudet är viktigt. Ladda ner
resultatet innan du rensar det, eftersom inspelningar bara finns kvar i den
aktuella sidsessionen.
