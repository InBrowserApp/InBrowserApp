## Les tekst og logger lokalt

Åpne en .txt-, .text- eller .log-fil og les den med linjenumre, justerbar tekststørrelse, valgfri linjebryting og fokusert lesing. Hopp til en linje, gå til starten eller slutten, eller bruk Finn tekst for å søke i hele filen. Søket er ordrett og skiller mellom store og små bokstaver; neste og forrige fortsetter fra motsatt ende når du når filens slutt eller start.

## Store filer og lange linjer

Viseren viser én del om gangen for å gjøre store filer håndterlige. Alle delene er tilgjengelige, også fortsettelsen av svært lange linjer. Markering og nettleserens søkekommando gjelder den gjeldende delen; viserens Finn tekst søker i hele den dekodede filen, også etter treff som går på tvers av delene. Det er ingen fast grense for filstørrelse eller antall linjer. Tilgjengelig minne i nettleseren setter likevel en praktisk grense.

Tomme linjer, tabulatorer, blandede CRLF/CR/LF-linjeavslutninger og Unicode-tekst bevares. Linjeavslutninger vises som linjeskift. Oppmerking og escape-sekvenser for terminaler forblir uvirksom tekst. Noen kontrolltegn har ikke noe synlig tegnbilde; filer som inneholder NUL-tegn, får en merknad om binærfiler.

## Velg riktig tegnkoding

Automatisk modus gjenkjenner byteordensmerker for UTF-8 og UTF-16 og bruker ellers streng UTF-8. Du kan velge UTF-8, UTF-16 LE/BE, Windows-1252, Windows-1251, GB18030 eller Shift JIS. En dekodingsfeil stopper forhåndsvisningen i stedet for å erstatte uleselige tegn uten varsel. Prøv en annen tegnkoding hvis filen er uleselig eller ser feil ut; viseren kan ikke fastslå alle filers opprinnelige tegnkoding.

Filene behandles på enheten din uten opplasting, eksterne ressurser eller automatisk lagring. Når du lukker eller bytter en fil, frigjøres leseøkten. Viseren redigerer ikke filer, tolker ikke HTML eller terminalkommandoer og følger ikke en logg i sanntid.
