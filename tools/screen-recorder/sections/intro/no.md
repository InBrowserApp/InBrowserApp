# Skjermopptaker

Ta opp en skjerm, et vindu eller en fane valgt i nettleseren uten å laste opp
video til en server. Verktøyet bruker nettleserens Screen Capture- og
MediaRecorder-API-er, så opptaket forblir lokalt til du laster det ned.

## Når du bør bruke den

Bruk opptakeren til korte demoer, feilrapporter, gjennomganger, QA-notater eller
raske interne videoer der en lett nettleserflyt er nok. Du kan be nettleseren ta
med fane- eller systemlyd og eventuelt blande inn mikrofonen før opptaket
starter.

## Personvern og nettleserstøtte

Nettleseren avgjør hvilke opptakskilder og lydvalg som er tilgjengelige. Noen
nettlesere deler bare lyd fra den gjeldende fanen, noen krever HTTPS, og noen
støtter ikke pause eller opptak i det hele tatt. Hvis tillatelse avvises,
beholdes ingen strøm, og du kan prøve igjen med andre innstillinger.

## Tips for pålitelige opptak

Lukk andre opptaksøkter før du starter, velg den minste nyttige kilden, og gjør
en kort test når lyd er viktig. Last ned resultatet før du tømmer det, fordi
opptak bare holdes i den gjeldende sidesesjonen.
