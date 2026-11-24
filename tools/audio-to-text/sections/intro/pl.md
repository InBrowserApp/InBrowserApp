## Jak zamienić nagranie audio na tekst

Przeciągnij do narzędzia nagranie spotkania, wywiadu, wykładu, odcinka podcastu lub notatkę głosową. Zostaw automatyczne wykrywanie języka albo wskaż język nagrania, jeśli go znasz. Wybierz model Whisper i kliknij **Rozpocznij transkrypcję**. Gdy tekst będzie gotowy, kliknij znacznik czasu, aby odsłuchać dany fragment. Przed skopiowaniem lub pobraniem możesz poprawić nazwiska, interpunkcję i błędnie rozpoznane słowa.

Narzędzie odczytuje pliki, które potrafi zdekodować Twoja przeglądarka, w tym popularne formaty MP3, WAV, M4A, FLAC, OGG i WebM. Dostępność kodeków zależy od przeglądarki. Jeśli plik się nie otwiera, spróbuj zapisać nagranie jako WAV lub MP3 w aplikacji, w której powstało.

## Który model transkrypcji wybrać?

Do wyraźnej notatki głosowej lub wstępnej transkrypcji wybierz **Szybki (Whisper Base)**. Model **Zrównoważony (Whisper Small)** może lepiej radzić sobie z rozmowami i wypowiedziami z akcentem. Model **Najdokładniejszy (Whisper Large V3 Turbo)** najlepiej rozpoznaje mowę w trudnych nagraniach, ale wymaga pobrania większego pliku i więcej pamięci. Wszystkie trzy modele obsługują wiele języków i zapisują wypowiedzi w oryginalnym języku nagrania.

Whisper korzysta z WebGPU, gdy przeglądarka i sprzęt graficzny je obsługują. Narzędzie może też działać na procesorze dzięki WebAssembly. Wybrany model jest pobierany przy pierwszym uruchomieniu. Przeglądarka może potem ponownie użyć plików modelu zapisanych w pamięci podręcznej. Rozmiar pobieranych plików i czas przetwarzania zależą od modelu i urządzenia. Dekodowanie i transkrypcja odbywają się na Twoim urządzeniu. Podczas pobierania modelu nagranie nie jest wysyłane.

## Eksport transkrypcji ze znacznikami czasu lub napisów

- **TXT** zawiera czas rozpoczęcia każdego fragmentu. Przykładowy wpis `[00:02:15.320] Omówmy porządek spotkania.` wskazuje wypowiedź nieco ponad dwie minuty od początku nagrania. Przydaje się do notatek ze spotkań, cytatów z wywiadów i przeszukiwania tekstu.
- **SRT (SubRip)** zapisuje czas rozpoczęcia i zakończenia każdego numerowanego napisu. To popularny format obsługiwany przez edytory wideo.
- **VTT (WebVTT)** również zapisuje czasy rozpoczęcia i zakończenia każdego napisu. Działa z odtwarzaczami wideo HTML, które obsługują ścieżki napisów.

Whisper szacuje początek i koniec każdego fragmentu. Przed udostępnieniem odsłuchaj ważne cytaty i sprawdź synchronizację napisów. Szum w tle i nakładające się głosy mogą wpłynąć na wynik. Tekst jest podzielony na fragmenty według czasu.
