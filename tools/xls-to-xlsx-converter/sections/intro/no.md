## Konverter eldre Excel-arbeidsbøker i nettleseren

Åpne eller slipp en lokal XLS-fil. Velg et regneark, se gjennom celledataene og last ned en XLSX-arbeidsbok. Du kan bla i forhåndsvisningen eller angi adressen til den øverste venstre cellen for å gå til et annet område. Forhåndsvisningsvinduet begrenser ikke eksporten: alle regneark og deres importerte celler inkluderes.

Navn og rekkefølge på regneark, tomme ark, arkenes skjultstatus, tekst, tall, boolske verdier, regnearkfeil, støttede tallformater, sammenslåtte celler, radhøyder, kolonnebredder og skjulte rader og kolonner bevares så langt parseren for kildefilen støtter dem. Tekstidentifikatorer beholder innledende nuller. Datoer beholder Excel-serienumre og arbeidsbokens datosystem.

## Formler og kompatibilitet

Støttede formeluttrykk og lagrede resultater bevares. Nettleseren beregner ikke formler på nytt og oppdaterer ikke eksterne data. En formel uten lagret resultat vises med en merknad i forhåndsvisningen; uttrykket beholdes i resultatfilen slik at et regnearkprogram kan beregne det. Formeluttrykk som ikke støttes, eller eksterne referanser blir kanskje ikke bevart riktig under konverteringen.

Dette er en datakonvertering, ikke en nøyaktig gjengivelse av alle funksjonene i arbeidsboken. Diagrammer, bilder, makroer, pivottabellfunksjoner og avansert formatering bevares ikke. Forhåndsvisningen gjengir ikke oppsettet til sammenslåtte celler eller formatering. Kontroller den nedlastede arbeidsboken i regnearkprogrammet ditt, særlig når formler eller oppsett er viktige. Makroark, diagramark, krypterte filer, skadede filer og filer som bare har fått endret filendelsen til .xls, støttes ikke.

## Lokal behandling

Arbeidsboken behandles i denne nettleseren uten at innholdet lastes opp. Makroer kjøres ikke, og tilknyttede ressurser hentes ikke. Når du bytter eller lukker arbeidsboken, forkastes resultatet; avbryting stopper konverteringen. Det er ingen fast grense for filstørrelse eller antall regneark, men behandlingen av store arbeidsbøker avhenger fortsatt av tilgjengelig minne i nettleseren.

Åpne [Regnearkviser](../xlsx-viewer/) for å bla gjennom andre regnearkformater.
