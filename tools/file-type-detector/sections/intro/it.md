## Come funziona il rilevamento del tipo di file

Questo strumento legge fino ai primi 64 KiB di un file locale e ne controlla la
firma binaria con [file-type](https://github.com/sindresorhus/file-type). Il
risultato include il tipo MIME rilevato, le estensioni previste e un’anteprima
dei primi 256 byte in esadecimale e ASCII. Non viene caricato nulla.

## Perché un’estensione può non corrispondere

Rinominare un file ne cambia il nome, non il contenuto. Un PNG chiamato photo.jpg
mantiene la firma PNG. Sono accettate le estensioni equivalenti più comuni,
come .jpg e .jpeg. Il MIME dichiarato dal browser viene mostrato separatamente,
perché spesso segue il nome file anziché esaminarne i byte.

## Limiti del rilevamento

Le firme sono indicazioni, non prove che un file sia valido o sicuro. I formati
di testo come TXT, CSV e SVG potrebbero non essere riconosciuti. Un campione
breve può identificare ZIP o un altro contenitore senza confermarne il
sottotipo, per esempio un documento Office. L’anteprima esadecimale mostra il
contenuto grezzo del file, non una somma di controllo crittografica.
