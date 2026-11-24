## Jak korzystać z terminala portu szeregowego w przeglądarce

Podłącz Arduino, ESP32, Raspberry Pi Pico lub adapter USB portu szeregowego za pomocą kabla do transmisji danych. Ustaw szybkość transmisji używaną przez urządzenie, na przykład 9600 lub 115200, a następnie wybierz **Połącz** i wskaż jego port w przeglądarce. Monitor portu szeregowego używa 8 bitów danych, bez kontroli parzystości, jednego bitu stopu i bez kontroli przepływu (8N1).

## Wysyłanie tekstu i bajtów szesnastkowych

Tekst jest wysyłany w kodowaniu UTF-8. Wybierz LF, CR lub CR + LF, jeśli urządzenie używa zakończenia wiersza do zatwierdzania poleceń. W przypadku poleceń binarnych wybierz **Szesnastkowy** i wprowadź pełne bajty, na przykład `41 54 0D 0A`. W trybie szesnastkowym bajty są wysyłane zgodnie z wpisem, bez automatycznego dodawania zakończenia wiersza.

## Odczytywanie i zapisywanie dziennika portu szeregowego

Dziennik pokazuje odebrane (RX) i wysłane (TX) dane ze znacznikami czasu. Jeśli tekst jest nieczytelny, przełącz się na tryb szesnastkowy, aby sprawdzić poszczególne bajty. Wstrzymaj przewijanie, aby przejrzeć wcześniejszy wpis podczas dalszego odbierania danych, lub pobierz zachowany dziennik jako plik tekstowy. Dane z portu szeregowego pozostają w tej karcie, dopóki nie zdecydujesz się ich zapisać.

## Dlaczego nie mogę połączyć się z urządzeniem?

Użyj aktualnej przeglądarki obsługującej Web Serial i upewnij się, że system operacyjny rozpoznaje port szeregowy. Wypróbuj inny kabel i zamknij inne monitory portu szeregowego, które już korzystają z tego portu. Jeśli urządzenie się łączy, ale wyświetla nieczytelny tekst, sprawdź szybkość transmisji i spróbuj wyświetlić bajty w trybie szesnastkowym.
