## Een DNSLink TXT-record voor IPFS genereren

DNSLink laat een domein of subdomein naar een contentpad verwijzen. Voer je domein in en plak een IPFS-CID of een IPFS- of IPNS-pad. Kopieer de gegenereerde **Naam** en **TXT-waarde** naar een nieuw TXT-record bij je DNS-provider. Voor het domein `www.example.com` is de recordnaam bijvoorbeeld `_dnslink.www.example.com`. Als de DNS-editor automatisch `example.com` toevoegt, voer je `_dnslink.www` in het naamveld in.

## Controleren waar je DNSLink naar verwijst

Selecteer **Gepubliceerd record controleren** om de TXT-antwoorden van Cloudflare en Google te bekijken. Laat het doel leeg om een bestaande configuratie op te zoeken, of voer het gewenste doel in om dit met de gepubliceerde waarde te vergelijken. Na een wijziging kunnen resolvers een oudere waarde teruggeven totdat hun cache verloopt. De weergegeven TTL is de tijd dat een ontvangen DNS-antwoord in de cache mag blijven.

## Een IPFS-website achter een eigen domein bijwerken

Gebruik een IPFS-CID om direct naar een vaste versie van je bestanden te verwijzen, of gebruik een IPNS-pad om een naam te volgen die kan worden bijgewerkt. DNSLink vertelt compatibele clients en gateways welke content ze moeten opzoeken. Om die content via je eigen HTTPS-domein aan te bieden, configureer je een gateway die DNSLink ondersteunt en laat je je domein daarnaar verwijzen. [IPFS-documentatie over eigen domeinen en DNSLink](https://docs.ipfs.tech/how-to/websites-on-ipfs/custom-domains/)
