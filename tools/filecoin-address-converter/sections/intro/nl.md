## Een Filecoin f410-adres naar 0x converteren

Plak een `f410`- of `t410`-adres en selecteer **Adres converteren**. De converter controleert de Filecoin-checksum en toont het overeenkomstige Ethereum-achtige `0x`-adres met een EIP-55-checksum. Kopieer het resultaat voor een wallet of block explorer die op Filecoin Ethereum-achtige adressen gebruikt. Met **Een voorbeeld proberen** bekijk je een conversie zonder je eigen adres in te voeren.

## Een 0x-adres naar Filecoin converteren

Plak een `0x`-adres met 40 hexadecimale cijfers. Kies **Mainnet** voor een `f410`-adres of **Testnet** voor een `t410`-adres. De `0x`-vorm bevat geen netwerkprefix, dus dezelfde bytes kunnen met beide Filecoin-prefixen worden geschreven. Selecteer het netwerk dat je wallet, explorer of exchange gebruikt. Hexadecimale invoer met alleen kleine letters of alleen hoofdletters wordt geaccepteerd. Invoer met beide moet voldoen aan de EIP-55-checksum. Calibration gebruikt hetzelfde `t410`-prefix als andere Filecoin-testnetten.

## Wat betekenen f410 en t410?

Dit zijn gedelegeerde adressen die de Filecoin Ethereum Virtual Machine (FEVM) gebruikt. Een `f410`- of `t410`-adres en de bijbehorende `0x`-vorm vertegenwoordigen hetzelfde adres van 20 bytes op het geselecteerde Filecoin-netwerk. De native Filecoin-vorm gebruikt Base32 en een eigen checksum. De formaatconversie laat die bytes ongewijzigd en verplaatst geen FIL tussen netwerken.

## Kan ik f0-, f1-, f2- of f3-adressen converteren?

Dit hulpmiddel converteert gedelegeerde FEVM-adressen in naamruimte `10`, herkenbaar aan het voorvoegsel `f410` of `t410`. Actor-ID-adressen, hun gemaskeerde `0xff0000…`-representaties en andere Filecoin-adrestypen vallen buiten die scope. Om sommige native adrestypen aan een actor te koppelen is de chainstatus nodig. Deze conversie gebeurt in je browser zonder RPC-verzoek of walletverbinding.

Zie [Filecoins gids over adrestypen en overdrachten](https://github.com/filecoin-project/filecoin-docs/blob/main/networks-and-tools/assets/transfer-fil.md) en de [EIP-55-checksumspecificatie](https://eips.ethereum.org/EIPS/eip-55).
