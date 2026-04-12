## Vad verktyget ar till for

Anvand det har verktyget for att jamfora enhetens klocka med en tid som hamtas
fran natverket. Det laster ett tidsstampel fran Cloudflares trace-endpoint,
uppskattar mittpunkten i latenstiden och visar sedan natverkstiden i
webblasaren.

## Nar det ar hjalpsamt

- For att kontrollera om den lokala systemklockan gar for fort eller for sakta.
- For att bekrakta tidsdrift innan du felsoker TLS, token, schemalaggare eller
  loggar.
- For att snabbt fa en natverksbaserad referenstid utan att installera
  NTP-verktyg.

## Saker att ha i atanke

- Offseten som visas ar en uppskattning och beror pa natverkslatens.
- Om trace-begaran misslyckas faller verktyget tillbaka till den lokala klockan
  tills nasta lyckade synkronisering.
- For en exakt systemomfattande korrigering bor du justera enhetens
  tidssynkronisering eller NTP-konfiguration.
