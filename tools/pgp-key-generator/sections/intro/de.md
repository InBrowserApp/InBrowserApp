# PGP-Schlüsselgenerator

Verwende dieses Tool, um ein OpenPGP-Schlüsselpaar direkt in deinem Browser zu erstellen. Es erzeugt einen ASCII-armierten öffentlichen Schlüssel, einen privaten Schlüssel, ein Widerrufszertifikat, eine Schlüssel-ID und einen Fingerprint, damit du verschlüsselte E-Mails, Dateiverschlüsselung, Release-Signierung oder Workflows zur Kontowiederherstellung einrichten kannst, ohne das Schlüsselmaterial an einen Server zu senden.

## Wann du es verwenden solltest

PGP-Schlüssel sind nützlich, wenn du asymmetrische Kryptografie benötigst: Andere Personen verwenden deinen öffentlichen Schlüssel, um Daten für dich zu verschlüsseln oder Signaturen zu prüfen, während dein privater Schlüssel Daten entschlüsselt und Signaturen erstellt. Ein browserbasierter Generator ist praktisch für kurze Einrichtungssitzungen, Demos oder lokale Workflows, bei denen du das Ergebnis sofort benötigst.

## So generierst du ein Schlüsselpaar

Gib einen Namen, eine E-Mail-Adresse oder beides ein, damit der Schlüssel eine erkennbare Benutzer-ID erhält. Füge optional einen Kommentar hinzu, wenn du Schlüssel für Arbeit, Projekte oder Release-Signierung trennen möchtest. Wähle ECC für moderne OpenPGP-Software oder RSA, wenn du Kompatibilität mit älteren Tools benötigst. Eine Passphrase ist optional, wird aber für jeden privaten Schlüssel, den du behalten möchtest, dringend empfohlen.

## Schlüsseltypen und Ablauf

ECC verwendet Curve25519 und ist die Standardeinstellung, weil es kompakt und schnell ist. RSA ist aus Kompatibilitätsgründen mit 2048, 3072 und 4096 Bit verfügbar. Der Ablauf wird in Tagen festgelegt; verwende 0 nur für Schlüssel, die du aktiv verwaltest und widerrufen kannst. Kürzere Ablaufzeiträume verringern langfristige Risiken und erleichtern regelmäßige Rotation.

## Sicherer Umgang mit privaten Schlüsseln

Lade den öffentlichen Schlüssel, den privaten Schlüssel und das Widerrufszertifikat als separate Dateien herunter. Sichere den privaten Schlüssel in einem verschlüsselten Passwortmanager oder einem sicheren Offline-Speicher und bewahre das Widerrufszertifikat getrennt davon auf, damit du den Schlüssel außer Betrieb nehmen kannst, falls der private Schlüssel verloren geht oder offengelegt wird. Bevor du einen öffentlichen Schlüssel veröffentlichst, vergleiche den Fingerprint über einen vertrauenswürdigen Kanal.
