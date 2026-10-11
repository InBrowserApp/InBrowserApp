## Eksportuj zapisany notatnik Jupyter

Otwórz notatnik IPYNB i wybierz HTML, Markdown lub kod. HTML i Markdown zachowują komórki w zapisanej kolejności wraz z obsługiwanymi zapisanymi danymi wyjściowymi. Wszystko pozostaje w przeglądarce. Jądro, kod ani środowisko widżetów nie są uruchamiane.

## Wybierz przydatny format wyjściowy

HTML to samodzielna kopia do czytania z tekstem możliwym do zaznaczenia, obsługiwanymi dołączonymi obrazami i czytelnymi tabelami. Markdown udostępnia treść dokumentu do ponownego wykorzystania; tabele mogą zawierać bezpieczny HTML, a obrazy korzystają z osadzonych adresów URL danych, których niektóre aplikacje Markdown nie wyświetlają. Oryginalny układ i formatowanie mogą się zmienić.

Eksport kodu zachowuje kolejność komórek kodu i pomija Markdown, komórki surowego tekstu oraz zapisane dane wyjściowe. Rozpoznany język notatnika określa rozszerzenie skryptu; dla nieznanych języków używany jest TXT. Polecenia magiczne notatnika i składnia powłoki pozostają bez zmian, więc wyeksportowany kod może wymagać ręcznego dostosowania lub oryginalnego jądra notatnika. Notatnik bez komórek kodu daje pusty plik z kodem.

## Zapisane wyniki i zgodność

Konwerter odczytuje format notatnika 4. Wyniki pochodzą z zapisanego pliku i mogą być nieaktualne. Nieobsługiwana rozbudowana treść i niedostępne obrazy są oznaczane. Zasoby zdalne nie są pobierane; skrypty, widżety, dźwięk i wideo nie są uruchamiane. LaTeX pozostaje tekstem źródłowym, a komórki surowego tekstu i nieznanych typów pojawiają się jako czytelny tekst w eksportowanych dokumentach.

Praktyczne ograniczenia zależą od zasobów przeglądarki; nie ma stałego limitu rozmiaru pliku ani liczby komórek. Aby obejrzeć oryginalny notatnik, użyj [Przeglądarki notatników Jupyter](/tools/notebook-viewer/).
