## Undersøk frekvensene i en lydfil

Bruk spektrumanalysatoren til å finne lavfrekvent brum, sammenligne frekvensinnhold eller se hvor de høye frekvensene faller bort i et opptak. Grafen viser frekvens i hertz (Hz) og nivå i desibel i forhold til digital fullskala (dBFS). Toppene viser hvilke frekvensbånd som har mest energi i opptaket.

## Slik viser du et lydspekter

1. Velg en mono- eller stereofil i WAV, MP3, M4A, FLAC eller OGG, eller dra den inn i verktøyet. Hvilke formater som kan dekodes, avhenger av nettleseren.
2. Se etter den dominerende frekvensen, og pek eller trykk på grafen for å lese av en annen frekvens og nivået der. Med glidebryteren kan du lese av de samme verdiene med tastaturet.
3. Bytt mellom logaritmisk og lineær skala ved behov. Spill av originalfilen for å høre opptaket mens du undersøker grafen. Analyse og avspilling skjer på enheten din.

## Slik leser du FFT-grafen

Verktøyet dekoder lyd ved 48 kHz og analyserer korte utdrag fordelt over filen med en rask Fourier-transformasjon (FFT). Utdragene vektes med et Hann-vindu før analysen. Verktøyet beregner gjennomsnittlig effekt og kombinerer stereokanalene etter effekt, slik at lyder med faseforskjell mellom kanalene fortsatt vises. Grafen går opp til 24 kHz. Nivåene gjelder hvert frekvensbånd i FFT-resultatet og skiller seg dermed fra samlet lydnivå, høyeste sampleverdi og integrert lydstyrke i LUFS.

En markert topp rundt 50 eller 60 Hz kan tyde på elektrisk brum. Et brått fall ved høye frekvenser kan skyldes filtrering eller komprimering. En enkelt topp kan være en overtone. Sjekk toppene i nærheten før du bruker den til å fastslå tonehøyden.

## Når bør jeg velge logaritmisk eller lineær skala?

En logaritmisk skala gir mer plass til bass og mellomtone og gjør det lettere å følge oktavene. På en lineær skala er avstanden den samme for like store endringer i Hz. Det er praktisk når du sammenligner overtoner med jevn avstand. Grafen oppsummerer frekvensinnholdet i hele opptaket. Et spektrogram viser når en lyd oppstår, eller hvordan frekvensen endrer seg over tid.
