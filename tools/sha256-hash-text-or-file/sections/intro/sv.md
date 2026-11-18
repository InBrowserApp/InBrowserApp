## Beräkna en SHA-256-kontrollsumma för text eller en fil

Klistra in UTF-8-text eller välj **Importera från fil** för att beräkna hashvärdet från filens ursprungliga byte. Kopiera det hexadecimala resultatet för att jämföra med en publicerad kontrollsumma. SHA-256 ger ett hashvärde på 256 bitar som visas med 64 hexadecimala tecken.

För att kontrollera en nedladdning beräknar du filens hashvärde och jämför hela det hexadecimala värdet med det som källan publicerat. För text påverkar blanksteg, skiftläge och radbrytningar hashvärdet. Som snabbtest kan du skriva `abc` utan en avslutande radbrytning. Då får du följande värde.

```text
ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad
```
