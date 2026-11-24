## NFT-Metadaten im JSON-Format vor dem Minting validieren

Wählen Sie **Lokale Dateien**, um einzelne JSON-Dateien oder einen Sammlungsordner auf Ihrem Gerät zu prüfen. Das Tool meldet für jeden Eintrag ungültiges JSON und häufige Metadatenprobleme wie leere Namen, fehlende Bilder, ungültige Beschreibungen und fehlerhafte Attribute. Mit **Prüfung nötig** finden Sie die Einträge, die Sie korrigieren sollten. Den vollständigen Bericht können Sie als JSON herunterladen.

## Token-URIs stapelweise prüfen

Fügen Sie unter **Token-URIs** eine Metadatenadresse pro Zeile ein. Verwenden Sie für nummerierte Sammlungen unter **URI-Muster** einen Platzhalter wie `https://example.com/metadata/{id}.json`. Geben Sie die erste und letzte ID an, um den gesamten Bereich einschließlich beider Grenzen zu prüfen. Das Dezimalformat verwendet die ID wie eingegeben. **ERC-1155 (hexadezimal)** stellt jede ID mit 64 kleingeschriebenen Hexadezimalzeichen und führenden Nullen dar, wie es die `{id}`-Ersetzung in ERC-1155 vorsieht.

## Links zu NFT-Bildern und -Animationen prüfen

Aktivieren Sie **Medienverfügbarkeit prüfen**, um Links in `image` und `animation_url` zu prüfen. Wählen Sie den gesamten lokalen Ordner aus, um Medien mit relativen Pfaden einzubeziehen. Der Browser kann auch HTTP-, IPFS- und Arweave-Ressourcen prüfen. Ein Gateway-Fehler, eine Zeitüberschreitung oder eine Cross-Origin-Beschränkung kann verhindern, dass ein Link bestätigt wird. Prüfen Sie solche Links in dem Gateway oder auf dem Marktplatz, den Sie verwenden. Lokale Dateien werden im Browser geprüft. Für URI-Prüfungen kontaktiert der Browser den zuständigen Host oder das Gateway.

Erläuterungen zu den Feldern und zur Ersetzung in Token-URIs finden Sie im [OpenSea-Metadatenleitfaden](https://docs.opensea.io/docs/metadata-standards) und in der [ERC-1155-Metadatenspezifikation](https://eips.ethereum.org/EIPS/eip-1155#metadata).
