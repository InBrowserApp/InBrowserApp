## Cos'è un CSR?

Una Certificate Signing Request (CSR) è un piccolo documento PKCS#10 necessario a un'autorità di certificazione (CA) per emettere un certificato TLS o per la firma del codice. Raggruppa la metà pubblica di una coppia di chiavi, l'identità che si desidera far attestare dalla CA (il Subject) e gli identificatori aggiuntivi come nomi DNS o indirizzi IP (i Subject Alternative Names, o SAN), il tutto firmato dalla chiave privata corrispondente.

Questo strumento costruisce il CSR interamente nel tuo browser tramite la Web Crypto API e [`@peculiar/x509`](https://github.com/PeculiarVentures/x509). Nessuna informazione relativa alla tua chiave o alla tua richiesta viene inviata a un server.

## Quando usare questo strumento

- Richiedere un certificato TLS a una CA pubblica (Let's Encrypt, DigiCert, ZeroSSL, Sectigo, ecc.) quando il loro flusso di lavoro richiede di incollare il proprio CSR.
- Generare un CSR per un'autorità di certificazione interna — basata su ACME, smallstep, EJBCA, AD CS — senza affidarsi a un modulo web ospitato esternamente.
- Rinnovare un certificato con la stessa chiave privata importando una chiave PKCS#8 PEM esistente e firmando solo un nuovo CSR.

## Come compilare il modulo

- **Sorgente della chiave** — scegli _Genera nuova_ per creare una nuova coppia di chiavi, oppure _Importa esistente_ per incollare una chiave PKCS#8 PEM non cifrata. Le chiavi cifrate, i blocchi `RSA PRIVATE KEY` e `EC PRIVATE KEY` legacy non sono accettati; convertili prima con `openssl pkcs8 -topk8 -nocrypt`.
- **Algoritmo** — RSA offre la maggiore compatibilità per impostazione predefinita. ECDSA produce firme più compatte ed è ampiamente supportato dalle CA moderne e dai client TLS.
- **Subject** — la maggior parte delle CA pubbliche ignora tutto tranne il Common Name e considera l'elenco SAN DNS come autorevole, ma le CA private potrebbero richiedere un DN completo.
- **Voci SAN** — elenca i nomi host, gli indirizzi IP, gli indirizzi email o gli URI che vuoi che il certificato copra. Uno per riga o separati da virgola.

## Cosa tenere a mente

- La chiave privata mostrata accanto al CSR viene generata localmente e non lascia mai il tuo browser. Salvala prima di chiudere la scheda — senza la chiave privata corrispondente, il certificato firmato è inutilizzabile.
- Le CA pubbliche richiedono che il Common Name (o almeno una voce SAN) sia un nome DNS validabile. I SAN con indirizzo IP sono utili principalmente per i certificati interni.
- La chiave privata generata è non cifrata. Aggiungi una passphrase con `openssl pkcs8 -in key.pem -topk8 -out key-enc.pem` se necessario prima di conservarla.
- Sono supportati solo RSA (2048/3072/4096) e ECDSA (P-256/P-384/P-521). EdDSA è intenzionalmente escluso perché il supporto tra browser e CA è ancora inconsistente.
