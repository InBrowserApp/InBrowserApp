## Co pokazuje to narzędzie

To narzędzie wyszukuje publiczne adresy IPv4 i IPv6, które usługi zewnętrzne mogą zobaczyć w bieżącej sesji przeglądarki. Jeśli przeglądarka może również udostępniać kandydatów na interfejsy lokalne za pośrednictwem WebRTC, narzędzie wyświetli je osobno.

## Dlaczego wyniki IPv4, IPv6 i WebRTC mogą się różnić

Twoje adresy IPv4 i IPv6 mogą pochodzić z różnych ścieżek sieciowych, dostawców usług internetowych lub konfiguracji tunelowania. Kandydaci WebRTC mogą obejmować prywatne adresy LAN, tymczasowe adresy interfejsów IPv6 lub trasy związane z VPN, które zwykłe strony internetowe nie zawsze wyświetlają bezpośrednio.

## Jak działa wyszukiwanie

Narzędzie odpytuje dostawców publicznych adresów IP, takich jak Cloudflare, geojs.io, ip.sb i ipify.org, a następnie wzbogaca wykryty adres o nazwę hosta, numer ASN, organizację, kraj, strefę czasową i metadane współrzędnych, jeśli są dostępne. Oznacza to, że narzędzie wymaga aktywnego połączenia internetowego i zależy od jakości odpowiedzi usług stron trzecich.

## Dlaczego może brakować adresu

Adres może nie zostać wyświetlony, jeśli Twoja sieć blokuje jedną rodzinę protokołów, Twoja sieć VPN lub serwer proxy filtruje żądanie, Twoja przeglądarka wyłącza ekspozycję WebRTC lub usługa wyszukiwania nadrzędnego jest tymczasowo niedostępna. Jeśli protokół IPv6 jest niedostępny w Twojej sieci, normalne jest wyświetlanie tylko protokołu IPv4.
