## Normalizzare l’audio a un valore LUFS

Uniforma il volume percepito di episodi di podcast, voci fuori campo e brani musicali. Il normalizzatore misura il loudness integrato dell’intera registrazione e applica la stessa variazione di guadagno a tutti i canali. La differenza di livello tra i passaggi più deboli e quelli più forti rimane invariata. Scegli un’impostazione predefinita oppure inserisci il valore LUFS richiesto dal tuo progetto.

## Come normalizzare un file audio

1. Scegli o trascina una registrazione mono o stereo. Tra i formati più comuni ci sono WAV, MP3, M4A, FLAC e OGG. I codec disponibili dipendono dal browser.
2. Seleziona un valore come −16 LUFS per i podcast, −14 LUFS per la musica o −23 LUFS per le trasmissioni. I requisiti di pubblicazione possono variare. Se hai specifiche di consegna, inserisci il valore richiesto.
3. Confronta le misure originali con quelle del file normalizzato, ascolta il risultato e scarica un WAV a 16 bit e 48 kHz. Decodifica, analisi ed esportazione avvengono sul tuo dispositivo.

## Qual è la differenza tra LUFS e picco effettivo?

Il loudness integrato, espresso in LUFS, stima il volume percepito dell’intera registrazione. La misura pondera le frequenze ed esclude i passaggi al di sotto di una soglia di loudness. Il picco effettivo, indicato in dBTP, stima il livello massimo che il segnale ricostruito può raggiungere tra un campione e l’altro. Due tracce possono avere picchi simili e volumi percepiti molto diversi. Se uniformi solo i picchi, una delle due può continuare a suonare più bassa.

## Perché il risultato è più basso del valore impostato?

Un breve transiente può toccare il limite di −1 dBTP prima che il loudness complessivo raggiunga il valore desiderato. In quel caso, lo strumento riduce il guadagno e mostra il valore raggiungibile. Per ottenere un master con un loudness maggiore e lo stesso margine di picco, controlla i picchi più alti nel tuo editor audio prima di normalizzare. Un file silenzioso può non avere un loudness integrato misurabile.
