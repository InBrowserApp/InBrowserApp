## Cos'è un indirizzo locale univoco IPv6?

Un indirizzo locale univoco IPv6 (ULA) è destinato alla comunicazione all'interno di siti, reti private e organizzazioni interconnesse. L'intero spazio ULA è `fc00::/7`. Il suo ottavo bit è il **bit L**: il valore `1` seleziona l'intervallo `fd00::/8` assegnato localmente e usato da questo generatore, mentre la metà `fc00::/8` resta riservata a un metodo di assegnazione diverso.

Gli indirizzi ULA non sono raggiungibili globalmente per impostazione predefinita, ma «locale» non significa segreto o automaticamente sicuro. Possono attraversare confini di sito instradati, VPN e interconnessioni private quando gli operatori configurano tali percorsi.

## Come questo generatore RFC 4193 crea un /48

Questo generatore RFC 4193 richiede alla Web Crypto API esattamente 40 bit casuali e li combina con `fd`. Il risultato è un prefisso di sito a 48 bit statisticamente univoco, come `fd12:3456:789a::/48`. La generazione resta nel browser: non raccoglie indirizzi MAC, timestamp, identificatori del dispositivo o risposte del server.

Esistono `2^40` ID globali possibili, circa 1.100 miliardi. La casualità sicura rende improbabile il riutilizzo accidentale, ma non può garantire che due prefissi generati in modo indipendente non entrino mai in conflitto. Registra il `/48` scelto nella documentazione di rete e riutilizzalo in modo coerente.

## Pianificare le 65.536 subnet /64 disponibili

Dopo il prefisso di sito `/48` vengono i 16 bit dell'ID subnet. I valori da `0000` a `ffff` offrono 65.536 possibili reti `/64`. Ad esempio, l'ID subnet `00a0` trasforma `fd12:3456:789a::/48` nella rete canonica `fd12:3456:789a:a0::/64`.

I restanti 64 bit costituiscono l'ID interfaccia. Questo strumento pianifica solo prefissi di rete; non genera indirizzi host `/128` né ricava identificatori di interfaccia da indirizzi MAC.

## Dove usare gli indirizzi ULA, e dove non usarli

Gli indirizzi ULA sono adatti all'indirizzamento interno stabile, ai siti connessi tramite VPN, alle reti di laboratorio e ai servizi che devono mantenere un prefisso interno pur usando anche IPv6 unicast globale. Non costituiscono un firewall né un confine di sicurezza intrinseco. Applica i normali controlli degli accessi, filtra il traffico ULA inappropriato ai confini del sito e mantieni i record ULA interni fuori dal DNS pubblico.

Un host può usare contemporaneamente un indirizzo ULA e un indirizzo unicast globale. Usa l'indirizzo globale per la raggiungibilità Internet e il prefisso ULA persistente per i percorsi privati che ne hanno bisogno.
