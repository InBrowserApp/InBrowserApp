Link magnet wskazuje torrent BitTorrent za pomocą jego skrótu (info hash). Może również zawierać nazwę wyświetlaną, adresy trackerów i web seedów lub adres źródła metadanych. Do wyświetlenia nazw i rozmiarów plików klient potrzebuje metadanych torrenta.

## Jak sprawdzić link magnet

Wklej link zaczynający się od `magnet:?` i wybierz „Wyszukaj metadane”. Narzędzie wyświetli info hash oraz nazwę i adresy trackerów, jeśli podano je w linku. Gdy WebTorrent pobierze metadane, zobaczysz nazwę torrenta, ścieżki i rozmiary plików, łączny rozmiar oraz informacje o częściach. Możesz filtrować listę plików i skopiować info hash.

## Dlaczego niektóre linki magnet nie zwracają metadanych

W przeglądarce WebTorrent potrzebuje dostępnych węzłów obsługujących WebRTC. Zwykle odnajduje je za pomocą trackera korzystającego z WebSocket. Niektóre linki magnet wskazują także źródło metadanych HTTPS dostępne dla przeglądarki. Nawet jeśli link działa w programie BitTorrent na komputerze, wyszukiwanie w przeglądarce może przekroczyć limit czasu. Jeśli masz plik `.torrent`, możesz od razu odczytać go w przeglądarce plików torrent.

## Z czym łączy się przeglądarka podczas wyszukiwania

Wyszukiwanie odbywa się w Twojej przeglądarce. WebTorrent może nawiązywać połączenia z trackerami, uczestnikami wymiany lub źródłem metadanych wybranego torrenta. Adres IP i identyfikator torrenta mogą być widoczne dla tych usług. Narzędzie pobiera wyłącznie metadane, bez pobierania plików z listy. Link magnet musi zawierać info hash BitTorrent v1 (`btih`). Może też zawierać identyfikator wersji v2.
