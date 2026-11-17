## O konwerterze napisów

Konwertuj istniejące pliki napisów między 19 formatami tekstowymi ze znacznikami czasu lub eksportuj transkrypcję jako zwykły tekst. Typowe zastosowania to zmiana SRT na VTT na potrzeby filmu w internecie, przekształcenie dialogów z ASS lub SSA w SRT, przygotowanie napisów dla platformy wideo i zebranie kilku przekonwertowanych odcinków w jednym archiwum ZIP. Konwersja odbywa się w przeglądarce; pliki napisów i wklejona treść nie są wysyłane na serwer.

Narzędzie przetwarza tekst napisów i informacje o czasie ich wyświetlania. Wybierz pliki lub wklej napisy, wybierz format wyjściowy i sprawdź wynik w podglądzie przed pobraniem. Możesz edytować wklejony tekst i ponownie go przekonwertować bez zmieniania oryginalnego pliku na urządzeniu.

## Jak konwertować napisy

1. Kliknij **Wybierz pliki**, aby otworzyć jeden lub kilka plików napisów, przeciągnij pliki na panel wejściowy lub wklej tekst napisów do edytora. **Wypróbuj przykład** wczytuje krótki przykład SRT z dwoma fragmentami napisów.
2. Przy zwykłym użyciu pozostaw opcję **Format wejściowy** ustawioną na **Wykryj automatycznie**. Wykrywanie sprawdza zawartość, zamiast polegać wyłącznie na nazwie pliku. Wybierz format źródłowy ręcznie, jeśli plik jest niejednoznaczny.
3. Wybierz **Format wyjściowy**. Dla typowej ścieżki napisów na stronie internetowej wybierz WebVTT; jeśli odtwarzacz lub edytor wymaga pliku SRT, wybierz SubRip.
4. Otwórz **Ustawienia konwersji**, gdy potrzebujesz innego kodowania pliku, liczby klatek na sekundę lub przesunięcia czasu. Zmień te ustawienia przed konwersją.
5. Kliknij **Konwertuj napisy**. Wynik zawiera format źródłowy i wyjściowy, nazwę pliku wyjściowego oraz liczbę przekonwertowanych fragmentów napisów.
6. Przełączaj się między widokami **Podgląd** i **Zawartość pliku**, a następnie skopiuj przekonwertowany tekst lub pobierz plik. Tabela pokazuje do 100 fragmentów napisów; zawartość pliku i pobierane pliki obejmują cały wynik.

**Wyczyść** usuwa bieżące dane wejściowe i wyniki ze strony. Wybranie nowej grupy plików zastępuje poprzedni wybór. Konwerter nie przechowuje historii napisów, więc pobierz wyniki, które chcesz zachować.

## Obsługiwane formaty i dokładność zapisu

Wszystkie poniższe formaty obsługują odczyt i zapis z wyjątkiem TXT, który służy do eksportowania czytelnych transkrypcji. Formaty zapisują czas w różny sposób; wybór formatu o mniejszej dokładności powoduje zaokrąglenie znaczników czasu do obsługiwanych przez niego jednostek.

| Format                               | Rozszerzenie | Sposób zapisu czasu                         |
| ------------------------------------ | ------------ | ------------------------------------------- |
| SubRip                               | `.srt`       | Milisekundy                                 |
| WebVTT                               | `.vtt`       | Milisekundy                                 |
| Advanced SubStation Alpha            | `.ass`       | Setne części sekundy                        |
| SubStation Alpha                     | `.ssa`       | Setne części sekundy                        |
| YouTube SubViewer                    | `.sbv`       | Milisekundy                                 |
| MicroDVD                             | `.sub`       | Klatki wideo                                |
| SubViewer 2.0                        | `.sub`       | Setne części sekundy                        |
| SAMI                                 | `.smi`       | Milisekundy                                 |
| LRC lyrics                           | `.lrc`       | Setne części sekundy dla czasów rozpoczęcia |
| Timed Text                           | `.ttml`      | Milisekundy                                 |
| Distribution Format Exchange Profile | `.dfxp`      | Milisekundy                                 |
| YouTube SRV3                         | `.srv3`      | Milisekundy                                 |
| YouTube transcript XML               | `.xml`       | Sekundy z dokładnością do milisekund        |
| MPL2                                 | `.mpl`       | Dziesiąte części sekundy                    |
| Spruce Subtitle, format tekstowy     | `.stl`       | Klatki wideo                                |
| QuickTime Text                       | `.qt.txt`    | Milisekundy                                 |
| JSON                                 | `.json`      | Liczby wyrażające milisekundy               |
| CSV                                  | `.csv`       | Liczby wyrażające milisekundy               |
| TSV                                  | `.tsv`       | Liczby wyrażające milisekundy               |
| Transkrypcja tekstowa, tylko eksport | `.txt`       | Bez znaczników czasu                        |

Jako dane wejściowe TTML można też wczytać zgodne pliki iTT. DFXP należy do rodziny TTML. Eksport TTML nie odtwarza wszystkich profili, układów ani reguł stylizacji specyficznych dla poszczególnych platform.

Rozszerzenie `.sub` może tu oznaczać tekstowy format MicroDVD lub SubViewer. Binarny VobSub to inny format. Podobnie obsługiwany format `.stl` to tekstowy Spruce STL, a nie binarny EBU STL. Jeśli te rozszerzenia są niejednoznaczne, wybierz format na podstawie pełnej nazwy.

## Wybór między SRT, VTT, ASS a zwykłym tekstem

**SRT** to przydatny wybór, gdy odtwarzacz wideo, edytor lub formularz przesyłania wymaga napisów SubRip. **VTT** jest formatem używanym przez ścieżki tekstowe wideo HTML i może też przechowywać ustawienia fragmentów napisów przeznaczone dla stron internetowych. Konwersja między nimi zachowuje tekst napisów i czas z dokładnością do milisekund, przebudowując składnię pliku.

Numerowany fragment SRT używa przecinka przed milisekundami:

```text
1
00:00:01,250 --> 00:00:03,500
Hello, world!
```

Ten sam fragment w WebVTT ma nagłówek pliku i znaczniki czasu z kropką dziesiętną:

```text
WEBVTT

00:00:01.250 --> 00:00:03.500
Hello, world!
```

**ASS i SSA** to przydatne formaty wymiany, gdy wymaga ich kolejna aplikacja. Obsługiwane pogrubienie, kursywa i podkreślenie mogą być przenoszone między formatami, które je obsługują. Czcionki, pozycjonowanie na ekranie, polecenia rysowania, animacje karaoke i inne zaawansowane funkcje prezentacji są upraszczane; zdarzenia graficzne ASS bez czytelnych dialogów są pomijane. Konwerter skupia się na czytelnych napisach, a nie na odtwarzaniu zaprojektowanej animacji czy układu.

**TXT** wyodrębnia czytelne dialogi bez znaczników czasu i stylizacji. Jego podgląd wyświetla eksportowany tekst zamiast tabeli z czasami. Eksport TXT nie tworzy czasów wyświetlania napisów, nie transkrybuje mowy ani nie tłumaczy wypowiedzi.

## Kodowanie pliku i czytelność tekstu

Automatyczne dekodowanie plików używa UTF-8 lub UTF-16, jeśli wskazuje na to znacznik kolejności bajtów. W przypadku starszych plików wybierz oryginalne kodowanie, jeśli znaki są nieprawidłowe lub pliku nie można zdekodować. Dostępne opcje obejmują Windows-1252, Windows-1251, GB18030, Big5, Shift_JIS i EUC-KR, a także jawnie wybrane UTF-8 i UTF-16.

Na przykład wypróbuj GB18030 dla chińskich napisów, o których wiesz, że zapisano je w tym kodowaniu, lub Shift_JIS dla japońskiego pliku ze starszej aplikacji. Kodowanie zmienia sposób odczytywania istniejących bajtów; nie tłumaczy ich znaczenia. Po wybraniu innego kodowania ponów konwersję. Pobierane pliki napisów używają UTF-8 niezależnie od kodowania wejściowego.

## Dostosowywanie czasu i liczby klatek na sekundę

### Wyświetlanie wszystkich napisów wcześniej lub później

Przesunięcie czasu jest mierzone w milisekundach. Wartość `1500` opóźnia każdy fragment napisów o 1,5 sekundy; `-500` wyświetla napisy o pół sekundy wcześniej. Dla fragmentu rozpoczynającego się w `00:00:01.250` te ustawienia dają odpowiednio `00:00:02.750` i `00:00:00.750`.

Przesunięcie zmienia zarówno początek, jak i koniec, zachowując czas trwania aż do osiągnięcia początku osi czasu. Fragmenty przesunięte w całości przed zero są usuwane; fragment, który tylko częściowo wykracza przed zero, zaczyna się od zera. Przesunięcie koryguje stałe opóźnienie. Nie koryguje ścieżki napisów, której rozbieżność czasowa zmienia się w trakcie filmu.

### Liczba klatek na sekundę dla znaczników czasu opartych na klatkach

MicroDVD i Spruce STL używają klatek wideo, więc ich liczba klatek na sekundę określa sposób przeliczania klatek na upływający czas. TTML również może zawierać znaczniki czasu oparte na klatkach. Użyj liczby klatek na sekundę filmu źródłowego, np. `23.976`, `24`, `25` lub `29.97`, gdy jest potrzebna do interpretacji danych wejściowych.

Liczba klatek na sekundę zapisana w danych wejściowych ma pierwszeństwo, jeśli format ją podaje. Dla formatu wyjściowego opartego na klatkach wybrane ustawienie określa liczbę klatek na sekundę używaną przy zapisie. Zmiana tego ustawienia nie przelicza zwykłych znaczników czasu w formacie zegarowym w SRT ani VTT; zmienia sposób interpretacji lub zapisywania znaczników opartych na klatkach.

### Zaokrąglanie i brakujące czasy zakończenia

SRT i VTT zachowują dokładność do milisekund. ASS, SSA, SubViewer i LRC zaokrąglają do setnych części sekundy; MPL2 do dziesiątych; formaty oparte na klatkach — do klatek. Bardzo krótki fragment napisów zachowuje dodatni czas trwania po zaokrągleniu. Podgląd odzwierciedla czasy z eksportowanego formatu, zamiast pokazywać niezaokrąglone wejściowe znaczniki czasu.

LRC może podawać czasy rozpoczęcia bez czasów zakończenia. Brakujący koniec jest ustalany na następny różniący się czas rozpoczęcia, a dla ostatniego fragmentu przyjmowany jest czas trwania dwóch sekund. Eksport LRC nie może zachować oryginalnych przerw ani nakładających się czasów zakończenia, a wielowierszowe fragmenty napisów stają się pojedynczymi wierszami tekstu piosenki. QuickTime Text używa znaczników na osi czasu; SAMI i QuickTime mogą przebudowywać nakładające się napisy jako połączony tekst w każdym punkcie zmiany czasu, więc wynik może zawierać inną liczbę fragmentów napisów.

## Konwersja wielu plików i pobieranie ZIP

Wybierz lub upuść kilka plików, aby przekonwertować je z tym samym formatem wyjściowym i ustawieniami. Wybierz wynik z menu nazw plików, aby go sprawdzić. Pliki, których nie można przekonwertować, mają własne komunikaty błędów, a pomyślne wyniki pozostają dostępne do osobnego pobrania.

Gdy co najmniej dwa pliki zostaną pomyślnie przekonwertowane, **Pobierz wszystko jako ZIP** zbiera te pliki wyjściowe. Archiwum zawiera wyłącznie udane konwersje. Sprawdź widoczne błędy, w razie potrzeby dostosuj format wejściowy lub kodowanie i ponów konwersję pozostałych plików.

Nazwy plików wyjściowych zachowują nazwę bazową źródła i używają wybranego rozszerzenia: na przykład `episode01.srt` zmienia się w `episode01.vtt`. Jeśli kilka wyników miałoby tę samą nazwę, przyrostek taki jak ` (2)` rozróżnia ich wpisy w archiwum ZIP. ZIP jest tu opcją pobierania; jako dane wejściowe wybierz same pliki napisów.

## Wymiana danych przez JSON, CSV i TSV

JSON używa tablicy obiektów napisów z wartościami `start` i `end` w milisekundach oraz ciągiem znaków `text`:

```json
[
  { "start": 1250, "end": 3500, "text": "Hello, world!" },
  { "start": 4000, "end": 6000, "text": "Another caption." }
]
```

Odczyt obsługuje również JSON w stylu Whisper, zawierający tablicę `segments`, w której wartości `start` i `end` segmentów są podawane w sekundach. To osobna konwencja wejściowa; zwykły eksport JSON nadal używa milisekund.

CSV i TSV używają nazw kolumn `start`, `end` i `text`. Czasy wejściowe mogą być liczbami wyrażającymi milisekundy lub znacznikami czasu w formacie zegarowym. CSV ujmuje w cudzysłowy pola zawierające przecinki, cudzysłowy lub podziały wiersza; TSV używa tabulatorów między kolumnami. Oba formaty eksportują czas jako liczby wyrażające milisekundy. Używaj tych formatów przy przenoszeniu napisów do arkusza kalkulacyjnego lub innego procesu przetwarzania napisów.

## Częste pytania

### Dlaczego podgląd i pobrany tekst wyglądają inaczej?

Tabela podglądu pokazuje czytelny tekst napisów i czasy z formatu docelowego. Zawartość pliku pokazuje rzeczywisty zapis pliku, w tym nagłówki, numerację, separatory i obsługiwaną składnię formatowania. Pobierane pliki zawierają całą tę zawartość, nawet gdy tabela kończy się na pierwszych 100 fragmentach napisów.

### Dlaczego zmieniła się stylizacja lub pozycjonowanie?

Formaty nie mają wspólnego modelu stylizacji. Obsługiwane podstawowe formatowanie jest zachowywane tam, gdzie można je zapisać; zaawansowane style, pozycjonowanie napisów dla stron internetowych, animacje i metadane platform nie są odtwarzane w całości. Użyj widoku zawartości pliku, aby sprawdzić eksport, i przetestuj go w odtwarzaczu lub edytorze, w którym zamierzasz go użyć.

### Czy można wyodrębnić napisy z filmu lub ścieżki obrazkowej?

Zacznij od istniejącego pliku napisów tekstowych. Najpierw wyodrębnij osadzone ścieżki napisów z filmu. Ścieżki obrazkowe PGS/SUP i VobSub/IDX wymagają OCR, aby przekształcić je w tekst; binarny EBU STL wymaga edytora napisów, który potrafi odczytać ten format.

### Gdzie można sprawdzić specyfikacje formatów?

Zobacz [specyfikację WebVTT](https://www.w3.org/TR/webvtt1/), [specyfikację TTML](https://www.w3.org/TR/ttml2/) i [formaty napisów obsługiwane przez YouTube](https://support.google.com/youtube/answer/2734698), aby poznać składnię plików i wymagania platform.
