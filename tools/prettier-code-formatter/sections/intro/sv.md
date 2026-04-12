## Vad är Prettier Code Formatter?

Prettier Code Formatter kör den officiella Prettier-stacken direkt i
webbläsaren så att du kan normalisera källfiler utan att skicka kod till en
server. Det är användbart när du vill göra en snabb formateringskörning, jämföra
olika radbreddsinställningar eller direkt få en ren fil som du kan kopiera eller
ladda ner.

## Stödda Format

Den här omskrivningen håller verktyget fokuserat på de format som Prettier redan
hanterar bra i webbläsaren: JavaScript, TypeScript, Flow, JSON, HTML, CSS, SCSS,
Less, Markdown, MDX, YAML, GraphQL och relaterade mallformat som Vue och
Handlebars. Språkvalet styr vilken parser som körs, och när du importerar en fil
identifieras parsaren automatiskt om filtillägget känns igen.

## Hur Omskrivningen Fungerar

Omskrivningen håller tung formateringslogik utanför huvudflödet i gränssnittet.
Formateringsbegäranden byggs från ren verktygsspecifik konfiguration och körs
därefter genom en lat worker-baserad Prettier-pipeline så att vanlig
inmatning förblir responsiv. Stora inmatningar pausar automatisk formatering och
växlar till en uttrycklig åtgärd för att formatera nu, vilket är mer förutsägbart
än att försöka omformatera en stor fil vid varje tangenttryckning.
