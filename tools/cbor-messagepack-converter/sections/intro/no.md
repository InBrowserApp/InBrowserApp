## Undersøk binære API-data

CBOR og MessagePack er kompakte binære serialiseringsformater for strukturerte data. Bruk denne konvertereren til å undersøke API-svar, WebSocket-meldinger eller hurtigbufrede verdier som JSON, eller opprett binære data fra JSON for feilsøking. Alt behandles i nettleseren; inndata lastes ikke opp eller lagres.

## Kod JSON eller dekod byte

Velg binært format og konverteringsretning. For å kode skriver du inn JSON og velger Hex, Base64 eller Base64URL for resultatet. For å dekode limer du inn byte og velger inndatakodingen. Hvis du endrer inndatakodingen, tolkes teksten som allerede står i redigeringsfeltet på nytt.

Åpne en JSON-fil ved koding, eller en rå `.cbor`-, `.msgpack`- eller `.bin`-fil ved dekoding. Kodet tekst som Hex eller Base64 skal limes inn i redigeringsfeltet. Konverter, og kopier deretter den viste teksten eller last ned resultatet. Binære nedlastinger inneholder de faktiske bytene og kan importeres på nytt.

## Bevar verdier og forstå begrensningene

Heltallsliteraler beholder alle sifre innenfor formatets støttede 64-bitsområde. Verdier som JSON ikke kan representere, for eksempel binære felt, CBOR-tagger og MessagePack-utvidelser, vises som eksplisitte typede omslagsobjekter. Aktiver utvidet JSON for å kode disse omslagsobjektene tilbake til binærdata; la det være av for vanlige JSON-objekter som tilfeldigvis bruker omslagsnøkler.

Med utvidet JSON aktivert koder for eksempel `{"id":{"$integer":"9007199254740993"},"data":{"$binary":"AQI="}}` et nøyaktig heltall og to binære byte.

Hver konvertering håndterer én verdi, med en inndatagrense på 1 MiB. Formaterte JSON-byte teller den viste JSON-teksten med innrykk, ikke de opprinnelige inndataene. Ny koding bevarer støttede verdier, men kan endre kartrekkefølgen eller valget av binærkoding. Åpne «Formater og bevaring av typer» ovenfor for omslagssyntaks og typer som ikke støttes.
