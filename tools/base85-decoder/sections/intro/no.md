## Hvorfor Base85-dekoding er nyttig

Base85 dukker opp når binærdata må gjennom tekstbaserte systemer med mindre overhead enn heksadesimal eller Base64. Du kan møte det i PostScript- eller PDF-strømmer, ZeroMQ Z85-payloads, feilsøkingsfangster, arkiverte eksporter og verktøy som trenger utskrivbare tegn i stedet for rå binære byte.

## Hva denne dekoderen hjelper med

Dette verktøyet gjør ASCII85- eller Z85-tekst om til de opprinnelige bytene direkte i nettleseren. Du kan lime inn kodede data, importere en fil, bytte alfabet for å matche kildesystemet, forhåndsvise det dekodede resultatet og laste ned den gjenopprettede binærfilen uten å sende noe til en server.

## Hva du bør huske på

- ASCII85 og Z85 kan ikke brukes om hverandre. Å velge feil alfabet fører vanligvis til dekodefeil eller ødelagt utdata.
- Base85 er et kodingsformat, ikke kryptering. Det dekodede resultatet kan være ren tekst, komprimert innhold eller vilkårlige binærdata.
- Z85 krever komplette grupper på 5 tegn, mens ASCII85 også kan inneholde skilletegn og forkortelser som `z` for nullblokker.
