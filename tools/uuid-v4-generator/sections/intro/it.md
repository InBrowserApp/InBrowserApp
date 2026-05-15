Genera un UUID v4 localmente nel tuo browser quando ti serve un nuovo identificatore per record di test, righe di database, esempi API, payload di eventi, fixture o file di configurazione. Lo strumento crea un UUID canonico in minuscolo alla volta, così rimane concentrato sul flusso di lavoro a singolo valore senza sovrapporsi al generatore separato per lotti.

## Cosa significa UUID v4

Un UUID v4 è un identificatore a 128 bit in cui i bit di versione e variante sono fissi e i restanti 122 bit provengono da dati casuali. Questo lo rende utile quando servono identificatori che non rivelano ora di creazione, informazioni sulla macchina, contatori di sequenza o dettagli dell'utente.

## Quando usarlo

Usa UUID v4 per ID generati dal client, oggetti mock, record temporanei, esempi pubblici e sistemi distribuiti in cui coordinare un contatore centrale sarebbe scomodo. È una buona scelta predefinita quando l'ordinamento non è importante e ti serve solo un identificatore con bassa probabilità di collisione.

## Privacy e affidabilità

La generazione viene eseguita in questa scheda del browser con Web Crypto, quindi l'UUID non viene inviato a InBrowser.App o a un altro servizio. Copia il valore quando ti sembra corretto, poi rigeneralo ogni volta che ti serve un nuovo identificatore per il record o l'esempio successivo.
