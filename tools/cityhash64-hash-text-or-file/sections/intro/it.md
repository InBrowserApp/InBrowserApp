## Che cos'è CityHash64?

CityHash64 è un algoritmo hash non crittografico veloce di Google che produce un valore a 64 bit (8 byte). È utile quando serve un'impronta compatta e deterministica per testo o file e la velocità conta più della sicurezza crittografica.

**Caratteristiche chiave:**

- **Veloce e deterministico**: Lo stesso input e lo stesso seed producono sempre lo stesso hash a 64 bit
- **Non crittografico**: Non usare CityHash64 per password, firme, token o controlli di integrità a prova di manomissione
- **Compatibile con seed**: Lascia il seed vuoto per CityHash64 standard, oppure inserisci un seed decimale o esadecimale `0x` quando ti serve uno spazio hash con seed separato
- **Elaborazione locale**: Testo e file vengono sottoposti a hash nel browser; i file caricati non vengono inviati a un server
- **Codifiche multiple**: I risultati vengono mostrati come valori esadecimali, Base64, decimali e binari

**Usi comuni:**

- Tabelle hash e strutture dati
- Impronte di file non destinate alla sicurezza
- Deduplicazione e raggruppamento dei dati
- Chiavi cache e chiavi di sharding
- Fixture di regressione per sistemi che usano già CityHash64
- Indicizzazione database
