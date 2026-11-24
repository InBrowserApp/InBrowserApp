## Jak odczytać raport zbiorczy DMARC

Otwórz załącznik z raportem zbiorczym wysłanym na adres `rua` określony w rekordzie DMARC. Przeglądarka obsługuje XML, GZIP i archiwa ZIP z jednym raportem XML. Możesz również wkleić XML lub wczytać przykład. Podsumowanie wskazuje, kto wysłał raport, jakiego okresu w UTC dotyczy oraz jaką politykę opublikowała domena. Pliki i wklejony tekst są przetwarzane w przeglądarce.

## Jak interpretować liczbę wiadomości

Każdy rekord źródła grupuje wiadomości o tym samym źródłowym adresie IP i wyniku oceny. Jeden rekord może obejmować wiele wiadomości, a ten sam adres IP może pojawić się w kilku rekordach. Sumy uwzględniają liczbę wiadomości z każdego wiersza. Wiadomość ma pozytywny wynik DMARC, gdy SPF lub DKIM daje pozytywny wynik z zachowaniem zgodności z domeną widoczną w polu From. Przeglądarka zalicza wiadomość do wyniku negatywnego, gdy obie kontrole zgodności dają wynik negatywny. Niepełne dane o zgodności oznacza jako nieznane.

## Czym różnią się zgodność domen, uwierzytelnianie i działanie odbiorcy

Rozwiń Surowe wyniki uwierzytelniania, aby zobaczyć zgłoszone domeny, wyniki i selektory DKIM. SPF lub DKIM może dać pozytywny wynik dla innej domeny, a mimo to nie spełnić warunku zgodności domeny w DMARC. Zastosowane działanie pokazuje, jak odbiorca potraktował grupę wiadomości. Może odbiegać od opublikowanej polityki, jeśli odbiorca zastosował wyjątek. Filtruj według źródłowego IP lub domeny From, aby sprawdzić konkretnego nadawcę. Ogólne sumy pozostaną takie same.

## Jakie formaty XML DMARC są obsługiwane

Przeglądarka odczytuje raporty zbiorcze zgodne z RFC 9990, w tym jego przestrzeń nazw DMARC, oraz starsze raporty oparte na RFC 7489. RFC 9990 opisuje format XML służący do podsumowania uwierzytelniania i działań odbiorcy w raportach zbiorczych. Jeśli system pocztowy pakuje kilka raportów do jednego archiwum, wypakuj potrzebny raport i otwórz go osobno.
