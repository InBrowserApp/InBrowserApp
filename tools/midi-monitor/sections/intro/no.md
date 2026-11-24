## Slik kobler du til et MIDI-keyboard eller en kontroller

Koble til en MIDI-enhet og kontroller at operativsystemet gjenkjenner den. Velg **Aktiver MIDI**, gi nettleseren MIDI-tilgang hvis du blir bedt om det, og velg en inngang. Bruk en kompatibel nettleser og åpne siden over HTTPS. Monitoren mottar meldinger fra den valgte inngangen og viser dem lokalt.

## Slik tester du noter og anslagsstyrke

Trykk på en tangent eller en pad og følg med på klaviaturet og meldingsloggen. Note On viser noten og anslagsstyrken, vanligvis en verdi fra 1 til 127. Note Off eller Note On med anslagsstyrke 0 frigjør noten. Klaviaturet viser MIDI-note 60 som C4. Endre startoktaven for å se et annet område. Holdte noter vises også når de ligger utenfor området som vises på klaviaturet.

## Slik undersøker du CC, pitch bend og MIDI-klokke

Flytt på en dreieknapp, en skyveknapp eller en pedal for å se Control Change-nummeret (CC) og verdien. Mange sustain-pedaler sender for eksempel CC 64. Pitch bend vises med en senterverdi på 0. MIDI-klokkepulser telles separat fra meldingsloggen. En standard MIDI-klokke sender 24 pulser per firedelsnote. Loggen inneholder kanalnumre og rå heksadesimale byte, slik at du kan undersøke enkeltmeldinger.

## Hvorfor reagerer ikke MIDI-inngangen min?

Kontroller kabelen, strømtilførselen og enhetsmodusen, og forsikre deg om at den valgte porten tilhører kontrolleren. Lukk andre apper som kan bruke inngangen, og koble den til på nytt. Støtten avhenger av nettleseren og operativsystemet. Dette verktøyet mottar standard MIDI-meldinger med vanlig MIDI-tilgang. Enhetsspesifikke System Exclusive-meldinger (SysEx) krever ekstra tillatelse.
