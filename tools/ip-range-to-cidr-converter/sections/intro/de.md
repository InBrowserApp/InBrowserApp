## Was dieses Tool macht

Dieses Tool wandelt eine Start-IP-Adresse und eine End-IP-Adresse in den kleinsten Satz von CIDR-Blöcken um, der genau den gesamten Bereich abdeckt. Alles läuft lokal in Ihrem Browser, sodass die Adressen Ihr Gerät nie verlassen.

## So funktioniert die CIDR-Abdeckung

Ein CIDR-Block stellt ein Netzwerk in der Größe einer Zweierpotenz dar, das an einer passenden Grenze ausgerichtet ist. Wenn ein Bereich in der Mitte dieser Grenzen beginnt oder endet, reicht ein Block nicht aus. Der Konverter nimmt weiterhin den größten ausgerichteten Block, der passt, und wiederholt den Vorgang, bis der gesamte Bereich abgedeckt ist.

## Warum mehrere Blöcke auftreten können

Bereiche wie 192.168.1.10 bis 192.168.1.25 beginnen nicht an einer sauberen Netzwerkgrenze und enden auch nicht an einer solchen. Das genaue Ergebnis ist daher eine kurze Liste von Blöcken, die jeweils einen ausgerichteten Teil abdecken, ohne zusätzliche Adressen außerhalb des angeforderten Bereichs einzubeziehen.

## Wenn dies nützlich ist

Verwenden Sie es, wenn Sie Firewall-Regeln, Routenzusammenfassungen, ACL-Einträge, Cloud-Sicherheitsgruppen oder Migrationschecklisten vorbereiten, bei denen ein roher Start- und Endbereich zur Standard-CIDR-Notation werden muss.
