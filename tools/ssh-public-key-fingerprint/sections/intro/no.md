## Hva er et SSH-fingeravtrykk for offentlig nøkkel?

Et SSH-fingeravtrykk for offentlig nøkkel er et kort sammendrag av bloben for den offentlige nøkkelen. Det gir deg en kompakt verdi du kan sammenligne før du stoler på en nøkkel i `authorized_keys`, en serveroversikt eller en utrullingsflyt.

OpenSSH viser ofte SHA-256-fingeravtrykk som `SHA256:...`. Eldre dokumentasjon og noen revisjoner bruker fortsatt kolonseparerte MD5-fingeravtrykk. Dette verktøyet viser begge, slik at du kan matche moderne SSH-utdata og eldre oppføringer uten å sende nøkkelen noe sted.

Lim inn én offentlig nøkkel, flere `authorized_keys`-linjer eller en SSH2-blokk med offentlig nøkkel. Parseren hopper over kommentarer og authorized_keys-alternativer, leser den ekte SSH-nøkkelbloben og beregner fingeravtrykkene lokalt i nettleseren din.

- Kontroller at en kopiert offentlig nøkkel samsvarer med fingeravtrykket en teamkamerat har delt.
- Sammenlign `authorized_keys`-oppføringer med en tilgangsliste for servere.
- Inspiser nøkkeltype, nøkkelstørrelse, kurve og kommentar før du kopierer et fingeravtrykk.
