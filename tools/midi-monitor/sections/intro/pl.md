## Jak podłączyć klawiaturę lub kontroler MIDI

Podłącz urządzenie MIDI i sprawdź, czy system operacyjny je rozpoznaje. Wybierz **Włącz MIDI**, w razie potrzeby przyznaj przeglądarce uprawnienie MIDI i wybierz wejście. Korzystaj ze zgodnej przeglądarki przez HTTPS. Monitor nasłuchuje wybranego wejścia i wyświetla komunikaty lokalnie.

## Jak testować nuty i dynamikę

Naciśnij klawisz lub pad i obserwuj klawiaturę oraz dziennik komunikatów. Note On pokazuje nutę i jej dynamikę, zwykle jako wartość od 1 do 127. Note Off lub Note On z dynamiką 0 zwalnia nutę. Na klawiaturze nuta MIDI 60 jest oznaczona jako C4. Zmień oktawę początkową, aby zobaczyć inny zakres. Przytrzymane nuty są wyświetlane na liście również wtedy, gdy znajdują się poza widocznym zakresem.

## Jak sprawdzać CC, pitch bend i zegar MIDI

Porusz pokrętłem, suwakiem lub pedałem, aby zobaczyć numer i wartość komunikatu zmiany kontrolera (Control Change, CC). Na przykład wiele pedałów sustain wysyła CC 64. Pitch Bend jest wyświetlany wokół wartości środkowej 0. Impulsy zegara MIDI są zliczane oddzielnie od dziennika komunikatów. Standardowy zegar MIDI wysyła 24 impulsy na ćwierćnutę. Dziennik zawiera numery kanałów i surowe bajty szesnastkowe, które pozwalają sprawdzić poszczególne komunikaty.

## Dlaczego wejście MIDI nie reaguje?

Sprawdź przewód, zasilanie i tryb urządzenia oraz upewnij się, że wybrany port odpowiada kontrolerowi. Zamknij inne aplikacje, które mogą korzystać z wejścia, a następnie podłącz urządzenie ponownie. Obsługa zależy od przeglądarki i systemu operacyjnego. To narzędzie nasłuchuje standardowych komunikatów MIDI przy zwykłym dostępie do MIDI. Komunikaty System Exclusive (SysEx) właściwe dla danego urządzenia wymagają dodatkowego uprawnienia.
