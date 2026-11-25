## Jak wyszukać umowę przechowywania Filecoin po identyfikatorze

Podaj numeryczne **ID umowy** zawartej na rynku przechowywania (Storage Market) w sieci głównej Filecoin, a następnie wybierz **Wyszukaj umowę**. Przycisk **Wypróbuj przykład** wczytuje rzeczywisty publiczny rekord, w którym zobaczysz status, dostawcę, klienta, daty i Piece CID. Wyszukiwarka obejmuje umowy Storage Market. Filecoin Onchain Cloud używa oddzielnego identyfikatora zbioru danych.

## Jak interpretować status umowy Filecoin

Umowa jest aktywna, gdy odnotowano jej aktywację, a planowany termin zakończenia jeszcze nie minął. Status oczekiwania oznacza, że umowa czeka na aktywację, aż do planowanej epoki rozpoczęcia włącznie. Wyszukiwarka wyświetla również przypadki, gdy termin rozpoczęcia minął bez aktywacji, umowa wygasła lub w stanie rynku odnotowano nałożenie kary. Epoki rozpoczęcia i zakończenia pochodzą z propozycji umowy. Odpowiadające im daty w UTC są obliczane zgodnie z harmonogramem epok łańcucha.

## Jak porównać Piece CID umowy z własnym plikiem

Piece CID to identyfikator zobowiązania kryptograficznego zapisanego dla fragmentu Filecoin. Skopiuj go, aby porównać go ze zobowiązaniem obliczonym dla lokalnego pliku lub archiwum CAR w kalkulatorze Piece CID Filecoin. Wynik pokazuje też rozmiar fragmentu po dopełnieniu zgodnym z regułami Filecoin. Zweryfikowana umowa ma ustawioną flagę weryfikacji Filecoin Plus.

## Jak znaleźć starsze umowy Filecoin

Przeglądarka najpierw sprawdza bieżący stan rynku w sieci głównej Filecoin. Gdy rekordu już tam nie ma, narzędzie może pokazać pierwotne warunki zindeksowane przez Filfox i oznaczyć je jako rekord historyczny. Warunki te obejmują planowane daty oraz strony umowy. Przycisk **Zobacz w Filfox** otwiera rekord o tym samym ID w eksploratorze.

Pola zwracane przez łańcuch opisuje [dokumentacja Filecoin Storage Market RPC](https://docs.filecoin.io/reference/json-rpc/state#statemarketstoragedeal).
