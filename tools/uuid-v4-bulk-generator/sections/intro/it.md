Genera un batch di identificatori UUID v4 direttamente nel tuo browser quando ti servono ID casuali per righe di database, fixture API, chiavi di oggetti, payload di test, modelli di importazione o attività operative una tantum.

## Cosa offre UUID v4

UUID v4 è un identificatore a 128 bit costruito principalmente da byte casuali crittograficamente sicuri. I bit di versione e variante sono fissati dal layout RFC 4122, quindi un UUID v4 ha la forma familiare `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx` pur mantenendo uno spazio casuale molto ampio.

## Scegli una dimensione pratica del batch

Il batch predefinito offre abbastanza ID per molti flussi di lavoro con fixture e fogli di calcolo senza rendere la pagina difficile da scorrere. Aumenta il conteggio quando prepari un'importazione più grande, oppure riducilo quando ti serve solo una manciata di identificatori per un esempio di richiesta o una modifica manuale del database.

## Copia o esporta

Controlla l'elenco generato, poi copialo nel tuo editor o scarica un file di testo semplice. Ogni valore viene generato localmente e il batch corrente non viene mai caricato da questo strumento.

## Indicazioni sulle collisioni

Il rischio di collisione di UUID v4 è estremamente basso per i normali carichi di lavoro applicativi, ma non sostituisce un vincolo di unicità del database. Continua ad applicare l'unicità quando l'ID diventa una chiave primaria, un token pubblico o un riferimento durevole.
