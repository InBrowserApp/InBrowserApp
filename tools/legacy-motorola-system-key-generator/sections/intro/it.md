## Cos'è una chiave di sistema Motorola legacy?

Una chiave software di sistema è un file `.KEY` utilizzato dai software di programmazione Motorola compatibili per consentire la modifica delle impostazioni protette dei sistemi trunking. Questo generatore riproduce il formato legacy derivato da BatLabs per un ID di sistema. Una chiave di sistema è diversa da una chiave di cifratura del traffico radio e di per sé non consente l'accesso a una rete radio.

## Come usare questo generatore

1. Inserisci un ID di sistema usando 1–4 cifre esadecimali (`0–9`, `A–F`), senza il prefisso `0x`. Sono accettate le lettere minuscole e gli ID brevi vengono completati con zeri iniziali: `ab` diventa `00AB`.
2. Controlla l'ID normalizzato, il nome file e l'anteprima esadecimale.
3. Scarica il file binario `.KEY` e caricalo in un software di programmazione legacy compatibile. Il file ha una dimensione di 27 byte; l'ID di sistema `1234` produce `SYS01234.KEY`.

## Limiti di compatibilità

Questo strumento segue un formato legacy pubblicato; la compatibilità dipende dal software di programmazione. Non supporta ASTRO 25 Portable CPS (incluso XTS5000), APX CPS o Advanced System Keys (ASK). Il rispetto del formato in byte di riferimento non conferma la compatibilità con una determinata radio o versione CPS.

## Privacy

La generazione, la convalida e l'anteprima dei file vengono eseguite localmente nel browser. L'ID di sistema e la chiave generata non vengono inviati a un server.
