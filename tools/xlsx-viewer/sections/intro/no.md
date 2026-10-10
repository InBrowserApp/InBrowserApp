## Bla gjennom regneark og tabeller i nettleseren

Åpne en lokal fil eller slipp den i viseren. Bytt mellom regneark, bla gjennom celler, juster zoomen og se innholdet i cellene. Excel-arbeidsbøker beholder den eksisterende leseopplevelsen. CSV- og TSV-filer vises som ett regneark; bruk Skilletegn og Tekstkoding for å korrigere automatisk gjenkjenning. Tekstkolonner bevarer innledende nuller, lange identifikatorer og datolignende strenger uendret. Bruk Eksporter regneark for å laste ned det gjeldende arket som CSV, TSV, JSON eller Markdown. Velg formatert tekst eller lagrede verdier før du forbereder eksporten.

Støttede formater omfatter Excel XLSX, XLSM, XLTX, XLTM, XLS og XLSB; CSV og TSV; ODS og FODS; Numbers 3.0 og nyere; kompatible WPS ET/ETT- og UOS-regneark; DIF, SLK, PRN og DBF; Lotus WK1/WK3/WK4/WKS/123; Quattro Pro WQ1/WQ2/WB1/WB2/WB3/QPW; Works XLR; og EtherCalc ETH. Kompatibiliteten avhenger av versjonen og funksjonene som brukes i hver fil. For eldre formater er hovedvekten på celledata fremfor å gjengi alle visuelle detaljer.

## Personvern og kompatibilitet

Filer behandles lokalt og blir ikke lastet opp eller lagret av dette verktøyet. Skrifter hentes fra enheten din; ingen skrifter hentes fra nettet. Formelceller viser lagrede resultater når de er tilgjengelige. Formler beregnes ikke på nytt, makroer kjøres aldri, eksterne datatilkoblinger oppdateres ikke, og dokumentlenker lastes ikke inn automatisk.

Numbers-tabeller vises som egne regnearkfaner, med opprinnelige ark- og tabellnavn der de er tilgjengelige. Eldre Numbers-dokumenter fra før Numbers 3 støttes ikke. Tilhørende memofiler for DBF lastes ikke inn. PRN bruker Lotus/Excel-oppsettet med fast kolonnebredde; vilkårlige utskriftsfiler støttes ikke. Diagrammer, tegninger, pivottabellfunksjoner, skrifter og noe formatering kan mangle i importerte formater. En merknad om kompatibilitet vises ved siden av dokumentet når disse begrensningene gjelder.

Det er ingen fast grense for filstørrelse eller antall ark. Nettleserens faktiske minnebegrensninger og sikkerhetsgrenser for utpakking av arkiver gjelder fortsatt for komplekse filer. Krypterte eller skadede arbeidsbøker kan ikke åpnes. Denne viseren redigerer ikke regneark og skriver dem ikke ut.

Regnearkeksport inkluderer skjulte rader og kolonner og bruker lagrede formelresultater. Manglende lagrede resultater blir tomme celler, regnearkfeil forblir synlige, og sammenslåtte celler utvides ikke. JSON beholder den første raden som data og bruker en liste av radlister med null for tomme celler. Markdown kan bruke den første raden som overskriftsrad. Formatert tekst følger støttede tallformater; lagrede datoer forblir Excel-serienumre. Diagrammer, bilder, kommentarer og formatering eksporteres ikke. For importerte formater gjenspeiler eksporten regnearkdataene som er tilgjengelige i denne viseren, og merknadene om kompatibilitet.

For en eldre XLS-arbeidsbok kan du bruke [XLS til XLSX-konverterer](../xls-to-xlsx-converter/) til å se gjennom de importerte dataene og laste ned en kopi i et moderne Excel-format. Konverteringen har egne merknader om kompatibilitet; åpne filen på nytt i konvertereren.

For å eksportere lokale Numbers-tabeller som Excel-regneark kan du bruke [Numbers til XLSX-konverterer](../numbers-to-xlsx-converter/).

For å eksportere OpenDocument-regnearkdata som en Excel-arbeidsbok kan du bruke [ODS til XLSX-konverterer](../ods-to-xlsx-converter/).
