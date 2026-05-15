## Was ist UUID v3?

UUID v3 ist ein namensbasiertes UUID-Format. Es verwendet eine Namespace-UUID
und einen Namen, hasht beide mit MD5 und formatiert das Ergebnis als
Standard-UUID. Das wichtige Verhalten ist Determinismus: Derselbe Namespace und
derselbe Name erzeugen immer dieselbe UUID.

Dieses Tool läuft vollständig in Ihrem Browser. Namespace, Name und generierte
UUID bleiben auf Ihrem Gerät, sofern Sie das Ergebnis nicht an anderer Stelle
kopieren.

## Wann Sie es verwenden sollten

- Verwenden Sie UUID v3, wenn Sie eine stabile Kennung für einen bekannten Namen
  benötigen, etwa einen DNS-Namen, eine URL, einen Objektpfad oder einen
  Benutzernamen.
- Wählen Sie den Namespace, der zur Art des Namens passt, den Sie
  identifizieren. DNS und URL sind die häufigsten Voreinstellungen.
- Verwenden Sie denselben Namespace konsequent wieder. Wenn Sie den Namespace
  ändern, ändert sich jede generierte UUID, selbst wenn der Name gleich bleibt.
- Bevorzugen Sie UUID v5 oder eine andere moderne Kennung, wenn Sie die Wahl
  haben und eine namensbasierte UUID mit einem stärkeren Hash benötigen. UUID v3
  existiert aus Kompatibilitätsgründen mit Systemen, die ausdrücklich
  MD5-basierte UUIDs erwarten.

## Hinweise zur Sicherheit

UUID v3 ist keine zufällige ID und ist nicht geheim. Jeder, der Namespace und
Namen kennt, kann dieselbe UUID erneut generieren. Verwenden Sie sie nicht für
Passwörter, Sitzungstoken, API-Schlüssel oder andere Werte, die unvorhersehbar
sein müssen.
