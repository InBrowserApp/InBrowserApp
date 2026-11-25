## Konverter en Filecoin f410-adresse til 0x

Lim inn en `f410`- eller `t410`-adresse og velg **Konverter adresse**. Konvertereren kontrollerer Filecoin-sjekksummen og viser den tilsvarende `0x`-adressen i Ethereum-format med en EIP-55-sjekksum. Kopier resultatet til en lommebok eller blokkutforsker som bruker Ethereum-adresser på Filecoin. Med **Prøv et eksempel** kan du se en konvertering uten å skrive inn din egen adresse.

## Konverter en 0x-adresse til Filecoin

Lim inn en `0x`-adresse med 40 heksadesimale sifre. Velg **Hovednett** for en `f410`-adresse eller **Calibration-testnett** for en `t410`-adresse. `0x`-formen inneholder ikke noe nettverksprefiks, så de samme bytene kan skrives med begge Filecoin-prefiksene. Velg nettverket som lommeboken, blokkutforskeren eller kryptobørsen din bruker. Heksadesimal inndata med bare små eller bare store bokstaver godtas. Inndata med blandede store og små bokstaver må bestå EIP-55-sjekksummen.

## Hva betyr f410 og t410?

Dette er delegerte adresser som brukes av Filecoin Ethereum Virtual Machine (FEVM). En `f410`- eller `t410`-adresse og dens `0x`-form representerer samme adresse på 20 byte på det valgte Filecoin-nettverket. Filecoins opprinnelige format bruker Base32 og sin egen sjekksum. Formatkonverteringen bevarer disse bytene uendret og flytter ikke FIL mellom nettverk.

## Kan jeg konvertere f0-, f1-, f2- eller f3-adresser?

Verktøyet konverterer delegerte FEVM-adresser i navnerommet `10`, identifisert med prefikset `f410` eller `t410`. Aktør-ID-adresser, deres maskerte `0xff0000…`-representasjoner og andre typer Filecoin-adresser faller utenfor dette omfanget. Å knytte noen opprinnelige adressetyper til en aktør krever kjedens tilstand. Konverteringen skjer i nettleseren uten RPC-kall eller tilkobling til en lommebok.

Se [Filecoins veiledning om adressetyper og overføringer](https://github.com/filecoin-project/filecoin-docs/blob/main/networks-and-tools/assets/transfer-fil.md) og [EIP-55-spesifikasjonen for sjekksummer](https://eips.ethereum.org/EIPS/eip-55).
