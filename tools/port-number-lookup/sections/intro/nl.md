## Wat is een Poortnummer?

Een poortnummer is een 16-bits unsigned integer (0-65535) dat wordt gebruikt
om specifieke processen of services op een netwerkapparaat te identificeren.
Poorten maken het mogelijk dat meerdere netwerkservices op hetzelfde
IP-adres draaien.

### Systeempoorten (0-1023)

Ook wel "bekende poorten" genoemd, gereserveerd voor gangbare services zoals
HTTP (80), HTTPS (443), SSH (22).

### Geregistreerde Poorten (1024-49151)

Gebruikt door applicaties en services die bij IANA zijn geregistreerd, zoals
MySQL (3306), PostgreSQL (5432).

### Dynamische Poorten (49152-65535)

Ook wel "kortstondige poorten" genoemd, gebruikt voor tijdelijke
verbindingen door clientapplicaties.
