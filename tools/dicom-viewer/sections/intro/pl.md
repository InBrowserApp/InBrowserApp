## Jak otwierać pliki DICOM

Wybierz **Otwórz pliki DICOM** lub przeciągnij jeden albo kilka plików do przeglądarki. Wybierz wszystkie obrazy z serii tomografii komputerowej (TK) lub rezonansu magnetycznego (MRI), aby przejrzeć kolejne przekroje. Jeśli pliki pochodzą z kilku serii, przełączaj się między nimi na liście **Seria**. Pliki mogą mieć rozszerzenie `.dcm` lub `.dicom`, ale można też otwierać pliki bez rozszerzenia.

Przewijaj kółkiem myszy nad obrazem lub skorzystaj z suwaka albo przycisków. Możesz też ustawić fokus na obrazie i naciskać klawisze strzałek w górę i w dół. Wybierz **Wypróbuj przykład**, aby przejrzeć syntetyczną serię TK przed otwarciem własnych plików.

## Jak ustawić szerokość i poziom okna

Szerokość okna określa zakres wartości odwzorowywanych w odcieniach szarości. Zwężenie okna zwiększa kontrast w tym zakresie. Poziom okna, zwany też środkiem okna, przesuwa zakres w stronę jaśniejszych lub ciemniejszych wartości. Wpisz odpowiednie wartości w sekcji **Ustawienia okna** lub przeciągnij po obrazie w poziomie, aby zmienić szerokość, i w pionie, aby zmienić poziom. Wybierz **Zresetuj**, aby przywrócić ustawienia początkowe bieżącego przekroju.

## Jak sprawdzić metadane DICOM

Otwórz sekcję **Metadane**, aby sprawdzić tagi bieżącego pliku, np. rodzaj badania, opis serii i wymiary obrazu, jeśli są zapisane w pliku. Szukaj według numeru tagu, nazwy atrybutu lub wartości. W plikach wieloklatkowych tabela pokazuje atrybuty wspólne dla klatek. Metadane mogą zawierać dane umożliwiające identyfikację. Pliki i ich tagi są przetwarzane na tym urządzeniu bez przesyłania na serwer.

## Obsługiwane obrazy DICOM

Przeglądarka otwiera obrazy DICOM w skali szarości, których dane pikseli zapisano bez kompresji lub skompresowano metodą JPEG Lossless. Obsługuje również pliki wieloklatkowe. DICOM jest formatem kontenerowym, więc możliwość wyświetlenia obrazu zależy od kodowania danych pikseli. Jeśli użyto innego kodowania, np. JPEG 2000, wyeksportuj obraz z programu źródłowego jako DICOM bez kompresji. To narzędzie służy do przeglądania plików i obrazów. Do diagnostyki używaj klinicznej stacji roboczej.
