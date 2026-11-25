## Sök ett Filecoin-lagringsavtal med Deal ID

Ange numeriskt **Deal ID** för ett Storage Market-avtal på Filecoins huvudnät och välj sedan **Sök avtal**. **Prova ett exempel** laddar en verklig offentlig post så att du kan se status, leverantör, kund, datum och Piece CID. Sökningen omfattar Storage Market-avtal. Filecoin Onchain Cloud använder ett separat datamängds-ID.

## Så läser du statusen för ett Filecoin-avtal

Ett aktivt avtal har en registrerad aktivering och dess planerade slut ligger fortfarande i framtiden. Väntar innebär att avtalet inväntar aktivering före planerad start. Sökningen visar även fall där starten har passerat utan aktivering, avtalet har löpt ut eller marknadstillståndet registrerar att det har straffats. Start- och slutepoker kommer från avtalsförslaget. UTC-datumen beräknas utifrån kedjans epokschema.

## Jämför avtalets Piece CID med din fil

Piece CID är det registrerade åtagandet för Filecoin-piece. Kopiera det för att jämföra med ett åtagande som beräknats från din lokala fil eller CAR med Filecoin Piece CID-kalkylatorn. Resultatet visar även utfylld piece-storlek, som mäts efter Filecoins piece-utfyllnad. Ett verifierat avtal har verifieringsflaggan Filecoin Plus.

## Hitta äldre Filecoin-avtal

Webbläsaren frågar först det aktuella marknadstillståndet på Filecoins huvudnät. När en post har lämnat det tillståndet kan visaren visa de ursprungliga villkor som Filfox indexerat och markera dem som en historisk post. Villkoren omfattar planerade datum och parter. **Visa på Filfox** öppnar blockutforskaren för samma Deal ID.

Se [Filecoin Storage Markets RPC-referens](https://docs.filecoin.io/reference/json-rpc/state#statemarketstoragedeal) för fälten som kedjan returnerar.
