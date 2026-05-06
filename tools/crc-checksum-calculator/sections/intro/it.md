# Calcolatore di checksum CRC

I checksum CRC (Cyclic Redundancy Check) sono valori compatti usati per rilevare
modifiche accidentali ai dati. Sono comuni nei frame di rete, nei formati di
archivio, nei protocolli embedded, negli aggiornamenti firmware e nei flussi di
lavoro per l'integrità dei file, dove un valore rapido di rilevamento degli
errori è più utile di una firma crittografica.

## Quando usarlo

Usa questo calcolatore quando devi confrontare valori CRC provenienti da
documentazione, protocolli hardware, formati di file o un altro sistema. Incolla
testo per controlli rapidi oppure importa un file quando il checksum deve essere
calcolato dal flusso esatto di byte.

## Varianti supportate

Lo strumento calcola le varianti comuni dello strumento CRC legacy di
InBrowser.App: CRC-1, CRC-8, CRC-8 1-Wire, CRC-8 DVB-S2, CRC-16, CRC-16 CCITT,
CRC-16 Modbus, CRC-16 Kermit, CRC-16 XModem, CRC-24, CRC-32, CRC-32 MPEG-2,
CRCJAM e diversi modelli CRC-64, inclusi ECMA-182, GO-ISO, MS, NVME, REDIS, WE
e XZ.

## Aspetti da controllare

I nomi delle varianti CRC sono importanti. Lo stesso input può produrre valori
diversi a seconda di polinomio, valore iniziale, impostazioni di riflessione e
XOR finale. Se stai confrontando un protocollo o una specifica di un fornitore,
scegli il risultato il cui nome di variante corrisponde a quella specifica
invece di trattare ogni larghezza CRC come intercambiabile.

CRC è progettato per rilevare errori accidentali, non per l'archiviazione di
password, firme o sicurezza anti-manomissione. Per verifiche sensibili alla
sicurezza, usa invece un flusso di lavoro basato su hash crittografico o firma.
