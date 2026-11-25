## Converti un indirizzo Filecoin f410 in 0x

Incolla un indirizzo `f410` o `t410` e seleziona **Converti indirizzo**. Il convertitore verifica il checksum Filecoin e mostra il corrispondente indirizzo `0x` in formato Ethereum con checksum EIP-55. Copia il risultato per un portafoglio o un esploratore di blocchi che usa indirizzi in formato Ethereum su Filecoin. **Prova un esempio** permette di vedere una conversione senza inserire il proprio indirizzo.

## Converti un indirizzo 0x in Filecoin

Incolla un indirizzo `0x` con 40 cifre esadecimali. Scegli **Rete principale** per un indirizzo `f410` o **Rete di test Calibration** per un indirizzo `t410`. Il formato `0x` non contiene un prefisso di rete, quindi gli stessi byte possono essere scritti con entrambi i prefissi Filecoin. Seleziona la rete usata dal tuo portafoglio, esploratore o exchange. Sono accettati valori esadecimali tutti minuscoli o tutti maiuscoli. I valori che combinano maiuscole e minuscole devono superare la verifica del checksum EIP-55.

## Cosa significano f410 e t410?

Sono indirizzi delegati usati dalla Filecoin Ethereum Virtual Machine (FEVM). Un indirizzo `f410` o `t410` e il suo formato `0x` rappresentano lo stesso indirizzo di 20 byte sulla rete Filecoin selezionata. Il formato nativo Filecoin usa Base32 e un proprio checksum. La conversione del formato mantiene invariati i byte e non trasferisce FIL tra reti.

## Posso convertire indirizzi f0, f1, f2 o f3?

Questo strumento converte indirizzi delegati FEVM nello spazio dei nomi `10`, identificato dal prefisso `f410` o `t410`. Gli indirizzi ID attore, le loro rappresentazioni mascherate `0xff0000…` e gli altri tipi di indirizzo Filecoin non rientrano in questo ambito. Associare alcuni tipi di indirizzo nativi a un attore richiede lo stato della catena. Questa conversione avviene nel browser senza chiamate RPC né collegamento a un portafoglio.

Consulta la [guida Filecoin ai tipi di indirizzo e ai trasferimenti](https://github.com/filecoin-project/filecoin-docs/blob/main/networks-and-tools/assets/transfer-fil.md) e la [specifica del checksum EIP-55](https://eips.ethereum.org/EIPS/eip-55).
