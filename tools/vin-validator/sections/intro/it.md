## Cos'è un VIN?

Il Vehicle Identification Number (VIN) è un codice di 17 caratteri che identifica in modo univoco un veicolo.

- `1M8GDM9AXKP042788`
- Le lettere I, O, Q non vengono utilizzate
- Il 9° carattere è una cifra di controllo

### Struttura del VIN

1. **WMI** (posizioni 1-3): World Manufacturer Identifier (identificativo del produttore)
2. **VDS** (posizioni 4-8): Vehicle Descriptor Section (sezione descrittiva del veicolo)
3. **Cifra di controllo** (posizione 9): calcolata a partire da tutti gli altri caratteri
4. **VIS** (posizioni 10-17): Vehicle Identifier Section (sezione identificativa del veicolo)

### Cifra di controllo

Ogni lettera viene convertita in un numero (A=1, B=2, ... escludendo I, O, Q). Ogni posizione ha un peso. La somma ponderata modulo 11 restituisce la cifra di controllo; il valore 10 è rappresentato da X.

`(w1×v1 + w2×v2 + ... + w17×v17) mod 11 = cifra di controllo`

Questo strumento verifica solo il formato e le regole della cifra di controllo. Non controlla l'effettiva immatricolazione del veicolo.
