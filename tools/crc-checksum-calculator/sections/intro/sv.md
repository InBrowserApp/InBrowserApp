# CRC-kontrollsummekalkylator

CRC-kontrollsummor (Cyclic Redundancy Check) är kompakta värden som används för
att upptäcka oavsiktliga dataändringar. De är vanliga i nätverksramar,
arkivformat, inbäddade protokoll, firmwareuppdateringar och arbetsflöden för
filintegritet där ett snabbt feldetekteringsvärde är mer användbart än en
kryptografisk signatur.

## När du ska använda den

Använd den här kalkylatorn när du behöver jämföra CRC-värden från dokumentation,
maskinvaruprotokoll, filformat eller ett annat system. Klistra in text för
snabba kontroller, eller importera en fil när kontrollsumman måste beräknas från
den exakta byteströmmen.

## Varianter som stöds

Verktyget beräknar de vanliga varianterna från det äldre InBrowser.App
CRC-verktyget: CRC-1, CRC-8, CRC-8 1-Wire, CRC-8 DVB-S2, CRC-16, CRC-16 CCITT,
CRC-16 Modbus, CRC-16 Kermit, CRC-16 XModem, CRC-24, CRC-32, CRC-32 MPEG-2,
CRCJAM och flera CRC-64-modeller inklusive ECMA-182, GO-ISO, MS, NVME, REDIS,
WE och XZ.

## Saker att tänka på

CRC-variantnamn spelar roll. Samma inmatning kan ge olika värden beroende på
polynom, initialvärde, reflektionsinställningar och slutlig XOR. Om du matchar
ett protokoll eller en leverantörsspecifikation ska du välja resultatet vars
variantnamn matchar den specifikationen i stället för att behandla varje
CRC-bredd som utbytbar.

CRC är utformat för att upptäcka oavsiktliga fel, inte för lösenordslagring,
signaturer eller manipulationssäkert skydd. För säkerhetskänslig verifiering
bör du använda ett kryptografiskt hash- eller signaturarbetsflöde i stället.
