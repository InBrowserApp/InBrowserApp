## Filecoin-Adresse mit f410 ins 0x-Format konvertieren

Fügen Sie eine `f410`- oder `t410`-Adresse ein und wählen Sie **Adresse konvertieren**. Der Konverter prüft die Filecoin-Prüfsumme und zeigt die entsprechende `0x`-Adresse im Ethereum-Format mit EIP-55-Prüfsumme an. Kopieren Sie das Ergebnis, wenn Ihre Wallet oder Ihr Block-Explorer auf Filecoin das Ethereum-Adressformat verwendet. Mit **Beispiel ausprobieren** sehen Sie eine Umwandlung, ohne Ihre eigene Adresse einzugeben.

## 0x-Adresse ins Filecoin-Format konvertieren

Fügen Sie eine `0x`-Adresse mit 40 Hexadezimalziffern ein. Wählen Sie **Mainnet** für eine `f410`-Adresse oder **Calibration-Testnetz** für eine `t410`-Adresse. Das `0x`-Format enthält kein Netzwerkpräfix. Deshalb lassen sich dieselben Bytes mit beiden Filecoin-Präfixen darstellen. Wählen Sie das Netzwerk, das Ihre Wallet, Ihr Explorer oder Ihre Kryptobörse verwendet. Hexadezimaleingaben in reiner Klein- oder Großschreibung werden akzeptiert. Bei gemischter Schreibweise muss die EIP-55-Prüfsumme stimmen.

## Was bedeuten f410 und t410?

Das sind delegierte Adressen, die die Filecoin Ethereum Virtual Machine (FEVM) verwendet. Eine `f410`- oder `t410`-Adresse und ihre `0x`-Form stehen für dieselbe 20 Byte lange Adresse im gewählten Filecoin-Netzwerk. Das native Filecoin-Format nutzt Base32 und eine eigene Prüfsumme. Beim Konvertieren bleiben die Bytes unverändert und die FIL bleiben in ihrem Netzwerk.

## Lassen sich f0-, f1-, f2- oder f3-Adressen konvertieren?

Dieses Tool konvertiert delegierte FEVM-Adressen im Namensraum `10`, erkennbar am Präfix `f410` oder `t410`. Adressen mit Actor-ID, ihre maskierten `0xff0000…`-Darstellungen und andere Filecoin-Adresstypen liegen außerhalb dieses Bereichs. Um bestimmte native Adresstypen einem Actor zuzuordnen, wird der Zustand der Blockchain benötigt. Die Konvertierung läuft im Browser ohne RPC-Aufruf oder Wallet-Verbindung.

Siehe den [Filecoin-Leitfaden zu Adresstypen und Übertragungen](https://github.com/filecoin-project/filecoin-docs/blob/main/networks-and-tools/assets/transfer-fil.md) und die [EIP-55-Prüfsummenspezifikation](https://eips.ethereum.org/EIPS/eip-55).
