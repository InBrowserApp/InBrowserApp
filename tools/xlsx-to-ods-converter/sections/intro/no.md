## Konverter Excel-arbeidsbøker til OpenDocument

Åpne eller slipp en lokal XLSX-fil, se gjennom cellene og last ned en ODS-arbeidsbok. Regnearkenes navn og rekkefølge, tomme og skjulte regneark, celleposisjoner, tekst, tall, boolske verdier, datoer og lagrede formelresultater tas med. Forhåndsvisningsvinduet begrenser ikke dataene som eksporteres. Svært skjulte regneark blir vanlige skjulte regneark.

## Lagrede verdier og kompatibilitet

Formler erstattes med sine lagrede verdier. Celler uten lagrede resultater forblir tomme, og dette varsles. Nettleseren beregner ikke formler på nytt og oppdaterer ikke eksterne data. Regnearkfeil blir ren tekst. Identifikatorer med innledende nuller, ikke-latinske tegn og bokstavelig tekst som begynner med et likhetstegn, forblir tekst.

Datoer tar hensyn til arbeidsbokens 1900- eller 1904-datosystem og bruker et standardformat for dato og klokkeslett. Verdier med bare klokkeslett og varigheter bruker et enkelt varighetsformat. Prosent- og valutaverdier beholder tallet, uten den opprinnelige formateringen eller valutabetegnelsen. Den fiktive Excel-datoen 29. februar 1900 og egendefinerte datoformater som ikke støttes, gir en feil i stedet for en forskjøvet dato.

Stiler, rad- og kolonnestørrelser, oppsettet til sammenslåtte celler, diagrammer, bilder, kommentarer, lenker, makroer og arbeidsbokinnstillinger gjengis ikke. Lagrede verdier i sammenslåtte områder blir værende i sine opprinnelige celleposisjoner. Denne konvertereren godtar XLSX, ikke XLS, XLSB eller XLSM. Krypterte filer, ugyldige arkiver, arktyper som ikke støttes, og data som ikke kan representeres i ODS, gir en tydelig feilmelding. Kontroller viktige resultater i regnearkprogrammet ditt etter nedlasting.

## Lokal behandling

Konverteringen skjer i denne nettleseren uten at dokumentet lastes opp. Hvis du bytter eller lukker filen, fjernes det forrige resultatet som var klargjort for nedlasting; avbryting stopper bakgrunnsoppgaven. Det er ingen fast grense for filstørrelse eller antall regneark. Tilgjengelig nettleserminne avgjør fortsatt hvilke arbeidsbøker som kan behandles.

Åpne [Regnearkviser](../xlsx-viewer/) for å bla gjennom Excel og andre regnearkformater.
