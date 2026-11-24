## CAR-Datei aus Dateien oder einem Ordner erstellen

Wählen Sie Dateien oder einen Ordner aus und klicken Sie auf **CAR erstellen**. Kopieren Sie die Wurzel-CID und speichern Sie das `.car`-Archiv. Der Browser liest die Auswahl auf Ihrem Gerät und erstellt ein CARv1-Archiv mit einer UnixFS-Wurzel. Sie können das Archiv als Sicherung behalten oder in einen IPFS-Knoten oder Speicherdienst importieren.

## Wie das Archiv Ihre Dateien erhält

Eine einzelne Datei wird zur Wurzel. Mehrere Dateien liegen gemeinsam in einem Wurzelverzeichnis. Bei einem ausgewählten Ordner bleiben die Pfade seiner Dateien erhalten. Die Ordnerauswahl des Browsers liefert die Dateien und deren Pfade. Wenn Ihr Browser das Ziehen und Ablegen von Ordnern unterstützt, ziehen Sie den Ordner in die Ablagefläche, um leere Unterordner einzubeziehen.

## Was die Wurzel-CID bedeutet

Die Wurzel-CID kennzeichnet die archivierte Datei oder das archivierte Verzeichnis. Der Generator verwendet dieselben CIDv1-Standardeinstellungen wie der IPFS-CID-Rechner. Bei gleicher Datei- und Ordnerstruktur ergibt sich dieselbe Inhaltskennung. Um das Archiv in Kubo zu importieren, führen Sie `ipfs dag import archive.car` mit dem Namen der heruntergeladenen Datei aus. [Kubo-Befehlsreferenz](https://docs.ipfs.tech/reference/kubo/cli/#ipfs-dag-import)
