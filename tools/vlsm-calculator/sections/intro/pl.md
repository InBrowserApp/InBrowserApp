## Jak planować podsieci IPv4 z użyciem VLSM

Wpisz nadrzędny blok w notacji CIDR, np. 192.168.10.0/24. Dodaj wiersz dla każdej sieci i podaj liczbę potrzebnych adresów hostów. Uwzględnij adres bramy i zapas na rozbudowę. Oblicz plan, aby zobaczyć przydzielone podsieci, ich maski, zakresy adresów dla hostów, adresy rozgłoszeniowe i bloki CIDR, które pozostały do wykorzystania.

Maskowanie podsieci o zmiennej długości (VLSM) pozwala podzielić sieć na podsieci różnej wielkości. Kalkulator dobiera najmniejszy blok spełniający wymagania każdej podsieci. Największe bloki przydziela w pierwszej kolejności, zgodnie z granicami CIDR. W standardowej podsieci adres sieci i adres rozgłoszeniowy są zarezerwowane. Na przykład w bloku /26 mieści się 50 hostów, ponieważ ma on 62 adresy dostępne dla hostów.

Używaj /31 tylko na łączach IPv4 typu punkt–punkt, które obsługują dwa adresy dla hostów. /32 oznacza pojedynczy adres, na przykład adres interfejsu pętli zwrotnej routera. W obu przypadkach nie ma adresu rozgłoszeniowego. Obliczenia odbywają się w przeglądarce i nazwy podsieci również w niej pozostają.
