## Unicode-Domains in Punycode umwandeln und zurück

Fügen Sie eine Domain wie `bücher.com` unter **Unicode‑Domain** ein. Unter **ASCII‑Domain** erscheint `xn--bcher-kva.com`. Geben Sie eine `xn--`-Domain unter **ASCII‑Domain** ein, um den Namen in Unicode zu lesen. Beide Felder aktualisieren sich während der Eingabe und lassen sich einzeln kopieren.

## Wann welches Format sinnvoll ist

Punycode stellt Nicht-ASCII-Zeichen in internationalisierten Domainnamen (IDNs) mit ASCII-Buchstaben, Ziffern und Bindestrichen dar. Ein umgewandelter Domainbestandteil beginnt mit `xn--`. Reine ASCII-Bestandteile wie `com` bleiben unverändert. Verwenden Sie die ASCII-Fassung, wenn Ihre DNS- oder Hosting-Einstellungen danach fragen. Die Unicode-Fassung macht Domainnamen aus Protokollen und Konfigurationsdateien lesbar.

## Was in das Eingabefeld gehört

Geben Sie den Hostnamen ein. Für `https://bücher.com/catalog` geben Sie `bücher.com` ein. Subdomains funktionieren ebenfalls. So wird aus `www.bücher.com` der Name `www.xn--bcher-kva.com`.
