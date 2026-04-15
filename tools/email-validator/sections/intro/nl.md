## Wat is e-mailvalidatie?

E-mailvalidatie controleert of een adres voldoet aan gangbare syntaxisregels voor het lokale deel, het `@`-teken, domeinlabels en het topleveldomein. Het is handig voor formuliertests, het opschonen van voorbeelddata en het vinden van duidelijke typefouten vóór verzending.

### Wat deze validator controleert

- Eén `@` dat het lokale deel en het domein scheidt
- Lengtelimieten voor het volledige adres, het lokale deel en het domein
- Toegestane tekens, puntplaatsing, koppeltekens en TLD-structuur
- Een genormaliseerd resultaat met het domein in kleine letters voor vergelijking

### Voorbeelden

- Geldig: `name@example.com`
- Geldig: `first.last+news@example.co.uk`
- Ongeldig: `name..dots@example.com`
- Ongeldig: `user@-example.com`

Geïnternationaliseerde domeinen moeten in Punycode-ASCII worden ingevoerd, bijvoorbeeld `user@xn--bcher-kva.example`.

### Wat deze tool niet controleert

- Of de mailbox bestaat of mail kan ontvangen
- DNS-, MX-, SMTP- of disposable-providercontroles
- Of een website het adres volgens zijn eigen bedrijfsregels accepteert
