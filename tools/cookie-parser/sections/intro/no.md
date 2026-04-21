## Hva Den Gjør

Dette verktøyet tolker rå Cookie- og Set-Cookie-headere til strukturert JSON direkte i nettleseren. Du kan lime inn én headerlinje, flere linjer eller bare verdier uten de vanlige prefiksene.

## Cookie Vs. Set-Cookie

En Cookie-header inneholder vanligvis flere navn/verdi-par som sendes av klienten. En Set-Cookie-header definerer vanligvis én cookie sammen med attributter som Path, Secure, HttpOnly, SameSite, Expires eller Max-Age.

## Merknader

Parseren kjører lokalt og laster ikke opp headere til en server. Ugyldige segmenter blir liggende i en egen liste slik at du raskt kan oppdage feilformede cookie-strenger.
