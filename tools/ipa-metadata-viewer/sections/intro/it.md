## Aprire un IPA e leggere i metadati dell’app principale

Trascina un file `.ipa` di iOS o scegli **Apri file IPA**. Il visualizzatore legge l’elenco di proprietà dell’app principale in un percorso come `Payload/Trail Notes.app/Info.plist`. Prova l’IPA di esempio per vedere i campi prima di aprire un tuo file. L’archivio viene estratto e l’elenco di proprietà viene letto nel browser.

## Capire ID pacchetto, versioni e piattaforme

L’ID pacchetto, salvato in `CFBundleIdentifier`, identifica il pacchetto dell’app. `CFBundleShortVersionString` indica la versione pubblicata, mentre `CFBundleVersion` identifica la build. Controlla `MinimumOSVersion` e `CFBundleSupportedPlatforms` per vedere la versione minima del sistema e i nomi delle piattaforme registrati nel pacchetto. Il nome visualizzato proviene da `CFBundleDisplayName` o da `CFBundleName`.

## Esaminare ed esportare Info.plist

Seleziona **Info.plist** per vedere l’intero elenco di proprietà in formato XML leggibile, comprese le chiavi assenti dalla panoramica. Il visualizzatore legge gli elenchi di proprietà binari e XML. Scegli **Copia XML** per usare la versione leggibile in un altro strumento oppure **Scarica Info.plist** per salvare il file originale senza modificarlo. Il percorso mostrato nell’archivio indica da quale pacchetto dell’app provengono i metadati.

[Documentazione Apple sugli elenchi di proprietà informative](https://developer.apple.com/documentation/bundleresources/information-property-list)
