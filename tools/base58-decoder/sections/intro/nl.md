## Waar deze tool voor is

Gebruik deze tool om Base58-strings of tekstbestanden direct in de browser terug
te decoderen naar hun oorspronkelijke bytes. Dat is handig wanneer je gegevens
uit API's, wallets, logs, QR-stromen of import- en exportstappen wilt
controleren zonder de inhoud naar een server te sturen.

## Wanneer je het alfabet moet wijzigen

Base58 heeft geen universeel alfabet. Bitcoin, Flickr en Ripple gebruiken
verschillende tekenvolgordes. Als een waarde de validatie niet haalt of wel
wordt gedecodeerd maar een verkeerd resultaat geeft, schakel dan over naar het
alfabet van het bronsysteem.

## Waar je op moet letten

Het resultaatpaneel toont een UTF-8-voorbeeld wanneer de gedecodeerde bytes als
tekst kunnen worden gelezen. Voor binaire gegevens of niet-tekstuele inhoud is
het veiliger om het .bin-bestand te downloaden en de originele bytes te
controleren. Spaties en regeleinden in geplakte invoer worden genegeerd, zodat
ook afgebroken waarden uit e-mails, documenten en terminals kunnen worden
gedecodeerd.
