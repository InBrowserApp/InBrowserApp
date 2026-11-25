## Losowanie dat kalendarzowych z zakresu

Uzupełnij pola **Data początkowa** i **Data końcowa**, wybierz format wyniku i kliknij **Generuj**. Zakres obejmuje obie skrajne daty, więc przy losowaniu od `2024-02-28` do `2024-03-01` może też wypaść dzień przestępny `2024-02-29`. Ta sama data może pojawić się na liście kilka razy. Skopiuj wyniki lub pobierz plik tekstowy `UTF-8` z jedną datą w wierszu.

## Wybór formatu ISO lub zapisu lokalnego

Użyj **ISO (YYYY-MM-DD)** w danych testowych, przy imporcie do arkusza lub do chronologicznego sortowania dat zapisanych jako tekst. Wybierz opcję **Data w formacie lokalnym**, aby wyświetlić datę gregoriańską zgodnie z językiem strony. Na przykład `2024-02-29` na stronie angielskiej ma postać `Feb 29, 2024`, a na niemieckiej `29.02.2024`.

## Ta sama data w każdej strefie czasowej

Początek i koniec każdego dnia w zakresie są wyznaczane według UTC. Wylosowana data zachowuje ten sam dzień kalendarzowy także wtedy, gdy wypada na jednym z krańców zakresu. Jeśli ustawisz tę samą datę początkową i końcową, generator zwróci właśnie tę datę. To przydatne podczas testowania dni przestępnych oraz pierwszego lub ostatniego dnia miesiąca.
