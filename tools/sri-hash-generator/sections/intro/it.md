## Cos’è l’Integrità delle Sottoriscorse (SRI)?

L’Integrità delle Sottoriscorse (SRI) è una funzionalità di sicurezza che consente ai browser di verificare che i file che recuperano (ad esempio, da un CDN) non siano stati modificati inaspettatamente. Funziona confrontando l’hash crittografico di una risorsa con un hash fornito nell’HTML.

**Come funziona:**

1. Generare un hash crittografico del file risorsa
2. Includere l’hash nell’attributo integrity dei tag script o link
3. Il browser recupera la risorsa e calcola il suo hash
4. Il browser confronta l’hash calcolato con l’hash fornito
5. Se gli hash corrispondono, la risorsa viene caricata; altrimenti, il caricamento viene bloccato

**Vantaggi:**

- **Sicurezza**: Protegge contro modifiche dannose delle risorse di terze parti
- **Protezione CDN**: Assicura che i file serviti da CDN non siano stati alterati
- **Sicurezza della catena di fornitura**: Valida l’integrità delle dipendenze esterne
- **Supporto browser**: Ampiamente supportato nei browser moderni

**Algoritmi supportati:**

- SHA-256 (minimo raccomandato)
- SHA-384 (raccomandato)
- SHA-512 (massima sicurezza)
