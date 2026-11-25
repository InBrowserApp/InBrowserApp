## Estimate Filecoin Onchain Cloud storage costs

Enter the data size, **Retention (days)**, and number of **Copies**. The calculator estimates the cost of storing a new data set per copy with Filecoin Warm Storage Service. It shows the monthly storage and proving rate, spending for the selected term, and fees for creating the data sets and adding pieces. Amounts are denominated in USDFC. Filecoin's pricing month is 30 days.

## How the storage estimate is calculated

Each active data set pays a size-based storage rate plus a flat fee for Proof of Data Possession (PDP). For example, with a storage rate of 2.50 USDFC per TiB and a proving fee of 0.12 USDFC per copy, one TiB with two copies costs about 5.24 USDFC every 30 days. The estimate uses your entered data size. Filecoin derives the exact billed size from data-bearing leaves, which can add up to 31 bytes per piece.

## Plan upload fees and the refundable reserve

Open **Upload details** to enter how many pieces and upload batches each copy will contain. The default is one piece in one batch. Each copy has its own data set creation fee, and adding pieces has a base fee per batch plus a fee per piece. The lifecycle reserve is a balance the service holds to cover operations. The displayed reserve is separate from estimated spending, and unused funds are released after settlement. This estimate covers a new upload and its storage term. Retrieval and later operations have their own charges.

## Where the Filecoin rates come from

The page calculates using the dated reference rates shown beside the result. Select **Refresh mainnet rates** to read the Warm Storage pricing contract through a public Filecoin RPC. The browser uses the returned rate values and shows the block they came from. You can calculate with the reference rates even when that request is unavailable.

Read the [Filecoin storage cost guide](https://docs.filecoin.cloud/developer-guides/storage/storage-costs/) for exact billed sizes, account-specific funding, and the complete fee schedule.
