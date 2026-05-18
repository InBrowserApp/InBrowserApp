## Che cos'è UUID v3?

UUID v3 è un formato UUID basato sul nome. Prende un UUID di namespace e un nome,
li sottopone a hash con MD5 e formatta il risultato come UUID standard. Il
comportamento importante è il determinismo: lo stesso namespace e lo stesso nome
producono sempre lo stesso UUID.

Questo strumento viene eseguito interamente nel browser. Il namespace, il nome e
l'UUID generato restano sul tuo dispositivo, a meno che tu non copi il risultato
altrove.

## Quando usarlo

- Usa UUID v3 quando ti serve un identificatore stabile per un nome noto, come un
  nome DNS, URL, percorso di oggetto o nome utente.
- Scegli il namespace che corrisponde al tipo di nome che stai identificando. DNS
  e URL sono i preset più comuni.
- Riutilizza sempre lo stesso namespace in modo coerente. Cambiare namespace
  cambia ogni UUID generato, anche quando il nome resta lo stesso.
- Preferisci UUID v5 o un altro identificatore moderno quando puoi scegliere e ti
  serve un UUID basato sul nome con un hash più robusto. UUID v3 esiste per
  compatibilità con sistemi che richiedono specificamente UUID basati su MD5.

## Note sulla sicurezza

UUID v3 non è un ID casuale e non è segreto. Chiunque conosca namespace e nome
può rigenerare lo stesso UUID. Non usarlo per password, token di sessione, chiavi
API o altri valori che devono essere imprevedibili.
