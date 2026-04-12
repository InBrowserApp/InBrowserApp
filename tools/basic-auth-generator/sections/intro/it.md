## Che cos'è Basic Auth?

Basic Auth inserisce `username:password` nell'header `Authorization` dopo averlo codificato in Base64. È semplice e molto supportato, ma Base64 è solo una codifica, non una crittografia.

## Cosa genera questo strumento

- Un header `Authorization: Basic ...` da incollare nei client API.
- Un esempio `curl` pronto all'uso per test rapidi.
- Tutto viene eseguito localmente nel browser.

## Cosa tenere a mente

- Usa HTTPS ogni volta che invii credenziali Basic Auth.
- Chiunque veda l'header può decodificare nome utente e password originali.
- Basic Auth è comodo per strumenti interni, ambienti di staging e controlli API veloci.
