## Slik undersøker du en USB-enhet i nettleseren

Koble til enheten med en kabel som overfører data, velg **Velg enhet** og velg den i nettleserens WebUSB-dialog. Enhetskortet viser leverandør-ID (VID), produkt-ID (PID) og tilgjengelig identitetsinformasjon. USB-versjonen kommer fra enhetsdeskriptoren. Den faktiske tilkoblingshastigheten avhenger også av kabelen, porten og operativsystemet.

## Slik leser du konfigurasjoner, grensesnitt og endepunkter

Utvid en konfigurasjon for å se funksjonene som grensesnittene tilbyr. Et grensesnitt kan ha flere alternative innstillinger, hver med egen klasse, underklasse, protokoll og egne endepunkter. IN-endepunkter fører data til verten, og OUT-endepunkter fører data til enheten. Endepunkttypen og pakkestørrelsen beskriver hvordan endepunktet overfører data.

## Hva forteller tilgangskontrollen?

Velg **Kontroller tilgang** for å se om nettleseren kan åpne den valgte enheten. Kontrollen bruker enhetens håndtak og frigir det etterpå. Tilgang til grensesnitt kan fortsatt avhenge av operativsystemets driver eller et annet program. Inspektøren leser deskriptorer fra nettleseren og endrer ikke enhetsinnstillingene.

## Hvorfor kan jeg ikke se eller åpne USB-enheten?

Hvis enheten mangler i velgeren, prøv en datakabel og kontroller at operativsystemet gjenkjenner den. Hvis nettleseren nekter tilgang, kontroller nettstedets USB-tillatelse eller nettleserens retningslinjer. Hvis valget lykkes, men enheten ikke kan åpnes, lukk apper som kan bruke den, og kontroller driverkravene for enheten og plattformen. Noen USB-klasser er beskyttet av nettleseren. Se [Enhetsinformasjon](../device-information/) for funksjonene til denne nettleseren og dette systemet.
