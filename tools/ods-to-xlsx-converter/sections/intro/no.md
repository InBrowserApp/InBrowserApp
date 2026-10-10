## Konverter OpenDocument-regneark til Excel

Åpne eller slipp en lokal ODS-fil, se gjennom cellene og last ned en XLSX-arbeidsbok. Regnearkenes navn og rekkefølge, skjulte regneark, tekst, tall, boolske verdier, datoer, lagrede formelresultater og sammenslåtte celler tas med. Tomme regneark og mellomrom mellom celler bevares. Forhåndsvisningsvinduet begrenser ikke dataene som eksporteres.

## Lagrede verdier og kompatibilitet

Formler erstattes med sine lagrede verdier, ikke med Excel-formler. Celler uten lagrede resultater forblir tomme, og dette varsles. Nettleseren beregner ikke formler på nytt og oppdaterer ikke eksterne data. Feilresultater blir generelle regnearkfeil. Tekst forblir tekst, inkludert identifikatorer med innledende nuller, ikke-latinske tegn og tekst som begynner med et likhetstegn.

Datoer bruker et standardformat for dato og klokkeslett; datoer med eksplisitt tidssone konverteres til UTC. Varigheter forblir antall dager, og prosenter bruker et enkelt prosentformat. Valutaverdier beholder tallet, uten valutabetegnelsen eller den opprinnelige formateringen. Stiler, rad- og kolonnestørrelser, diagrammer, bilder, kommentarer, lenker, makroer og arbeidsbokinnstillinger gjengis ikke.

Krypterte filer, ugyldige arkiver, data som ikke støttes, og verdier eller regnearknavn utenfor Excels støttede grenser gir en tydelig feilmelding. Denne konvertereren godtar ikke Flat OpenDocument-filer (.fods). Kontroller viktige resultater i regnearkprogrammet ditt etter nedlasting.

## Lokal behandling

Konverteringen skjer i denne nettleseren uten at dokumentet lastes opp. Hvis du bytter eller lukker filen, fjernes det forrige resultatet som var klargjort for nedlasting; avbryting stopper bakgrunnsoppgaven. Det er ingen fast grense for filstørrelse eller antall regneark. Tilgjengelig nettleserminne avgjør fortsatt hvilke arbeidsbøker som kan behandles.

Åpne [Regnearkviser](../xlsx-viewer/) for å bla gjennom ODS og andre regnearkformater.
