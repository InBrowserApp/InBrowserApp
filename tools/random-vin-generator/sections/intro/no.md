## Generer tilfeldige VIN-er til testing

Sett antallet fra `1` til `1000`, og velg **Generer**. Hver linje inneholder ett kjøretøyidentifikasjonsnummer (VIN) på 17 tegn. Velg **Kopier alle** for å lime inn numrene i et testskjema eller regneark, eller **Last ned TXT** for å lagre en tekstfil med én VIN per linje.

## Les VIN og kontrollsifferet

De tre første tegnene utgjør produsentidentifikatoren. Tegn fire til åtte beskriver kjøretøyet, og det niende tegnet er kontrollsifferet. De siste åtte tegnene utgjør kjøretøyidentifikasjonsdelen. Bokstavene `I`, `O` og `Q` utelates for å unngå forveksling med sifre. Kontrollsifferet beregnes fra de andre 16 tegnene og kan være et siffer fra `0` til `9` eller `X`. I `1M8GDM9AXKP042788` er for eksempel det niende tegnet `X`.

## Bruk en VIN som eksempel i testdata

Bruk de genererte VIN-ene til å teste obligatoriske felt, masseimport eller validering av format og kontrollsiffer. For å teste avvisning kan du endre bare det niende tegnet til et annet siffer og sende inn verdien på nytt. Generatoren lager syntetiske VIN-er, så felt som ser ut som en produsent, årsmodell eller et serienummer, må behandles som eksempeldata. For registrering, delesøk eller kjøretøyhistorikk må du bruke VIN-en som står på kjøretøyet eller i dokumentene.
