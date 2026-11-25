## Konvertera en Filecoin f410-adress till 0x

Klistra in en `f410`- eller `t410`-adress och välj **Konvertera adress**. Konverteraren kontrollerar Filecoin-checksumman och visar motsvarande `0x`-adress i Ethereum-format med en EIP-55-checksumma. Kopiera resultatet till en plånbok eller blockutforskare som använder Ethereum-adresser på Filecoin. Med **Prova ett exempel** kan du se en konvertering utan att ange din egen adress.

## Konvertera en 0x-adress till Filecoin

Klistra in en `0x`-adress med 40 hexadecimala siffror. Välj **Huvudnät** för en `f410`-adress eller **Testnät** för en `t410`-adress. `0x`-formen innehåller inget nätverksprefix, så samma byte kan skrivas med båda Filecoin-prefixen. Välj det nätverk som din plånbok, blockutforskare eller kryptobörs använder. Hexadecimala indata med enbart gemener eller enbart versaler godtas. Indata med blandade gemener och versaler måste klara EIP-55-checksumman. Calibration använder samma `t410`-prefix som andra Filecoin-testnät.

## Vad betyder f410 och t410?

Detta är delegerade adresser som används av Filecoin Ethereum Virtual Machine (FEVM). En `f410`- eller `t410`-adress och dess `0x`-form representerar samma adress på 20 byte i det valda Filecoin-nätverket. Filecoins ursprungliga format använder Base32 och en egen checksumma. Formatkonverteringen bevarar dessa byte oförändrade och flyttar inte FIL mellan nätverk.

## Kan jag konvertera f0-, f1-, f2- eller f3-adresser?

Verktyget konverterar delegerade FEVM-adresser i namnrymden `10`, som identifieras av prefixet `f410` eller `t410`. Aktörs-ID-adresser, deras maskerade `0xff0000…`-representationer och andra typer av Filecoin-adresser ligger utanför dess omfattning. Att koppla vissa ursprungliga adresstyper till en aktör kräver kedjans tillstånd. Konverteringen sker i webbläsaren utan RPC-anrop eller anslutning till en plånbok.

Se [Filecoins guide till adresstyper och överföringar](https://github.com/filecoin-project/filecoin-docs/blob/main/networks-and-tools/assets/transfer-fil.md) och [EIP-55-specifikationen för checksummor](https://eips.ethereum.org/EIPS/eip-55).
