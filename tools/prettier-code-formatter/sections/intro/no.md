## Hva er Prettier-kodeformatterer?

Prettier-kodeformatterer kjører den offisielle Prettier-standalone-pipelinen
direkte i nettleseren, slik at du kan normalisere kildefiler uten å sende kode
til en server. Det er nyttig når du vil ha en rask formateringsrunde, vil
sammenligne ulike linjelengdevalg, eller trenger en ren fil du kan kopiere
eller laste ned med en gang.

## Støttede formater

Denne nyversjonen holder verktøyet fokusert på formatene Prettier allerede håndterer godt i nettleseren: JavaScript, JSX, TypeScript, TSX, Flow, JSON-varianter, HTML, XML, CSS, PostCSS, SCSS, Less, Markdown, MDX, YAML, GraphQL og malformater som Angular, Vue, Svelte, LWC, MJML og Handlebars. Språkvelgeren styrer hvilken parser som kjøres, og når du importerer en fil, forsøker verktøyet å oppdage parseren automatisk når filendelsen gjenkjennes.

## Slik fungerer nyversjonen

Nyversjonen holder tung formateringslogikk utenfor hovedflyten i UI-et.
Formateringsforespørsler bygges fra ren, lokal verktøykonfigurasjon og kjøres
deretter gjennom en tregt lastet, worker-basert Prettier-pipeline, slik at
vanlig skriving forblir responsiv. Store inndata setter automatisk formatering
på pause og bytter til en eksplisitt `Formater nå`-handling, som er mer
forutsigbar enn å prøve å formatere en stor fil på hvert tastetrykk.
