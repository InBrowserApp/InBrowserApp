## Jak zamienić nagranie audio na tekst

Przeciągnij do narzędzia nagranie spotkania, wywiadu, wykładu, odcinka podcastu lub notatkę głosową. Zostaw automatyczne wykrywanie języka albo wskaż język nagrania, jeśli go znasz. Wybierz model transkrypcji i kliknij **Rozpocznij transkrypcję**. Gdy tekst będzie gotowy, kliknij znacznik czasu, aby odsłuchać dany fragment. Przed skopiowaniem lub pobraniem możesz poprawić nazwiska, interpunkcję i błędnie rozpoznane słowa.

Narzędzie odczytuje pliki, które potrafi zdekodować Twoja przeglądarka, w tym popularne formaty MP3, WAV, M4A, FLAC, OGG i WebM. Dostępność kodeków zależy od przeglądarki. Jeśli plik się nie otwiera, spróbuj zapisać nagranie jako WAV lub MP3 w aplikacji, w której powstało.

## Który model transkrypcji wybrać?

Użyj **Whisper Base** do wyraźnych nagrań lub wstępnej transkrypcji. **Whisper Small** może pomóc w przypadku rozmów i akcentów. **Whisper Large V3 Turbo** nadaje się do nagrań z szumem lub trudną do zrozumienia mową, ale wymaga pobrania większego pliku i więcej pamięci. Modele Whisper transkrybują wiele języków w języku oryginału. **SenseVoiceSmall** obsługuje język mandaryński, kantoński, angielski, japoński i koreański. **Qwen3-ASR 0.6B** oferuje sam tekst lub dopasowanie czasu do odtwarzania i napisów; dopasowanie wymaga pobrania dodatkowego modelu. Sam tekst można wyeksportować jako TXT. Qwen używa WebGPU do rozpoznawania, gdy jest dostępne, a w przeciwnym razie procesora; dopasowanie czasu działa na procesorze.

Whisper korzysta z WebGPU, gdy przeglądarka i sprzęt graficzny je obsługują. Wybrany model jest pobierany przy pierwszym uruchomieniu. Przeglądarka może potem ponownie użyć plików modelu zapisanych w pamięci podręcznej. Rozmiar pobieranych plików i czas przetwarzania zależą od modelu i urządzenia. Dekodowanie i transkrypcja odbywają się na Twoim urządzeniu. Podczas pobierania modelu nagranie nie jest wysyłane. SenseVoiceSmall działa lokalnie na procesorze przez WebAssembly. Gdy WebGPU jest niedostępne, Whisper przełącza się na procesor przez WebAssembly.

## Eksport transkrypcji ze znacznikami czasu lub napisów

- **TXT** zawiera czas rozpoczęcia każdego fragmentu. Przykładowy wpis `[00:02:15.320] Omówmy porządek spotkania.` wskazuje wypowiedź nieco ponad dwie minuty od początku nagrania. Przydaje się do notatek ze spotkań, cytatów z wywiadów i przeszukiwania tekstu.
- **SRT (SubRip)** zapisuje czas rozpoczęcia i zakończenia każdego numerowanego napisu. To popularny format obsługiwany przez edytory wideo.
- **VTT (WebVTT)** również zapisuje czasy rozpoczęcia i zakończenia każdego napisu. Działa z odtwarzaczami wideo HTML, które obsługują ścieżki napisów.

Narzędzie szacuje początek i koniec każdego fragmentu. Przed udostępnieniem odsłuchaj ważne cytaty i sprawdź synchronizację napisów. Szum w tle i nakładające się głosy mogą wpłynąć na wynik. Tekst jest podzielony na fragmenty według czasu.
