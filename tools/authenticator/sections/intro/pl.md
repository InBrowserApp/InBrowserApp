## Jak uzyskać kod 2FA z klucza konfiguracji lub kodu QR

Otwórz ustawienia uwierzytelniania dwuskładnikowego w witrynie, którą chcesz zabezpieczyć, i wybierz opcję aplikacji uwierzytelniającej. Wczytaj lub zeskanuj kod QR z witryny. Możesz też wkleić klucz konfiguracji lub link `otpauth://` i wybrać **Dodaj konto**. Aby zakończyć konfigurację, skopiuj aktualny kod i wklej go w polu weryfikacji w witrynie.

## Jak przenieść konta z innej aplikacji uwierzytelniającej

W Google Authenticator wybierz **Przenieś konta** i wyeksportuj konta, które chcesz przenieść. Tutaj wybierz **Użyj kamery**, aby zeskanować kody QR z eksportu, lub wczytaj zapisane obrazy z kodami QR pojedynczo. W [pierwotnej aplikacji uwierzytelniającej InBrowser.App](https://authenticator.inbrowser.app/) wybierz **Export**, a następnie **Google Authenticator**. Pobierz obraz z kodem QR i wczytaj go tutaj.

Konta są zapisywane w tej przeglądarce. Przed wyczyszczeniem danych witryny lub zmianą przeglądarki wybierz **Eksportuj konta** i pobierz kopię zapasową. Przechowuj ją w bezpiecznym miejscu, ponieważ zawiera klucze konfiguracji.

## Dlaczego witryna odrzuca mój kod weryfikacyjny?

Większość witryn obsługuje kody oparte na czasie (TOTP). Sprawdź, czy urządzenie automatycznie ustawia czas. Jeśli bieżący kod zaraz wygaśnie, użyj następnego. Kody oparte na liczniku (HOTP) pozostają takie same, dopóki nie wybierzesz **Następny kod**. W obu przypadkach użyj kodu właściwego konta i sprawdź, czy jego ustawienia odpowiadają wymaganiom witryny.
