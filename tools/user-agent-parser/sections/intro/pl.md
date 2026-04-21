## Czym jest User-Agent?

Ciąg User-Agent (UA) identyfikuje przeglądarkę lub aplikację wykonującą żądanie i zwykle zawiera informacje o przeglądarce, systemie, urządzeniu i silniku. Ponieważ można go sfałszować, traktuj go jako wskazówkę, a nie sygnał bezpieczeństwa.

### Co pokazuje ten parser

To narzędzie lokalnie analizuje w przeglądarce wklejony ciąg UA i grupuje wynik według przeglądarki, systemu operacyjnego, silnika, urządzenia, CPU i wyjścia JSON. Nic nie jest wysyłane.

### Przykład

Wklej przykładowo taki typowy ciąg Chrome w Windows:

```text
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36
```

Wynik powinien rozpoznać Chrome 115 w systemie Windows 10, silnik Blink oraz architekturę CPU amd64.

### Ważna uwaga

Współczesne przeglądarki coraz częściej polegają na Client Hints, więc skopiowany ciąg UA może nie pokazywać wszystkiego, co witryna widzi podczas prawdziwego żądania.
