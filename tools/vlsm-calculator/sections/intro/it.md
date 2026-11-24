## Come pianificare le sottoreti IPv4 con VLSM

Inserisci il blocco di partenza in notazione CIDR, ad esempio 192.168.10.0/24. Aggiungi una riga per ogni sottorete e indica quanti indirizzi host utilizzabili servono, includendo l’eventuale gateway e un margine per la crescita. Calcola il piano per vedere i blocchi assegnati, le maschere, gli intervalli IP utilizzabili, gli indirizzi broadcast e i blocchi CIDR ancora disponibili.

La tecnica VLSM (maschera di sottorete a lunghezza variabile) suddivide una rete in sottoreti di dimensioni diverse. Il calcolatore sceglie il blocco più piccolo che soddisfa il requisito di ciascuna sottorete e assegna per primi i blocchi più grandi, rispettando l’allineamento CIDR. Una sottorete standard riserva l’indirizzo di rete e quello broadcast. Ad esempio, un blocco /26 offre 62 indirizzi utilizzabili e può ospitare 50 host.

Scegli /31 solo per un collegamento IPv4 punto-punto che supporta due indirizzi utilizzabili. Scegli /32 per un singolo indirizzo, ad esempio quello di loopback di un router. In entrambi i casi non c’è un indirizzo broadcast. Il calcolo avviene nel browser, dove rimangono anche i nomi delle sottoreti.
