## Come connettere un dispositivo HID nel browser

Collega un dispositivo di interfaccia umana supportato, come un controller di gioco, un joystick, un pedale o un tastierino macro. Seleziona **Connetti dispositivo** e scegli il dispositivo nella finestra di selezione WebHID. Il visualizzatore mostra l'ID fornitore (VID) e l'ID prodotto (PID), utili per identificare l'hardware. Usa un browser desktop compatibile tramite HTTPS.

## Come leggere raccolte HID e ID dei report

Apri una raccolta per visualizzare la pagina di utilizzo, l'utilizzo e gli ID dei report. La pagina di utilizzo raggruppa funzioni correlate, mentre l'utilizzo identifica una funzione all'interno del gruppo. I report di input trasportano dati dal dispositivo, quelli di output descrivono i dati che un host può inviare e i report delle funzionalità descrivono impostazioni o stato specifici del dispositivo. L'ID report 0 indica che l'interfaccia non usa un ID report esplicito.

## Come esaminare i byte di input che cambiano

Muovi un comando alla volta osservando i report esadecimali in tempo reale. I byte evidenziati differiscono dal payload precedente con lo stesso ID report. L'ID report è mostrato separatamente dal payload. Sospendi l'acquisizione per esaminare i report più recenti oppure cancella l'elenco e ricomincia. Consulta il formato dei report del dispositivo per interpretare pulsanti, assi e altri campi.

## Perché il dispositivo o una raccolta non compare nell'elenco?

Controlla che il sistema operativo riconosca il dispositivo, poi riapri la finestra di selezione. I browser proteggono le raccolte comuni di tastiere e mouse e alcuni dispositivi espongono al Web solo una parte dei loro report. Questo visualizzatore riceve i report di input dal dispositivo selezionato e conserva i dati in questa scheda. Per i comandi standard, prova il [Test del controller](../gamepad-tester/) o il [Test della tastiera](../keyboard-tester/).
