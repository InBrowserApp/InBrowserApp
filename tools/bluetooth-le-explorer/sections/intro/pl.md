## Jak połączyć się z urządzeniem Bluetooth Low Energy

Włącz Bluetooth i ustaw urządzenie w trybie umożliwiającym połączenie. Wybierz **Połącz z urządzeniem**, a następnie wybierz urządzenie peryferyjne w przeglądarce. Eksplorator prosi o dostęp do typowych usług GATT, takich jak bateria, informacje o urządzeniu, tętno i pomiary środowiskowe. W przypadku niestandardowej usługi GATT wprowadź jej identyfikator UUID przed otwarciem okna wyboru. Użyj 16-bitowego identyfikatora UUID, na przykład `180F`, lub pełnego 128-bitowego identyfikatora z dokumentacji urządzenia.

## Jak odczytywać charakterystyki GATT

Rozwiń usługę, aby zobaczyć jej charakterystyki i obsługiwane przez nie operacje. Wybierz **Odczytaj**, aby pobrać bieżącą wartość. Format szesnastkowy pokazuje bajty dokładnie w postaci, w jakiej zostały odebrane, a UTF-8 jest przydatny do charakterystyk zawierających tekst. Poziom baterii, pomiar lub inna wartość binarna może wymagać interpretacji zgodnie ze specyfikacją danej charakterystyki.

## Jak przechwytywać powiadomienia Bluetooth

Wybierz **Subskrybuj** przy charakterystyce obsługującej powiadomienia lub potwierdzane powiadomienia. Aktualizacje pojawiają się wraz z godziną i identyfikatorem UUID charakterystyki. Pobierz ostatnie 100 powiadomień jako plik JSON do późniejszej analizy albo wybierz **Anuluj subskrypcję**, aby zatrzymać ten strumień. Strona przechowuje dziennik lokalnie.

## Dlaczego nie widzę urządzenia lub jego usług?

Obsługa Web Bluetooth zależy od przeglądarki i systemu operacyjnego. Użyj obsługiwanej przeglądarki przez HTTPS, umieść urządzenie w pobliżu i rozłącz je z innymi aplikacjami, jeśli pozwala tylko na jedno połączenie. Przeglądarka udostępnia autoryzowane usługi GATT urządzeń peryferyjnych Bluetooth LE. Urządzenia Bluetooth Classic, takie jak słuchawki udostępniające tylko profile audio, wymagają innego interfejsu.
