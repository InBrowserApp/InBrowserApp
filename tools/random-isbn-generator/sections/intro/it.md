## Generare numeri ISBN-10 o ISBN-13 casuali

Scegli `ISBN-13` per i moduli di catalogazione e vendita attuali o `ISBN-10` per i record meno recenti. Imposta una quantità da `1` a `1000`, scegli se includere i trattini e seleziona **Genera**. Copia i numeri generati o scarica un file TXT con un ISBN per riga.

## Interpretare il formato e la cifra di controllo

L'International Standard Book Number (ISBN) identifica un'edizione e un formato di un libro. I valori `ISBN-13` generati usano il prefisso `978` e terminano con una cifra di controllo numerica. Un `ISBN-10` può terminare con `X`, che rappresenta dieci nel calcolo della somma di controllo. Due esempi sono `978-0-306-40615-7` e `0-8044-2957-X`. I trattini rendono i gruppi più leggibili e non modificano la cifra di controllo.

## Usare i risultati nei dati di test

Usa questi identificatori di esempio per testare moduli di catalogazione, importazioni e convalida degli ISBN. Per simulare un errore nella somma di controllo, cambia solo l'ultimo carattere con una cifra diversa e riprova l'importazione. In un foglio di calcolo o in un database, conserva gli ISBN come testo per mantenere un eventuale zero iniziale o la `X` finale. Per un libro pubblicato, prendi l'ISBN dalla copertina dell'edizione o dal record dell'editore.
