# Kalkulator sum kontrolnych CRC

Sumy kontrolne CRC (Cyclic Redundancy Check) to kompaktowe wartości używane do
wykrywania przypadkowych zmian danych. Często występują w ramkach sieciowych,
formatach archiwów, protokołach wbudowanych, aktualizacjach oprogramowania
układowego i procedurach kontroli integralności plików, gdzie szybka wartość
wykrywająca błędy jest bardziej przydatna niż podpis kryptograficzny.

## Kiedy go używać

Użyj tego kalkulatora, gdy musisz porównać wartości CRC z dokumentacji,
protokołów sprzętowych, formatów plików lub innego systemu. Wklej tekst do
szybkich sprawdzeń albo zaimportuj plik, gdy suma kontrolna musi zostać
obliczona z dokładnego strumienia bajtów.

## Obsługiwane warianty

Narzędzie oblicza popularne warianty ze starszego narzędzia CRC InBrowser.App:
CRC-1, CRC-8, CRC-8 1-Wire, CRC-8 DVB-S2, CRC-16, CRC-16 CCITT,
CRC-16 Modbus, CRC-16 Kermit, CRC-16 XModem, CRC-24, CRC-32, CRC-32 MPEG-2,
CRCJAM oraz kilka modeli CRC-64, w tym ECMA-182, GO-ISO, MS, NVME, REDIS, WE
i XZ.

## Na co uważać

Nazwy wariantów CRC mają znaczenie. Te same dane wejściowe mogą dawać różne
wartości w zależności od wielomianu, wartości początkowej, ustawień odbicia
bitów i końcowego XOR. Jeśli dopasowujesz protokół lub specyfikację dostawcy,
wybierz wynik, którego nazwa wariantu odpowiada tej specyfikacji, zamiast
traktować każdą szerokość CRC jako wymienną.

CRC służy do wykrywania przypadkowych błędów, a nie do przechowywania haseł,
podpisów ani ochrony przed manipulacją. W przypadku weryfikacji wrażliwej na
bezpieczeństwo użyj zamiast tego skrótu kryptograficznego albo procedury
podpisu.
