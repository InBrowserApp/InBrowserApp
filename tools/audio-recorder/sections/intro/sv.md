## Spela in ljud i webbläsaren offline

Använd ljudinspelaren för att fånga en snabb röstanteckning, testa mikrofonen, göra ett utkast till berättarröst eller ta ett ljudprov utan att lämna webbläsaren. Verktyget begär mikrofonåtkomst först när du startar en inspelning och låter dig sedan pausa, återuppta, stoppa, förhandsgranska och ladda ner resultatet.

## Praktiska användningsområden

Det är användbart för att kontrollera om en mikrofon fungerar, samla en talad påminnelse, spela in ett tillfälligt uttalsprov eller skapa ett kort klipp att bifoga till ett annat arbetsflöde. Eftersom inspelaren körs på klientsidan är den också ett smidigt alternativ när du inte vill installera en separat ljudapp på datorn för en enkel inspelning.

## Integritet och webbläsarformat

Inspelning sker via webbläsarens MediaRecorder API. Ljudet förblir lokalt på sidan medan du spelar in och förhandsgranskar det; InBrowser.App laddar inte upp mikrofonströmmen. Den slutliga filtypen beror på webbläsarstöd, så en webbläsare kan ladda ner WebM eller OGG medan en annan skapar M4A.

## Tips för rena inspelningar

Använd en tyst miljö, håll mikrofonens ingångsnivå rimlig och gör en kort testinspelning innan du spelar in något viktigt. Om sidan inte kan starta inspelning, kontrollera att webbplatsen är öppen över HTTPS eller localhost och att mikrofonbehörighet är tillåten för den aktuella webbläsarfliken.
