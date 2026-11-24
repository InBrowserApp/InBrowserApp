## CID für eine Datei oder einen Ordner berechnen

Wählen Sie eine lokale Datei oder einen Ordner aus und klicken Sie auf **CID berechnen**. Kopieren Sie die Inhaltskennung (CID), um sie in einem Manifest festzuhalten oder sie mit der CID eines früheren IPFS-Imports zu vergleichen. Die Berechnung erfolgt in Ihrem Browser. Ihre Dateien bleiben auf Ihrem Gerät.

## Warum kann dieselbe Datei unterschiedliche IPFS-CIDs haben?

IPFS kann eine Datei in Blöcke aufteilen und die Verknüpfungen zwischen ihnen mit UnixFS speichern. Die Wurzel-CID hängt davon ab, wie diese Blöcke aufgeteilt, codiert und angeordnet sind. Um eine CID zu reproduzieren, verwenden Sie dieselbe Segmentgröße, dieselbe Einstellung für Blattblöcke und dieselbe Ordnerstruktur wie beim ursprünglichen Import. In die CID eines Ordners fließen auch die Namen seiner Einträge ein. Die Ordnerauswahl des Browsers lässt leere Unterordner aus.

## CID mit Kubo reproduzieren

Öffnen Sie die **Importeinstellungen**, um die CID-Version, die Segmentgröße, das Format der Blattblöcke oder den umschließenden Ordner zu ändern. Standardmäßig wird CIDv1 verwendet. Wählen Sie CIDv0, wenn Sie einen älteren Import mit dieser Version reproduzieren möchten. **In Ordner einschließen** fügt einen übergeordneten Ordner hinzu. So können Sie die Datei über ihren Namen unterhalb der Wurzel-CID ansprechen.

Kopieren Sie den angezeigten Befehl `ipfs add --only-hash`, um die Berechnung für dieselbe Datei oder denselben Ordner in Kubo zu wiederholen. Wenn Sie eine CID aus einem früheren Import haben, fügen Sie sie in das Vergleichsfeld ein. Eine CIDv0 und eine CIDv1 stimmen überein, wenn beide denselben Block bezeichnen. [IPFS-Dokumentation zu Inhaltskennungen](https://docs.ipfs.tech/concepts/content-addressing/)
