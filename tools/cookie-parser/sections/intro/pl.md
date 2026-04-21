## Co Robi

To narzędzie parsuje surowe nagłówki Cookie i Set-Cookie do uporządkowanego JSON-a bezpośrednio w przeglądarce. Możesz wkleić pojedynczą linię nagłówka, wiele linii albo same wartości bez typowych prefiksów.

## Cookie Vs. Set-Cookie

Nagłówek Cookie zwykle zawiera wiele par nazwa/wartość wysyłanych przez klienta. Nagłówek Set-Cookie zwykle definiuje jedno ciasteczko wraz z atrybutami takimi jak Path, Secure, HttpOnly, SameSite, Expires lub Max-Age.

## Uwagi

Parser działa lokalnie i nie wysyła nagłówków na serwer. Nieprawidłowe segmenty są trzymane na osobnej liście, aby można było szybko znaleźć błędne ciągi cookie.
