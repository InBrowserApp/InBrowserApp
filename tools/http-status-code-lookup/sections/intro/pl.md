## Czym jest kod statusu HTTP?

Kody statusu HTTP to trzycyfrowe kody odpowiedzi zwracane przez serwer, aby pokazac, co stalo sie z zadaniem. Czesto zobaczysz je w narzedziach deweloperskich przegladarki, odpowiedziach API, logach serwera, monitoringu dostepnosci i panelach reverse proxy.

### Jak czytac glowne rodziny kodow statusu

- **1xx Informacyjne:** Serwer otrzymal zadanie i przetwarzanie nadal trwa.
- **2xx Sukces:** Zadanie zostalo wykonane pomyslnie.
- **3xx Przekierowanie:** Klient musi przejsc pod inny adres albo ponownie uzyc wyniku z pamieci podrecznej.
- **4xx Blad klienta:** Problem dotyczy samego zadania, na przyklad brakujacego zasobu, nieprawidlowych danych lub nieudanego uwierzytelnienia.
- **5xx Blad serwera:** Serwer albo zaleznosc upstream nie poradzily sobie z obsluga poprawnego zadania.

### Kiedy ten lookup jest przydatny

Uzyj tego narzedzia, gdy chcesz potwierdzic znaczenie kodu, porownac podobne kody takie jak 401 i 403 albo 502 i 504, lub wyszukac status po frazie z komunikatu o bledzie. Wyszukiwanie dziala po kodzie, nazwie statusu i zlokalizowanym opisie.

### Dlaczego poprawna interpretacja ma znaczenie

Podczas debugowania kod statusu jest czesto najszybsza wskazowka. Odpowiedz 4xx zwykle wskazuje na zadanie, dane uwierzytelniajace albo zasob docelowy. Odpowiedz 5xx zwykle wskazuje na aplikacje, brame albo usluge upstream. Najpierw odczytaj kategorie, a latwiej wybierzesz kolejny krok.
