## Jak przekonwertować CB7 na PDF

Wybierz plik `.cb7` lub przeciągnij go do konwertera. Możesz też użyć archiwum `.7z` zawierającego obrazy stron komiksu. Każdy obraz stanie się osobną stroną PDF. Sprawdź podgląd, a następnie wybierz **Pobierz PDF**. Z pliku `volume-01.cb7` otrzymasz na przykład `volume-01.pdf`.

## Kolejność stron, jakość obrazów i wyszukiwanie napisów

Plik CB7 przechowuje strony komiksu w archiwum 7z. Konwerter sortuje strony według pełnych ścieżek, uwzględniając wartość liczb w nazwach folderów i plików. Dzięki temu `chapter2/page2.jpg` znajdzie się przed `chapter2/page10.jpg`. Pionowe strony i szerokie rozkładówki zachowują wymiary w pikselach i oryginalne proporcje. Obsługiwane formaty to JPEG, PNG, GIF, WebP i BMP, a także AVIF, jeśli przeglądarka potrafi go odczytać.

Napisy pozostają częścią rysunków. Aby wyszukiwać dialogi, otwórz gotowy PDF w narzędziu [OCR PDF](../pdf-ocr/) i wybierz język komiksu.

## Praca z dużym lub zabezpieczonym archiwum

Konwersja odbywa się na Twoim urządzeniu. W trakcie pracy konwerter pokazuje, którą stronę właśnie przetwarza. W dużych archiwach 7z z kompresją ciągłą (solid) kilka obrazów może być zapisanych w jednym skompresowanym bloku, dlatego ich odczyt może potrwać dłużej. Wybierz **Anuluj konwersję**, aby przerwać pracę i wybrać inny plik. Jeśli archiwum jest zabezpieczone hasłem lub podzielone na części, najpierw je rozpakuj i zapisz obrazy w jednym archiwum, które da się odczytać. Oryginał możesz przejrzeć w [czytniku komiksów CB7](../cb7-reader/), a do komiksu w archiwum ZIP użyj [konwertera CBZ na PDF](../cbz-to-pdf-converter/).
