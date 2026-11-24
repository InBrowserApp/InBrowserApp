## Skapa en SQLite-databas från CSV- och Excel-filer

Lägg till en eller flera CSV- eller Excel-filer (.xlsx eller .xls). Varje CSV-fil och varje Excel-kalkylblad som innehåller data blir en egen tabell i samma databas. Kontrollera kolumnerna i förhandsvisningen och byt vid behov namn på tabellerna. Välj sedan **Skapa SQLite-databas**. Konverteringen sker i webbläsaren och filerna stannar på din enhet.

## Så blir kalkylbladsdata till tabeller

Som standard hämtas kolumnnamnen från den första raden. Avmarkera **Använd första raden som kolumnnamn** för att importera raden som data. Kolumnerna får då namn som `column_1`. Tabell- eller kolumnnamn som förekommer flera gånger får numrerade ändelser. Om du lägger till en fil till med samma namn behålls därmed båda tabellerna.

Konverteraren känner igen numeriska kolumner och behåller inledande nollor i textkoder som `00123`. Tomma celler får värdet SQL-`NULL`. Datum från Excel sparas som text i ISO-format, med eller utan klockslag. För formelceller används de resultat som är sparade i arbetsboken. Om de visade resultaten behöver räknas om, spara arbetsboken på nytt i Excel först.

## Sök i databasen med SQL

Välj **Öppna i SQLite-visaren** för att bläddra bland tabellerna och köra en fråga. Du kan också ladda ned `.sqlite`-filen och öppna den i SQLite:s kommandoradsverktyg, i Python eller i ett annat SQLite-program. Konvertera till exempel `orders.csv` och en Excel-arbetsbok med kalkylbladet `customers`. Följande fråga räknar antalet beställningar per kund:

```sql
SELECT customers.name, COUNT(*) AS order_count
FROM orders
JOIN customers ON customers.id = orders.customer_id
GROUP BY customers.id, customers.name;
```

När du anpassar exemplet använder du tabell- och kolumnnamnen från din egen förhandsvisning.
