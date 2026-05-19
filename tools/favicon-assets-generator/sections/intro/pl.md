## Co generuje to narzędzie

Ten generator przekształca pojedynczy obraz w kompletny, nowoczesny pakiet
favikon — wieloformatowy plik `.ico` dla starszych przeglądarek, warianty PNG
w rozmiarach 16 / 32 / 180 / 192 / 512, opcjonalny oryginalny plik `.svg`,
`site.webmanifest` dla aplikacji PWA oraz fragment HTML, który wklejasz do
sekcji `<head>`. Każdy bajt jest tworzony w Twojej przeglądarce; bez
wysyłania, bez serwera, bez analityki.

## Co znajduje się w pakiecie

- `favicon.ico` — wieloobrazowy (16 / 32 / 48) dla kart przeglądarki,
  zakładek i starych skrótów Windows.
- `favicon-16x16.png` oraz `favicon-32x32.png` — nowoczesne warianty PNG
  używane przez bieżące przeglądarki.
- `favicon.svg` — dołączany tylko wtedy, gdy obraz źródłowy jest w formacie
  SVG i włączony jest przełącznik „Użyj oryginalnego SVG".
- `apple-touch-icon.png` — 180×180, nieprzezroczysty, używany przez ekrany
  startowe iOS.
- `pwa-192x192.png` oraz `pwa-512x512.png` — standardowe ikony PWA.
- `pwa-maskable-192x192.png` oraz `pwa-maskable-512x512.png` — warianty
  maskowalne z bezpiecznym obszarem zalecanym przez W3C.
- `site.webmanifest` — manifest PWA powiązany z powyższymi ikonami.

## Jak działają marginesy, tło oraz strefy bezpieczne dla ikon maskowalnych

Każda platforma ma własny margines („Margin"), więc możesz pozostawić
przestrzeń wewnątrz kanwy ikony. Przełącznik „Dodaj tło" maluje
nieprzezroczysty kwadrat za źródłem — przydatne, gdy źródło jest
przezroczyste, a miejsce docelowe wymaga nieprzezroczystości (ekran startowy
Apple) lub po prostu dla wizualnego kontrastu w karcie przeglądarki.
Maskowalne ikony PWA wykorzystują dodatkową strefę bezpieczną poza
marginesem platformy: wszystko poza centralnymi ~80% może zostać przycięte
przez Androida, Windows lub ChromeOS, gdy zastosują maskę okrągłą,
zaokrągloną lub w kształcie squircle.

## Podłączenie pakietu do Twojej witryny

1. Rozpakuj pobrane archiwum do katalogu głównego serwera (aby pliki
   znajdowały się pod ścieżkami `/favicon.ico`, `/site.webmanifest` itd.).
2. Wklej fragment HTML do sekcji `<head>` Twojej witryny.
3. Jeśli udostępniasz zasoby z podścieżki (na przykład `/static/icons/`),
   ustaw „Ścieżka zasobów" przed generowaniem, aby fragment i manifest
   używały właściwych adresów URL.
4. Jeśli dostosowałeś manifest poza zakresem oferowanym przez to narzędzie
   (na przykład aby dodać `categories` lub `screenshots`), otwórz
   `site.webmanifest` w edytorze tekstu i edytuj go bezpośrednio — to
   zwykły JSON.
