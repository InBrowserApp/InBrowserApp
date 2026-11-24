## Een geaggregeerd DMARC-rapport lezen

Open de bijlage van een geaggregeerd rapport dat naar het `rua`-adres in je DMARC-record is gestuurd. De viewer accepteert XML, GZIP en ZIP-bestanden met één XML-rapport. Je kunt ook XML plakken of het voorbeeld laden. Het rapportoverzicht toont wie het rapport heeft verstuurd, de periode in UTC en het gepubliceerde beleid van het domein. Je browser verwerkt de bestanden en geplakte tekst.

## Wat de aantallen berichten betekenen

Elke bronregel groepeert berichten met hetzelfde bron-IP-adres en hetzelfde beoordelingsresultaat. Een regel kan meer dan één bericht vertegenwoordigen en hetzelfde IP-adres kan in meerdere regels voorkomen. De totalen zijn gebaseerd op het aantal berichten per regel. Een bericht slaagt voor DMARC als SPF of DKIM slaagt én het bijbehorende domein op het zichtbare From-domein is afgestemd. De viewer telt een bericht alleen als mislukt wanneer beide afstemmingscontroles mislukken. Bij onvolledige afstemmingsgegevens staat het resultaat op onbekend.

## Waarom domeinafstemming, authenticatie en toegepaste maatregelen verschillen

Klap Oorspronkelijke authenticatieresultaten open om de gerapporteerde domeinen, resultaten en DKIM-selectors te bekijken. Een SPF- of DKIM-controle kan slagen voor een ander domein terwijl de domeinafstemming voor DMARC mislukt. De toegepaste maatregel geeft aan hoe de ontvanger een groep berichten heeft verwerkt. Die maatregel kan afwijken van het gepubliceerde beleid als de ontvanger een uitzondering toepast. Filter op bron-IP of From-domein om een afzender te bekijken. De totalen blijven gelijk.

## Welke DMARC XML-formaten worden ondersteund

De viewer leest geaggregeerde rapporten volgens RFC 9990, inclusief de bijbehorende DMARC-naamruimte, en oudere rapporten volgens RFC 7489. RFC 9990 beschrijft het XML-formaat voor de samenvatting van authenticatie en toegepaste maatregelen in geaggregeerde rapporten. Bundelt je mailsysteem meerdere rapporten in één archief? Pak het gewenste rapport uit en open het afzonderlijk.
