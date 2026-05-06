## Co robi to narzędzie

To narzędzie łączy bloki CIDR w najmniejszy równoważny zestaw, a następnie odejmuje wszystkie bloki CIDR umieszczone na liście wykluczeń. Obsługuje IPv4 i IPv6 w jednym uruchomieniu, a całe przetwarzanie odbywa się lokalnie w przeglądarce.

## Jak działa scalanie i wykluczanie

Lista scalania jest najpierw normalizowana: bity hosta są zerowane, nakładające się sieci są łączone, a sąsiadujące sieci są zwijane, gdy można je przedstawić krótszym blokiem CIDR. Następnie lista wykluczeń jest odejmowana od scalonych zakresów. Końcowy wynik jest rozwijany z powrotem do minimalnej listy CIDR, która dokładnie obejmuje to, co pozostało.

## Kiedy to się przydaje

Użyj go podczas porządkowania reguł zapory sieciowej, przygotowywania wpisów grup zabezpieczeń w chmurze, przeglądania list dozwolonych adresów VPN, podsumowywania tablic routingu albo usuwania zarezerwowanych zakresów z większej alokacji. Jest szczególnie pomocne, gdy skopiowana konfiguracja zawiera nakładające się bloki albo gdy z szerokiej sieci trzeba usunąć kilka mniejszych zakresów.

## Uwagi dotyczące danych wejściowych

Wpisz jeden CIDR w wierszu albo rozdziel wiele CIDR przecinkami. Bloki IPv4 i IPv6 można wkleić razem, ale wykluczenia mają zastosowanie tylko do bloków z tej samej rodziny adresów. Nieprawidłowe wpisy są zgłaszane wraz z nazwą listy i numerem wiersza, aby można było poprawiać duże wklejone dane bez zgadywania.
