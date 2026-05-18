Erzeuge einen Stapel von UUID v4-Kennungen direkt in deinem Browser, wenn du zufällige IDs für Datenbankzeilen, API-Fixtures, Objektschlüssel, Test-Payloads, Importvorlagen oder einmalige Betriebsaufgaben brauchst.

## Was UUID v4 bietet

UUID v4 ist eine 128-Bit-Kennung, die größtenteils aus kryptografisch sicheren Zufallsbytes besteht. Die Versions- und Variantenbits sind durch das RFC 4122-Layout festgelegt, sodass eine UUID v4 die vertraute Form `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx` hat und dennoch einen sehr großen Zufallsraum bietet.

## Eine praktische Stapelgröße wählen

Der Standardstapel liefert genug IDs für viele Fixture- und Tabellenkalkulations-Workflows, ohne die Seite schwer lesbar zu machen. Erhöhe die Anzahl, wenn du einen größeren Import vorbereitest, oder reduziere sie, wenn du nur eine Handvoll Kennungen für ein Anfragebeispiel oder eine manuelle Datenbankbearbeitung benötigst.

## Kopieren oder exportieren

Prüfe die erzeugte Liste und kopiere sie dann in deinen Editor oder lade eine reine Textdatei herunter. Jeder Wert wird lokal erzeugt, und der aktuelle Stapel wird von diesem Tool nie hochgeladen.

## Hinweise zu Kollisionen

Das Kollisionsrisiko von UUID v4 ist bei normalen Anwendungs-Workloads extrem gering, ersetzt aber keine Eindeutigkeitsbeschränkung in der Datenbank. Erzwinge Eindeutigkeit weiterhin dort, wo die ID zu einem Primärschlüssel, öffentlichen Token oder dauerhaften Verweis wird.
