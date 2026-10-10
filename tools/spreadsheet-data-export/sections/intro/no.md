## Eksporter et regneark til et utvekslingsformat

Åpne en lokal .xlsx-, .xlsm-, .xltx- eller .xltm-fil, eller slipp den i eksportverktøyet. Velg et regneark etter det opprinnelige navnet, inkludert skjulte regneark, og velg CSV, TSV, JSON eller Markdown. Forhåndsvis resultatet, kopier det eller last ned en UTF-8-fil oppkalt etter arbeidsboken og regnearket. Hvis du bytter eller lukker filen, avbrytes uferdig arbeid, og tidligere nedlastinger fjernes. Regnearkviseren har også handlingen Eksporter regneark for det gjeldende arket.

Standard celleområde er det minste rektangelet som inneholder lagrede verdier eller formler. Tomme celler og rader innenfor dette rektangelet beholdes i resultatet. Du kan angi et annet område, for eksempel A1:D20, og velge Bruk område. Et tomt ark gir en tom tekstfil eller en tom JSON-liste med mindre du angir et område selv.

## Velg hvordan verdier og overskrifter vises

Formatert tekst følger støttede tallformater og bevarer viste datoer og tallformater med innledende nuller der dette er mulig. Formater som avhenger av regionale innstillinger, kan avvike fra Excel. Lagrede verdier beholder tall og boolske verdier; datoer forblir Excel-serienumre uten å få en tidssone. Tekstceller beholder teksten i begge modusene. Formler bruker de lagrede resultatene uten ny beregning. Et manglende lagret resultat blir en tom celle, med en merknad i grensesnittet. Regnearkfeil forblir lesbare strenger, for eksempel #DIV/0!.

CSV og TSV omslutter felt som inneholder skilletegn, anførselstegn eller linjeskift, med anførselstegn. JSON er en liste der hver rad er en egen liste: den første raden beholdes som data, dupliserte eller tomme overskrifter blir ikke objektnøkler, og tomme celler bruker null. Markdown kan bruke den første raden som overskriftsrad eller legge til en tom overskriftsrad over alle dataradene. Markdown-tegnsetting, HTML, loddrette streker og linjeskift i celler maskeres eller gjengis på en trygg måte. Nedlastinger bruker UTF-8 uten byteordensmerke; velg UTF-8 når du importerer til et annet program.

## Lokal behandling og kompatibilitet

Arbeidsboken forblir i denne nettleseren og blir ikke lastet opp eller lagret av verktøyet. Makroer og skript kjøres ikke, og eksterne datatilkoblinger oppdateres ikke. Skjulte rader og kolonner inkluderes i det valgte området. Sammenslåtte celler utvides ikke til gjentatte verdier. Diagrammer, bilder, kommentarer og arbeidsbokens formatering inngår ikke i disse tekstformatene.

Krypterte eller skadede arbeidsbøker og arbeidsbøker som ikke støttes, gir en tydelig feilmelding. Det er ingen faste grenser for filstørrelse eller antall regneark, rader eller kolonner, men en stor eksport kan overskride nettleserens minnekapasitet. Verktøyet eksporterer lagrede data; det redigerer ikke arbeidsboken og garanterer ikke at et annet regnearkprogram tolker felt med ren tekst på samme måte.
