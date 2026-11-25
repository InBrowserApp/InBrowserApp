## Look up a Filecoin storage deal by Deal ID

Enter the numerical **Deal ID** for a Filecoin mainnet Storage Market deal, then select **Look up deal**. **Try an example** loads an actual public record so you can see the status, provider, client, dates, and Piece CID. This lookup covers Storage Market deals. Filecoin Onchain Cloud uses a separate data set ID.

## How to read Filecoin deal status

An active deal has a recorded activation and its scheduled end is still ahead. Pending means the deal is awaiting activation through its scheduled start epoch. The lookup also displays cases where the start has passed without activation, the deal has expired, or the market state records that it was slashed. Start and end epochs come from the deal proposal. Their UTC dates are calculated from the chain's epoch schedule.

## Compare the deal's Piece CID with your file

The Piece CID is the commitment recorded for the Filecoin piece. Copy it to compare it with a commitment computed from your local file or CAR using the Filecoin Piece CID Calculator. The result also shows the padded piece size, which is measured after Filecoin piece padding. A verified deal carries the Filecoin Plus verification flag.

## Find older Filecoin deals

The browser first queries current Filecoin mainnet market state. After a record leaves that state, the viewer can show the original terms indexed by Filfox and marks them as a historical record. Those terms include planned dates and parties. **View on Filfox** opens the explorer for the same Deal ID.

See the [Filecoin Storage Market RPC reference](https://docs.filecoin.io/reference/json-rpc/state#statemarketstoragedeal) for the fields returned by the chain.
