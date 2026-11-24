## Piece-CID aus einem CAR-Archiv oder einer Datei berechnen

Wählen Sie genau die Datei aus, die Sie an einen Filecoin-Speicheranbieter senden möchten. Wählen Sie **Piece-CID berechnen** und kopieren Sie anschließend die benötigte Kennung. Das Tool zeigt auch die Piece-Größe mit Padding in Bytes an. Ihr Browser liest die Datei lokal und verarbeitet sie abschnittsweise. Der Inhalt bleibt auf Ihrem Gerät.

## Welches Format soll ich verwenden?

Die **Piece-CID (v2)** folgt [FRC-0069](https://github.com/filecoin-project/FIPs/blob/master/FRCs/frc-0069.md). Sie beginnt meist mit `bafkzci` und enthält die Angaben zur Datengröße, die neuere Filecoin-Tools benötigen. Die **ältere CommP (v1)** beginnt meist mit `baga6ea4` und wird bei herkömmlichen Filecoin-Speichervereinbarungen verwendet. Wenn eine ältere Piece-CID und die Piece-Größe mit Padding benötigt werden, kopieren Sie das ältere Commitment und verwenden Sie die daneben angezeigte Größe. Um ein vorhandenes Commitment anhand Ihrer Datei zu prüfen, können Sie die Kennung in einem der beiden Formate einfügen.

## Warum sieht meine IPFS-CID anders aus?

Eine IPFS-Wurzel-CID kennzeichnet einen Block oder die Wurzel einer Datei oder eines Verzeichnisses. Eine Filecoin-Piece-CID ist ein kryptografisches Commitment für die exakten Bytes der zu speichernden Daten nach Anwendung der Filecoin-Regeln für Padding und Hashing. Wenn Sie ein CAR-Archiv speichern möchten, berechnen Sie das Commitment für das Archiv selbst. Zwei CAR-Archive können dieselbe IPFS-Wurzel-CID haben und die Blöcke in einer anderen Reihenfolge speichern. Dadurch kann sich die Piece-CID ändern. Verwenden Sie für die Speichervereinbarung genau die Datei, für die Sie die Kennung berechnet haben.

Die Regeln für Format und Padding finden Sie in der [Filecoin-Piece-Spezifikation](https://spec.filecoin.io/systems/filecoin_files/piece/).
