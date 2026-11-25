## Jak oszacować koszt przechowywania w Filecoin Onchain Cloud

Podaj rozmiar danych, **Czas przechowywania (dni)** i liczbę w polu **Kopie**. Kalkulator szacuje koszt przechowywania nowego zbioru danych dla każdej kopii w usłudze Filecoin Warm Storage Service. Pokazuje miesięczny koszt przechowywania i dostarczania dowodów, wydatki za wybrany okres oraz opłaty za utworzenie zbiorów danych i dodanie fragmentów. Kwoty są podawane w USDFC. Miesiąc rozliczeniowy Filecoin ma 30 dni.

## Jak obliczany jest koszt przechowywania

Każdy aktywny zbiór danych podlega opłacie za przechowywanie zależnej od rozmiaru oraz stałej opłacie za dowód posiadania danych (Proof of Data Possession, PDP). Na przykład przy stawce za przechowywanie 2,50 USDFC za TiB i opłacie za dowód 0,12 USDFC za kopię przechowywanie jednego TiB w dwóch kopiach kosztuje około 5,24 USDFC co 30 dni. Oszacowanie opiera się na podanym rozmiarze danych. Filecoin ustala dokładny rozliczany rozmiar na podstawie węzłów liściowych zawierających dane, co może dodać do 31 bajtów na fragment.

## Jak zaplanować opłaty za przesłanie i rezerwę zwrotną

Otwórz **Szczegóły przesyłania**, aby podać liczbę fragmentów i partii przesyłania dla każdej kopii. Domyślnie jest to jeden fragment w jednej partii. Utworzenie zbioru danych dla każdej kopii wiąże się z osobną opłatą. Na koszt dodawania fragmentów składają się opłata podstawowa za partię i opłata za każdy fragment. Usługa zatrzymuje rezerwę na pokrycie kosztów kolejnych operacji. Rezerwa jest wyświetlana osobno od szacowanych wydatków, a niewykorzystane środki są zwalniane po rozliczeniu. To oszacowanie obejmuje przesłanie nowych danych i wybrany okres przechowywania. Pobieranie danych i późniejsze operacje mają odrębne opłaty.

## Skąd pochodzą stawki Filecoin

Strona oblicza koszty według stawek orientacyjnych z dnia podanego obok wyniku. Wybierz **Odśwież stawki sieci głównej**, aby odczytać stawki z kontraktu Warm Storage za pośrednictwem publicznego Filecoin RPC. Przeglądarka użyje otrzymanych stawek i pokaże blok, z którego pochodzą. Jeśli zapytanie się nie powiedzie, nadal możesz skorzystać ze stawek orientacyjnych.

Dokładny rozliczany rozmiar, wymagania dotyczące środków na koncie i pełny wykaz opłat znajdziesz w [przewodniku po kosztach przechowywania Filecoin](https://docs.filecoin.cloud/developer-guides/storage/storage-costs/).
