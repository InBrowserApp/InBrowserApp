# Registratore schermo

Registra uno schermo, una finestra o una scheda selezionati dal browser senza
caricare il video su un server. Lo strumento usa le API Screen Capture e
MediaRecorder del browser, quindi la registrazione resta locale finché non la
scarichi.

## Quando usarlo

Usa il registratore per brevi demo, segnalazioni di bug, walkthrough, note di QA
o video interni rapidi quando basta un flusso leggero nel browser. Puoi chiedere
al browser di includere l'audio della scheda o del sistema e, facoltativamente,
aggiungere il microfono prima dell'avvio della registrazione.

## Privacy e supporto del browser

Il browser decide quali sorgenti di acquisizione e opzioni audio sono
disponibili. Alcuni browser condividono l'audio solo per la scheda corrente,
alcuni richiedono HTTPS e altri non supportano affatto la pausa o la
registrazione. Se l'autorizzazione viene negata, non viene mantenuto alcun
flusso e puoi riprovare con impostazioni diverse.

## Suggerimenti per registrazioni affidabili

Chiudi le sessioni di acquisizione non correlate prima di iniziare, scegli la
sorgente utile più piccola e fai una breve prova quando l'audio è importante.
Scarica il risultato prima di cancellarlo, perché le registrazioni vengono
conservate solo nella sessione corrente della pagina.
