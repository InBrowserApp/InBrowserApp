## What is an X.509 certificate parser?

Ett X.509-certifikat är ett signerat dokument som binder en publik nyckel till en identitet, till exempel en domän, tjänst, organisation eller person. TLS-certifikat, certifikatkedjefiler och många S/MIME- eller signeringsflöden använder detta format.

Den här parsern läser certifikat- och publik nyckel-material direkt i din webbläsare. Den kan granska PEM-block, binära DER-filer och base64 DER-text och sedan visa ämne, utfärdare, serienummer, giltighetsperiod, signaturalgoritm, algoritm för publik nyckel, fingeravtryck och vanliga tillägg.

Använd den när du behöver jämföra ett certifikats fingeravtryck, kontrollera om ett certifikat gäller den förväntade värden, granska Subject Alternative Names, bekräfta nyckelanvändning eller extrahera detaljer om publik nyckel vid felsökning av TLS- och distributionsproblem.

Verktyget validerar inte betrodda kedjor och kontaktar inte certifikatutfärdare. Det visar vad som är kodat i certifikatet eller den publika nyckel du anger, så använd en särskild TLS-skanner när du behöver validering av spärrstatus, kedja, värdnamn eller aktiv slutpunkt.

- Jämför SHA-256- eller SHA-1-fingeravtryck innan du installerar eller roterar certifikat.
- Granska SAN, nyckelanvändning, utökad nyckelanvändning och grundläggande begränsningar utan att ladda upp certifikatmaterial.
- Granska fristående SPKI-publika nycklar när en tjänst bara ger dig en PEM- eller DER-fil med publik nyckel.
