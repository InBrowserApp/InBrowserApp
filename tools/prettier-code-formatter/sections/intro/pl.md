## Czym Jest Formatowanie Kodu Prettier?

Formatowanie kodu Prettier uruchamia oficjalny samodzielny pipeline Prettier
bezpośrednio w przeglądarce, więc możesz normalizować pliki źródłowe bez
wysyłania kodu na serwer. Jest to przydatne, gdy potrzebujesz szybkiego
formatowania, chcesz porównać różne ustawienia szerokości wiersza albo
potrzebujesz czystego pliku, który można od razu skopiować lub pobrać.

## Obsługiwane Formaty

To odświeżenie skupia narzędzie na formatach, które Prettier już dobrze obsługuje w przeglądarce: JavaScript, JSX, TypeScript, TSX, Flow, warianty JSON, HTML, XML, CSS, PostCSS, SCSS, Less, Markdown, MDX, YAML, GraphQL oraz formatach szablonów takich jak Angular, Vue, Svelte, LWC, MJML i Handlebars. Lista języków steruje tym, który parser zostanie użyty, a import pliku automatycznie rozpoznaje parser, gdy rozszerzenie jest obsługiwane.

## Jak Działa To Odświeżenie

To odświeżenie trzyma ciężką logikę formatowania z dala od głównej ścieżki UI.
Żądania formatowania są budowane z czystej, lokalnej konfiguracji narzędzia, a
następnie wykonywane przez leniwy pipeline Prettier oparty na workerze, dzięki
czemu zwykłe pisanie pozostaje responsywne. Duże wejścia wstrzymują
automatyczne formatowanie i przełączają się na jawne działanie `Formatuj teraz`,
co jest bardziej przewidywalne niż próba ponownego formatowania bardzo dużego
pliku przy każdym naciśnięciu klawisza.
