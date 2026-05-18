## Hva dette verktøyet konverterer

Denne konvertereren behandler en UUID som den 128-biters verdien den faktisk er,
og holder de vanlige representasjonene synkronisert. Lim inn en UUID,
Base64-verdi, heksadesimal streng, desimalt heltall, oktal verdi eller binær
verdi, så oppdateres de andre formatene lokalt i nettleseren.

## Slik leser du formatene

UUID-feltet viser den kanoniske formen med bindestreker. Heksadesimal er de
samme 16 bytene som 32 heksadesimale sifre med små bokstaver. Base64 er standard
utfylt Base64 for de rå 16 bytene, ikke Base64 for teksttegnene i UUID-en.
Desimal, oktal og binær viser UUID-en som ett usignert 128-biters heltall; den
binære utdataen venstreutfylles til alle 128 bitene, slik at innledende nuller
forblir synlige.

## Hva du bør passe på

Verdier utenfor UUID-ens 128-biters område avvises. Base64-inndata må dekodes
til nøyaktig 16 byte. Konvertereren godtar vanlige innlimte varianter som
UUID-er med store bokstaver, `urn:uuid:`-prefikser, klammer, kompakte UUID-er
med 32 heksadesimale tegn, mellomrom rundt lange numeriske verdier og URL-sikker
Base64. Ingenting lastes opp mens du konverterer eller genererer eksempel-UUID-en.
