## Een USB-apparaat inspecteren in je browser

Sluit het apparaat aan met een kabel die gegevens kan overdragen. Kies **Apparaat selecteren** en selecteer het in het WebUSB-venster van de browser. De apparaatkaart toont de leveranciers-ID (VID), product-ID (PID) en beschikbare identificatiegegevens. De USB-versie komt uit de apparaatdescriptor. De werkelijke verbindingssnelheid hangt ook af van de kabel, poort en het besturingssysteem.

## Configuraties, interfaces en eindpunten lezen

Klap een configuratie uit om te zien welke functies de interfaces bieden. Een interface kan meerdere alternatieve instellingen hebben, elk met een eigen klasse, subklasse, protocol en eindpunten. IN-eindpunten dragen gegevens over naar de host en OUT-eindpunten naar het apparaat. Het eindpunttype en de pakketgrootte beschrijven hoe het eindpunt gegevens overdraagt.

## Wat vertelt de toegangscontrole mij?

Selecteer **Toegang controleren** om te zien of de browser het geselecteerde apparaat kan openen. De controle gebruikt de apparaathandle en geeft deze daarna vrij. Toegang tot interfaces kan nog steeds afhangen van het stuurprogramma van het besturingssysteem of een andere toepassing. De inspectie leest de door de browser verstrekte descriptors en laat apparaatinstellingen ongemoeid.

## Waarom kan ik mijn USB-apparaat niet zien of openen?

Als je apparaat niet in de kiezer staat, probeer dan een datakabel en controleer of het besturingssysteem het herkent. Als de browser toegang weigert, controleer dan de USB-toestemming van de site of het browserbeleid. Als selecteren lukt maar openen mislukt, sluit dan apps die het apparaat mogelijk gebruiken en controleer welke stuurprogramma’s je apparaat en platform vereisen. Sommige USB-klassen worden door de browser beschermd. Bekijk [Apparaatinformatie](../device-information/) voor de mogelijkheden van deze browser en dit systeem.
