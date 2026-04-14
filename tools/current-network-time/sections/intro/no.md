## Hva dette verktoyet er for

Bruk dette verktoyet for a sammenligne klokken pa enheten din med en tid som
hentes fra nettverket. Det henter et tidsstempel fra Cloudflares
trace-endepunkt, anslar midtpunktet i foresporselslatensen og viser deretter
nettverksklokken i nettleseren.

## Nar det hjelper

- A sjekke om den lokale systemklokken din gar for fort eller for sakte.
- A bekrefte tidsdrift for du feilsoker TLS, token, planleggere eller logger.
- A fa en rask nettverksbasert referansetid uten a installere NTP-verktoy.

## Hva du bor passe pa

- Offseten som vises er et anslag og avhenger av nettverkslatens.
- Hvis trace-foresporselen mislykkes, faller verktoyet tilbake til den lokale
  klokken til neste vellykkede synkronisering.
- For en presis korrigering pa systemniva bor du justere enhetens
  tidssynkronisering eller NTP-konfigurasjon.
