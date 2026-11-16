## Hva er en X.509-sertifikatparser?

Et X.509-sertifikat er et signert dokument som knytter en offentlig nøkkel til en identitet, for eksempel et domene, en tjeneste, en organisasjon eller en person. TLS-sertifikater, sertifikatkjedefiler og mange S/MIME- eller signeringsarbeidsflyter bruker dette formatet.

Denne parseren leser sertifikat- og offentlig nøkkel-materiale direkte i nettleseren. Den kan inspisere PEM-blokker, binære DER-filer og base64 DER-tekst, og deretter vise innehaver, utsteder, serienummer, gyldighetsperiode, signaturalgoritme, algoritme for offentlig nøkkel, fingeravtrykk og vanlige utvidelser.

Bruk den når du må sammenligne et sertifikatfingeravtrykk, sjekke om et sertifikat er for forventet vert, inspisere alternative innehavernavn, bekrefte nøkkelbruk eller hente ut detaljer om offentlig nøkkel mens du feilsøker TLS- og distribusjonsproblemer.

Verktøyet validerer ikke tillitskjeder og kontakter ikke sertifikatutstedere. Det viser hva som er kodet i sertifikatet eller den offentlige nøkkelen du oppgir, så bruk en dedikert TLS-skanner når du trenger validering av tilbakekalling, kjede, vertsnavn eller live-endepunkt.

- Sammenlign SHA-256- eller SHA-1-fingeravtrykk før du installerer eller roterer sertifikater.
- Gå gjennom SAN, nøkkelbruk, utvidet nøkkelbruk og grunnleggende begrensninger uten å laste opp sertifikatmateriale.
- Inspiser frittstående SPKI offentlige nøkler når en tjeneste bare gir deg en offentlig nøkkel som PEM- eller DER-fil.
