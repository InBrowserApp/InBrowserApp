## Co pokazuje ta przeglądarka

Przeglądarka informacji o multimediach odczytuje metadane techniczne lokalnych plików
audio i wideo, w tym MP4, MOV, MKV, WebM, AVI, MP3, FLAC i WAV. Pozwala sprawdzić
parametry wyeksportowanego pliku, oznaczenia języka ścieżek audio w filmie lub zebrać
raport techniczny do rozwiązywania problemów. Analiza rozpoczyna się po wybraniu
lub upuszczeniu pliku.

## Szczegóły pliku oraz ścieżek wideo, audio i napisów

- **Podsumowanie pliku:** rzeczywisty format kontenera, rozmiar pliku, czas trwania,
  całkowita przepływność, tytuł i aplikacja użyta do kodowania, jeśli są dostępne.
- **Ścieżki wideo:** kodek, profil i przepływność, rozdzielczość, liczba klatek na
  sekundę i jej tryb, proporcje obrazu, obrót, głębia bitowa, przestrzeń barw,
  podpróbkowanie chrominancji i format HDR.
- **Ścieżki audio:** kodek, przepływność, język, tytuł ścieżki, liczba i układ kanałów,
  częstotliwość próbkowania, głębia bitowa oraz flagi ścieżki domyślnej lub wymuszonej.
  Każda ścieżka audio jest wyświetlana osobno, dzięki czemu można rozróżnić oryginalny
  dźwięk, dubbing i komentarz.
- **Ścieżki napisów:** format, język, tytuł, czas trwania oraz flagi ścieżki domyślnej
  lub wymuszonej, jeśli plik zawiera te informacje.

Podstawowe parametry są widoczne od razu. Otwórz **Szczegóły techniczne** danej
ścieżki, aby zobaczyć dodatkowe pola, lub wybierz odnośnik z liczbą ścieżek, aby
przejść do pierwszej ścieżki danego typu. Dostępne pola zależą od formatu i jego
metadanych.

## Jak sprawdzić plik

1. Wybierz jeden lokalny plik audio lub wideo albo przeciągnij go do obszaru pliku.
2. Sprawdź podsumowanie, a następnie poszczególne ścieżki wideo, audio i napisów.
3. Skopiuj czytelny raport do wiadomości lub zgłoszenia do pomocy technicznej albo
   pobierz JSON do ewidencji zasobów, skryptu lub dalszej analizy. Oba warianty
   zawierają pola techniczne ukryte w zwiniętych sekcjach interfejsu.
4. Wybierz **Zmień plik**, aby sprawdzić inny plik, lub **Usuń plik**, aby wyczyścić
   wyniki. Wybranie innego pliku lub usunięcie bieżącego zatrzymuje również analizę,
   która jeszcze trwa.

## Jak rozumieć wartości

- **Kontener i kodek opisują różne rzeczy.** MP4 i Matroska to kontenery;
  AVC/H.264, HEVC/H.265 i AAC określają sposób kodowania strumieni. Jeden kontener
  może zawierać kilka ścieżek audio lub napisów.
- **Całkowita przepływność dotyczy całego pliku.** Obejmuje wszystkie strumienie
  i narzut kontenera. Przepływność ścieżki dotyczy tylko danego strumienia.
  Przepływność jest wyrażana w kb/s lub Mb/s, a rozmiary plików w B, KiB, MiB,
  GiB lub TiB.
- **Czas trwania uwzględnia milisekundy.** Jest wyświetlany w formacie
  `HH:MM:SS.mmm`. Liczba klatek na sekundę jest podawana w fps, a częstotliwość
  próbkowania audio w kHz. CFR oznacza stałą liczbę klatek na sekundę, a VFR — zmienną.
- **Flagi ścieżek określają zamierzony sposób ich wyboru.** Flaga domyślna oznacza
  preferowaną ścieżkę, a flaga wymuszona jest zwykle używana dla napisów, które mają
  się pojawiać bez wybierania pełnej ścieżki napisów. Są to odrębne flagi odczytane
  z pliku.

Niektóre kontenery nie podają osobnej przepływności dla każdego strumienia.
Niedostępne wartości są pomijane lub oznaczane jako brak danych; nie są zgadywane
na podstawie nazwy pliku. Osadzona grafika okładki nie jest liczona jako ścieżka wideo.

## Typowe zastosowania

Sprawdź rozdzielczość i liczbę klatek na sekundę po wyeksportowaniu wideo, kanały
i częstotliwość próbkowania przed edycją audio, rozpoznaj wiele ścieżek językowych
lub komentarzy albo zbierz informacje o kodekach podczas diagnozowania problemu
z odtwarzaniem. Raport pozwala udostępnić istotne parametry bez wysyłania pliku
multimedialnego.

## Lokalne przetwarzanie i eksport raportów

Analiza odbywa się w przeglądarce: plik multimedialny nie jest przesyłany, a jego
zawartość nie jest zmieniana. Analizator odczytuje fragmenty pliku w miarę potrzeb,
dzięki czemu może sprawdzać metadane nawet wtedy, gdy przeglądarka nie potrafi
odtworzyć danego kontenera lub kodeka.

**Kopiuj raport** tworzy czytelne podsumowanie tekstowe. **Pobierz JSON** eksportuje
metadane zwrócone przez analizator wraz z nazwą i rozmiarem pliku. W JSON
`Duration` jest wyrażone w sekundach, `BitRate` i `OverallBitRate` w bitach na sekundę,
a `SamplingRate` w hercach. Interfejs przelicza te wartości na bardziej czytelne
jednostki. Eksport zachowuje również dodatkowe pola metadanych poza tymi
wyświetlanymi na kartach ścieżek.
