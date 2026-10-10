## Konverter tekst med skilletegn til Excel

Åpne eller slipp en lokal CSV- eller TSV-fil, se gjennom cellene og last ned en XLSX-arbeidsbok med ett regneark som heter Sheet1. Velg skilletegn og tekstkoding hvis automatisk gjenkjenning ikke stemmer med filen. TSV-filer bruker tabulatorer som standard. Forhåndsvisningsvinduet begrenser ikke dataene som eksporteres.

## Bevar identifikatorer og opprinnelig tekst

CSV og TSV lagrer ikke datatyper for regnearkceller. Denne konvertereren beholder alle felt som tekst, inkludert innledende nuller, lange identifikatorer, tall som ser ut som desimaltall, datoer og tekst som begynner med et likhetstegn. Den tolker ikke felt som tall eller datoer og kjører ikke formler. Skilletegn i felt omsluttet av anførselstegn, anførselstegn skrevet med escape-sekvenser, Unicode, linjeskift inne i felt, tomme felt og tomme poster bevares. Kortere rader etterlater tomme celler. Et avsluttende linjeskift avslutter den siste posten i stedet for å legge til en ny rad.

Innstillingen for første rad tilbyr vanlige data eller en overskriftsrad med Excel-filtre. Begge beholder raden nøyaktig som skrevet, inkludert dupliserte eller tomme overskrifter. Automatisk tekstkoding støtter UTF-8 og UTF-16 med markør for byterekkefølge. Andre kodinger kan velges manuelt. En innledende sep=-instruksjon utelates bare når automatisk gjenkjenning av skilletegn er valgt, eller når skilletegnet i instruksjonen samsvarer med det valgte skilletegnet.

Felt med feil bruk av anførselstegn, ugyldig tekstkoding og data som overskrider Excels grenser for rader, kolonner eller tekst i celler, gir en feilmelding i stedet for en avkortet arbeidsbok. Kontroller viktige verdier i et regnearkprogram etter nedlasting.

## Lokal behandling

Konverteringen skjer i denne nettleseren uten at filen lastes opp. Hvis du endrer importinnstillinger, bytter eller lukker filen, fjernes det forrige resultatet. Avbryting stopper bakgrunnsoppgaven. Det er ingen fast grense for filstørrelse; tilgjengelig nettleserminne avgjør hvilke filer som kan behandles.

Åpne [Regnearkviser](../xlsx-viewer/) for å bla gjennom regnearkfiler.
