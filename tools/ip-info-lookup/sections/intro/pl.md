## Co sprawdza to narzędzie

IP Info Lookup rozwiązuje adres IPv4, adres IPv6, domenę lub adres URL i pokazuje publiczne metadane, które usługi internetowe mogą zgłosić dla każdego adresu. Przydaje się, gdy trzeba sprawdzić, dokąd wskazuje domena, która sieć jest właścicielem adresu, jaka nazwa hosta istnieje w odwrotnym DNS albo czy rekordy IPv4 i IPv6 prowadzą do różnych dostawców.

## Jak działa wyszukiwanie domen i adresów URL

Gdy wpiszesz domenę lub adres URL, narzędzie wyodrębnia nazwę hosta i odpytuje wybrany resolver DNS-over-HTTPS o rekordy A oraz AAAA. Każdy zwrócony adres jest następnie uzupełniany osobno, więc domeny dual-stack mogą pokazywać różne kraje, ASN, ISP, nazwy hostów lub strefy czasowe dla IPv4 i IPv6.

## Co oznaczają wyniki

Pola lokalizacji i ISP pochodzą od publicznych dostawców metadanych IP, takich jak geojs.io i ip.sb, a nazwy hostów pochodzą z odwrotnych zapytań DNS PTR, gdy są dostępne. Te rekordy opisują, jak publiczne bazy danych widzą adres, a nie dokładną fizyczną lokalizację osoby lub urządzenia.

## Uwagi o prywatności i dokładności

Wyszukiwanie działa w przeglądarce i wysyła żądania DNS oraz metadanych IP do usług zewnętrznych. VPN-y, serwery proxy, CDN-y, sieci komórkowe i platformy chmurowe mogą sprawić, że zgłoszona lokalizacja lub organizacja będzie inna niż oczekiwany użytkownik końcowy albo serwer. Puste pola są normalne dla adresów prywatnych, zarezerwowanych, niedawno przydzielonych lub słabo udokumentowanych.
