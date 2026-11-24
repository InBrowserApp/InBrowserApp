## Generera en DNSLink TXT-post för IPFS

DNSLink låter en domän eller underdomän peka på en innehållssökväg. Ange din domän och klistra in en IPFS-CID eller en IPFS- eller IPNS-sökväg. Kopiera det genererade **Namnet** och **TXT-värdet** till en ny TXT-post hos din DNS-leverantör. Domänen `www.example.com` använder till exempel postnamnet `_dnslink.www.example.com`. Om DNS-editorn automatiskt lägger till `example.com` anger du `_dnslink.www` i namnfältet.

## Kontrollera vart din DNSLink pekar

Välj **Kontrollera publicerad post** för att se TXT-svaren från Cloudflare och Google. Lämna målet tomt för att slå upp en befintlig konfiguration, eller ange ditt avsedda mål för att jämföra det med det publicerade värdet. Efter en ändring kan resolvrar returnera ett äldre värde tills deras cacheminnen löper ut. Den visade TTL-tiden anger hur länge ett mottaget DNS-svar får ligga kvar i cacheminnet.

## Uppdatera en IPFS-webbplats bakom en egen domän

Använd en IPFS-CID för att peka direkt på en fast version av dina filer, eller använd en IPNS-sökväg för att följa ett namn som kan uppdateras. DNSLink anger för kompatibla klienter och gatewayservrar vilket innehåll som ska slås upp. För att tillhandahålla innehållet på din egen HTTPS-domän konfigurerar du en gateway som stöder DNSLink och låter domänen peka dit. [IPFS-dokumentation om egna domäner och DNSLink](https://docs.ipfs.tech/how-to/websites-on-ipfs/custom-domains/)
