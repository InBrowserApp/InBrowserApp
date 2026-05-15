# Generatore di chiavi PGP

Usa questo strumento per creare una coppia di chiavi OpenPGP direttamente nel browser. Produce una chiave pubblica, una chiave privata, un certificato di revoca, un ID chiave e un'impronta digitale in formato con armatura ASCII, così puoi configurare email cifrate, cifratura di file, firma delle release o flussi di recupero account senza inviare il materiale della chiave a un server.

## Quando usarlo

Le chiavi PGP sono utili quando hai bisogno di crittografia asimmetrica: altre persone usano la tua chiave pubblica per cifrare dati per te o verificare firme, mentre la tua chiave privata decifra i dati e crea firme. Un generatore basato sul browser è comodo per brevi sessioni di configurazione, demo o flussi locali in cui vuoi ottenere subito il risultato.

## Come generare una coppia di chiavi

Inserisci un nome, un'email o entrambi, così la chiave avrà un ID utente riconoscibile. Aggiungi un commento opzionale se vuoi distinguere chiavi per lavoro, progetto o firma delle release. Scegli ECC per il software OpenPGP moderno, oppure RSA quando ti serve compatibilità con strumenti meno recenti. Una passphrase è opzionale, ma fortemente consigliata per qualsiasi chiave privata che intendi conservare.

## Tipi di chiave e scadenza

ECC usa Curve25519 ed è l'opzione predefinita perché è compatta e veloce. RSA è disponibile a 2048, 3072 e 4096 bit per compatibilità. La scadenza è impostata in giorni; usa 0 solo per chiavi che gestisci attivamente e che puoi revocare. Periodi di scadenza più brevi riducono il rischio a lungo termine e rendono più semplice l'abitudine alla rotazione.

## Gestire le chiavi private in sicurezza

Scarica la chiave pubblica, la chiave privata e il certificato di revoca come file separati. Esegui il backup della chiave privata in un gestore di password cifrato o in un archivio offline sicuro, e conserva il certificato di revoca in un luogo separato così potrai ritirare la chiave se la chiave privata viene persa o esposta. Prima di pubblicare una chiave pubblica, confronta l'impronta digitale tramite un canale affidabile.
