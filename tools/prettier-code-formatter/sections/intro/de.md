## Was Ist Der Prettier-Code-Formatierer?

Der Prettier-Code-Formatierer führt die offizielle Prettier-Standalone-Pipeline
direkt im Browser aus, damit du Quelldateien normalisieren kannst, ohne Code an
einen Server zu senden. Das ist nützlich, wenn du schnell einmal formatieren
möchtest, verschiedene Zeilenlängen prüfen willst oder sofort eine saubere
Datei zum Kopieren oder Herunterladen brauchst.

## Unterstützte Formate

Dieser Rewrite konzentriert sich auf die Formate, die Prettier bereits gut im Browser beherrscht: JavaScript, JSX, TypeScript, TSX, Flow, JSON-Varianten, HTML, XML, CSS, PostCSS, SCSS, Less, Markdown, MDX, YAML, GraphQL und Template-Formate wie Angular, Vue, Svelte, LWC, MJML und Handlebars. Die Sprachauswahl bestimmt, welcher Parser ausgeführt wird, und beim Import einer Datei wird der Parser automatisch erkannt, wenn die Endung bekannt ist.

## Wie Dieser Rewrite Funktioniert

Der Rewrite hält schwere Formatierungslogik aus dem Hauptpfad der UI heraus.
Formatierungsanfragen werden aus reinem, tool-lokalem Konfigurationszustand
gebaut und dann über eine verzögert geladene, worker-gestützte
Prettier-Pipeline ausgeführt, damit normales Tippen reaktionsschnell bleibt.
Bei großen Eingaben wird die automatische Formatierung pausiert und auf eine
explizite Aktion `Jetzt formatieren` umgestellt. Das ist besser vorhersehbar,
als bei jedem Tastendruck eine große Datei neu zu formatieren.
