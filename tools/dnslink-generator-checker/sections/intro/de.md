## DNSLink-TXT-Eintrag für IPFS erstellen

DNSLink verweist von einer Domain oder Subdomain auf einen Inhaltspfad. Geben Sie Ihre Domain ein und fügen Sie eine IPFS-CID, einen IPFS-Pfad oder einen IPNS-Pfad ein. Kopieren Sie den erzeugten **Namen** und den **TXT-Wert** in einen neuen TXT-Eintrag bei Ihrem DNS-Anbieter. Für die Domain `www.example.com` lautet der Eintragsname beispielsweise `_dnslink.www.example.com`. Wenn der DNS-Editor `example.com` automatisch anhängt, geben Sie `_dnslink.www` in das Namensfeld ein.

## DNSLink-Ziel prüfen

Wählen Sie **Veröffentlichten Eintrag prüfen**, um die TXT-Antworten von Cloudflare und Google anzuzeigen. Lassen Sie das Ziel leer, um eine bestehende Konfiguration abzufragen, oder geben Sie das gewünschte Ziel ein, um es mit dem veröffentlichten Wert zu vergleichen. Nach einer Änderung können Resolver einen älteren Wert liefern, bis ihr Cache-Eintrag abläuft. Die angezeigte TTL gibt an, wie lange die erhaltene DNS-Antwort im Cache bleiben kann.

## IPFS-Website auf einer eigenen Domain aktualisieren

Verwenden Sie eine IPFS-CID, um direkt auf eine feste Version Ihrer Dateien zu verweisen, oder einen IPNS-Pfad, um einem aktualisierbaren Namen zu folgen. DNSLink teilt kompatiblen Clients und Gateways mit, welcher Inhalt aufgelöst werden soll. Um diesen Inhalt unter Ihrer eigenen Domain per HTTPS bereitzustellen, konfigurieren Sie ein Gateway, das DNSLink unterstützt, und verweisen Sie mit Ihrer Domain darauf. [Eigene Domains und DNSLink in IPFS](https://docs.ipfs.tech/how-to/websites-on-ipfs/custom-domains/)
