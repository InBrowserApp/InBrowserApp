## Granska Parquet-filer i webbläsaren

Öppna eller släpp en `.parquet`-fil för att bläddra bland dess data och granska varje fälts fysiska typ, logiska annotering och upprepning. Nästlade grupper visas i schemat. Sammanfattningen visar antal rader, kolumner, radgrupper, komprimering och filens skapare när informationen finns. Du kan prova den medföljande exempelfilen utan att välja en fil.

## Bläddra bland data och exportera CSV eller JSON

Data läses in en sida i taget. Använd sidkontrollerna för att bläddra i filen och välj en cell för att läsa hela värdet. Växla till **Schema** för att granska fälten. Använd **Exportera data** för att ladda ned den aktuella sidan eller alla rader som UTF-8 CSV eller en JSON-array. Export av hela filen förbereds i omgångar och kan avbrytas.

CSV innehåller kolumnnamn och omger värden som innehåller kommatecken, citattecken och radbrytningar med citattecken. null blir tomma CSV-fält och förblir `null` i JSON. Nästlade värden använder JSON och binära värden använder hexadecimal text. För att bevara 64-bitars heltal skriver JSON dem som strängar. Datum och tidsstämplar använder ISO-text med millisekundsprecision. Decimaler följer läsarens numeriska precision, så den här visaren är inte ett verktyg för förlustfri konvertering av decimaler eller tidsstämplar med hög precision.

## Lokal bearbetning

Din fil läses lokalt i en bakgrundsworker och laddas aldrig upp. Visaren läser först filens avslutande metadata och därefter bara de radintervall som behövs för visningen. Radgrupper i Parquet kan ändå kräva mycket minne för avkodning; exportstorleken begränsas av webbläsarens tillgängliga minne. Okomprimerade filer samt kodekarna Snappy, Gzip, Brotli, Zstandard och LZ4 stöds av hyparquet och dess komprimeringspaket. Krypterade Parquet-filer stöds inte.
