## Hva er Argon2-verifisering?

Argon2-verifisering kontrollerer om et rent passord produserer den samme kodede Argon2 hashen som ble lagret tidligere. Den kodede hashen inneholder Argon2-varianten, kostnadsparametere, salt og digest, slik at en verifikator kan gjenta det samme arbeidet uten egne innstillinger.

## Når bør du bruke dette verktøyet

- Bekreft at et kopiert passord og en lagret Argon2 hash hører sammen
- Feilsøk innloggings- eller migreringsproblemer når passordposter flyttes mellom systemer
- Inspiser varianten og kostnadsparameterne i en kodet Argon2 hash
- Test hasher som bruker en valgfri hemmelighet på serversiden, ofte kalt en pepper

## Slik verifiserer du trygt

1. Lim inn passordet du vil kontrollere.
2. Lim inn hele den kodede hashen, for eksempel en streng som begynner med `$argon2id$`.
3. Skriv bare inn hemmeligheten hvis den opprinnelige hashen ble laget med en.
4. Kjør verifiseringen og les resultatet for samsvar, manglende samsvar eller ugyldig hash.

## Sikkerhetsmerknader

Verifiseringen skjer lokalt i nettleseren din, men innlimte passord og hasher kan fortsatt bli liggende i nettleserminnet til du tilbakestiller skjemaet eller lukker fanen. Unngå å bruke produksjonslegitimasjon på delte enheter. For nye systemer for passordlagring er Argon2id vanligvis den foretrukne Argon2-varianten fordi den balanserer motstand mot sidekanaler og GPU-er.
