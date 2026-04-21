## Wat is een User-Agent?

Een User-Agent (UA)-string identificeert de browser of app die een verzoek doet en bevat meestal browser-, OS-, apparaat- en enginegegevens. Omdat UA-strings te vervalsen zijn, gebruik ze als hint en niet als beveiligingssignaal.

### Wat deze parser laat zien

Deze tool analyseert de geplakte UA-string lokaal in je browser en groepeert het resultaat per browser, besturingssysteem, engine, apparaat, CPU en JSON-uitvoer. Er wordt niets geüpload.

### Voorbeeld

Plak bijvoorbeeld een gebruikelijke Chrome-op-Windows-string zoals deze:

```text
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36
```

Het resultaat zou Chrome 115 op Windows 10 moeten herkennen, samen met de Blink-engine en de amd64-CPU-architectuur.

### Belangrijke opmerking

Moderne browsers vertrouwen steeds meer op Client Hints, waardoor een gekopieerde UA-string niet altijd alles laat zien wat een website tijdens een echte aanvraag kan zien.
