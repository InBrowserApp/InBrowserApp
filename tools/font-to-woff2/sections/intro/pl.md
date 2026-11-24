## Jak przekonwertować font TTF lub OTF do WOFF2

Wybierz co najmniej jeden plik fontu TrueType (`.ttf`) lub OpenType (`.otf) albo przeciągnij pliki do konwertera. Konwersja rozpocznie się od razu po ich dodaniu. Gdy font będzie gotowy, porównaj rozmiar oryginału z rozmiarem pliku WOFF2 i wybierz **Pobierz WOFF2**. Na przykład z pliku `Inter-Regular.ttf`powstanie`Inter-Regular.woff2`. Fonty są przetwarzane w przeglądarce, więc pliki pozostają na Twoim urządzeniu.

## Dlaczego warto używać formatu WOFF2 na stronach internetowych?

WOFF2 (Web Open Font Format 2) kompresuje dane fontu za pomocą Brotli. Przy pobieraniu pliku WOFF2 zwykle przesyła się mniej danych niż przy pobieraniu oryginalnego pliku TTF lub OTF. Oszczędność zależy od fontu. Konwersja zachowuje wszystkie glify i osie fontów zmiennych, więc jeden plik nadal wystarcza do wyświetlania tekstu w całym obsługiwanym zakresie grubości. Jeśli witryna potrzebuje tylko określonego zestawu znaków, [generator podzbiorów fontów](../font-subset-generator/) pozwoli jeszcze bardziej zmniejszyć plik.

## Jak używać pliku WOFF2 w CSS

Umieść pobrany plik w folderze z fontami w swojej witrynie i odwołaj się do niego za pomocą `@font-face`. Dopasuj ścieżkę, grubość i styl do udostępnianego pliku. Przykład ładuje font o normalnej grubości z katalogu `/fonts/` i wyświetla tekst fontem zastępczym do czasu wczytania.

```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/Inter-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

body {
  font-family: "Inter", sans-serif;
}
```

W przypadku fontu zmiennego podaj zakres grubości obsługiwany przez plik, na przykład `font-weight: 100 900;`. Zanim umieścisz font w witrynie, sprawdź jego licencję i przetestuj języki oraz grubości używane na stronach. Zobacz [dokumentację @font-face w MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40font-face).
