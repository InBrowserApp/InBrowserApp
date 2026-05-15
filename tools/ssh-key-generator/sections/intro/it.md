## Che cos'è una coppia di chiavi SSH?

Una coppia di chiavi SSH è composta da una chiave pubblica e una chiave privata usate per autenticarsi su server, host Git, sistemi di distribuzione e altri servizi basati su SSH. La chiave pubblica può essere condivisa. La chiave privata deve restare segreta.

Questo generatore crea chiavi Ed25519 o RSA in formato OpenSSH interamente nel browser. Mostra anche l'impronta SHA-256, cioè il valore compatto che OpenSSH visualizza comunemente quando verifichi una chiave.

## Quando usare questo strumento

- Crea una chiave di sviluppo per un server di test, un remoto Git, un container o un ambiente di laboratorio temporaneo.
- Genera una chiave Ed25519 quando ti serve un valore predefinito moderno e compatto per un nuovo accesso SSH.
- Genera una chiave RSA quando un servizio meno recente non supporta Ed25519.
- Copia una chiave pubblica in `authorized_keys` mantenendo la chiave privata sul tuo dispositivo.

## Come scegliere un algoritmo

Ed25519 è la scelta predefinita migliore per la maggior parte delle nuove chiavi SSH perché è piccola, veloce e ampiamente supportata dalle versioni correnti di OpenSSH. RSA è utile per la compatibilità con dispositivi meno recenti, server Git legacy o requisiti di policy che richiedono ancora chiavi RSA.

Per RSA, 4096 bit è un valore predefinito prudente. Le chiavi più piccole a 2048 bit sono più rapide e ancora comuni, ma molti team oggi preferiscono 3072 o 4096 bit per le nuove chiavi di lunga durata.

## Cosa tenere presente

- La chiave privata prodotta qui non è cifrata. Aggiungi una passphrase con `ssh-keygen -p -f <key-file>` se te ne serve una.
- Conserva la chiave privata con permessi restrittivi, ad esempio `chmod 600 <key-file>`.
- Non incollare chiavi private in ticket, chat, log o pagine web sconosciute.
- Ruota le chiavi quando un laptop, un segreto CI o un backup contenente la chiave privata potrebbe essere esposto.
