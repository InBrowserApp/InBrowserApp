Odszyfrowywanie AES przywraca tekst jawny z danych zaszyfrowanych tym samym materiałem klucza AES. To narzędzie jest przeznaczone do koperty JSON utworzonej przez Szyfrator AES InBrowser.App. Koperta przechowuje razem algorytm, ustawienia wyprowadzania klucza, sól, IV, szyfrogram i metadane tekstu jawnego, natomiast hasło lub surowy klucz pozostają oddzielnie.

Cała praca odbywa się lokalnie z użyciem przeglądarkowego Web Crypto API. Zaszyfrowany JSON, hasło, surowy klucz i odszyfrowany wynik nie są przesyłane.

## Kiedy używać tego narzędzia

Użyj go, gdy ktoś przekaże Ci kopertę JSON `inbrowser-aes-v1` albo gdy musisz odzyskać notatkę, token, fragment konfiguracji lub plik zaszyfrowany wcześniej na odpowiadającej stronie Szyfratora AES.

Jeśli koperta została utworzona z hasłem, wpisz to samo hasło, a narzędzie ponownie użyje zapisanego hasha PBKDF2, liczby iteracji, soli, trybu AES i długości klucza. Jeśli koperta została utworzona z surowym kluczem, wklej dokładny klucz szesnastkowy o długości zapisanej w kopercie.

## Uwagi praktyczne

AES-GCM uwierzytelnia zaszyfrowane dane, więc błędne klucze lub zmieniony JSON powinny zakończyć się niepowodzeniem zamiast zwrócić zmieniony tekst jawny. AES-CBC i AES-CTR mogą odszyfrowywać zgodne koperty, ale same nie uwierzytelniają szyfrogramu.

Przechowuj hasło lub surowy klucz oddzielnie od koperty JSON. Każda osoba mająca zarówno kopertę, jak i materiał klucza może odzyskać tekst jawny. W przypadku kopert plików odzyskany plik do pobrania używa oryginalnej nazwy pliku i typu mediów zapisanych w JSON.
