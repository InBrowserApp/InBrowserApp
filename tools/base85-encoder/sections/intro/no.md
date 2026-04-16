## Hva er Base85?

Base85 er en binær-til-tekst-koding som gjør om 4 byte til 5 utskrivbare tegn. Den er tettere enn Base64, og dette verktøyet lar deg velge mellom ASCII85 og Z85 avhengig av formatet mottakeren forventer.

## Når bør du bruke det?

- Når du vil kode råbyte, tekst eller filer for tekstbaserte kanaler og samtidig holde utdataene relativt kompakte.
- Bruk ASCII85 når du trenger et fleksibelt Base85-format som kan håndtere delvise byte på slutten.
- Bruk Z85 når du trenger ZeroMQ-kompatibel Base85-tekst og inndatalengden er et eksakt multiplum av 4 byte.

## Hva bør du huske på?

- Base85 er et kodingsformat, ikke kryptering.
- ASCII85 og Z85 bruker ulike alfabeter og kan derfor ikke byttes om fritt.
- Z85 avviser data der byte-lengden ikke er delelig med 4, mens ASCII85 kan kode delvise sluttblokker.
