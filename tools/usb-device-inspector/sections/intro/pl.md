## Jak sprawdzić urządzenie USB w przeglądarce

Podłącz urządzenie kablem obsługującym przesyłanie danych, wybierz **Wybierz urządzenie**, a następnie wskaż je w oknie WebUSB przeglądarki. Karta urządzenia pokazuje identyfikator dostawcy (VID), identyfikator produktu (PID) i dostępne dane identyfikacyjne. Wersja USB pochodzi z deskryptora urządzenia. Rzeczywista szybkość połączenia zależy także od kabla, portu i systemu operacyjnego.

## Jak odczytywać konfiguracje, interfejsy i punkty końcowe

Rozwiń konfigurację, aby zobaczyć funkcje udostępniane przez jej interfejsy. Interfejs może mieć kilka ustawień alternatywnych, a każde z nich ma własną klasę, podklasę, protokół i punkty końcowe. Punkty końcowe IN przesyłają dane do hosta, a punkty OUT do urządzenia. Typ punktu końcowego i rozmiar pakietu określają sposób przesyłania danych.

## Co oznacza sprawdzenie dostępu?

Wybierz **Sprawdź dostęp**, aby sprawdzić, czy przeglądarka może otworzyć wybrane urządzenie. Test używa uchwytu urządzenia i zwalnia go po zakończeniu. Dostęp do interfejsów może nadal zależeć od sterownika systemu operacyjnego lub innej aplikacji. Inspektor odczytuje deskryptory udostępnione przez przeglądarkę i nie zmienia ustawień urządzenia.

## Dlaczego nie widzę urządzenia USB lub nie mogę go otworzyć?

Jeśli urządzenia nie ma w oknie wyboru, wypróbuj kabel do przesyłania danych i sprawdź, czy system operacyjny je rozpoznaje. Jeśli przeglądarka odmawia dostępu, sprawdź uprawnienie USB witryny lub zasady przeglądarki. Jeśli wybór się powiódł, ale nie można otworzyć urządzenia, zamknij aplikacje, które mogą z niego korzystać, i sprawdź wymagania dotyczące sterowników dla urządzenia i platformy. Niektóre klasy USB są chronione przez przeglądarkę. Możliwości przeglądarki i systemu znajdziesz w narzędziu [Informacje o urządzeniu](../device-information/).
