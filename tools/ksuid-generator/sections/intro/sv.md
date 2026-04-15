## Vad är KSUID?

KSUID (K-Sortable Unique IDentifier) är en 27-teckens base62-identifierare som innehåller en 32-bitars tidsstämpel (sekunder sedan 2014-05-13) och 128 bitars slumpdata.

**Nyckelpunkter:**

- **Tids-sorterbar**: lexikografisk ordning följer skapandetiden.
- **Hög unikhet**: 128 bitars slump per ID.
- **Sekundprecision**: KSUID lagrar bara sekunder, millisekunder avrundas nedåt.
