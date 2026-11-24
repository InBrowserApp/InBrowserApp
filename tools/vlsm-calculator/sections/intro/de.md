## IPv4-Subnetze mit VLSM planen

Gib einen übergeordneten Block in CIDR-Notation ein, zum Beispiel 192.168.10.0/24. Füge für jedes Netz eine Zeile hinzu und gib an, wie viele nutzbare Hostadressen es benötigt. Rechne dabei bei Bedarf die Gateway-Adresse und Reserven für spätere Erweiterungen ein. Der berechnete Plan zeigt für jedes Subnetz den zugewiesenen Netzblock, die Maske, den nutzbaren Adressbereich und die Broadcast-Adresse. Freie CIDR-Blöcke stehen für spätere Zuweisungen zur Verfügung.

Mit variablen Subnetzmasken (VLSM) lässt sich ein Netz in unterschiedlich große Subnetze aufteilen. Der Rechner wählt für jeden Bedarf den kleinsten passenden Block und vergibt die größten Blöcke zuerst, jeweils an gültigen CIDR-Grenzen. Bei einem Standard-Subnetz sind die Netzwerkadresse und die Broadcast-Adresse reserviert. Für 50 Hosts reicht zum Beispiel ein /26-Block mit 62 nutzbaren Adressen.

Wähle ein /31-Präfix nur für eine IPv4-Punkt-zu-Punkt-Verbindung, die zwei nutzbare Adressen unterstützt. Ein /32-Präfix weist eine einzelne Adresse zu, etwa für eine Loopback-Schnittstelle am Router. Beide Varianten haben keine Broadcast-Adresse. Die Berechnung läuft lokal im Browser, und die Subnetznamen bleiben dort.
