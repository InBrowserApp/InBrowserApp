## Jak przekonwertować notatnik Jupyter na PDF

Otwórz zapisany plik `.ipynb` z Jupytera, Google Colab lub VS Code albo przeciągnij go do narzędzia. Sprawdź podgląd, wybierz A4 lub US Letter i kliknij **Zapisz jako PDF**. W oknie drukowania przeglądarki wybierz **Zapisz jako PDF** jako miejsce docelowe. W tym samym oknie możesz też wybrać drukarkę. Przykładowo z pliku `analysis.ipynb` otrzymasz PDF, który możesz dołączyć do wiadomości e-mail lub oddać razem z raportem.

## Co zawiera PDF

W pliku PDF komórki występują w tej samej kolejności co w notatniku. Plik zawiera nagłówki i tabele Markdown, kod źródłowy oraz obsługiwane zapisane wyniki, na przykład tekst z konsoli, tabele i osadzone obrazy wykresów. Długie wiersze kodu zawijają się w obrębie strony. Długie komórki mogą przechodzić na kolejną stronę, a tekst w PDF można zaznaczać.

Aby uwzględnić najnowsze wyniki, zapisz notatnik wraz z nimi przed konwersją. Konwerter odczytuje zapisany plik lokalnie i nie uruchamia komórek. Widżety pojawiają się, jeśli zapisano ich statyczną wersję. Kod LaTeX pozostaje tekstem, a obrazy i inne zasoby zewnętrzne nie są pobierane.

## Inne sposoby pracy z notatnikiem

W [przeglądarce notatników Jupyter](../notebook-viewer/) możesz swobodnie przeglądać komórki i zapisane wyniki. Użyj [konwertera notatników Jupyter](../notebook-export/), jeśli potrzebujesz pliku HTML, Markdown lub skryptu.
