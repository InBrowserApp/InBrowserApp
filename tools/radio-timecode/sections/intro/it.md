## Cosa fa Radio Timecode Sync

Radio Timecode Sync genera audio nel browser seguendo formati comuni di segnali orari radio a onde lunghe: JJY, BPC, DCF77, MSF e WWVB. È utile quando un orologio radiocontrollato compatibile non riesce a ricevere il trasmettitore reale in ambienti interni, oppure quando vuoi testare come un orologio reagisce a un formato di stazione noto.

## Come usarlo

Seleziona la stazione corrispondente all'orologio, posiziona l'altoparlante del dispositivo vicino all'area dell'antenna dell'orologio, avvia il segnale e lascia all'orologio abbastanza tempo per ascoltare almeno una trama completa di un minuto. Tieni inizialmente basso il volume, poi aumentalo solo se l'orologio non rileva il segnale.

## Precisione e limitazioni

L'ora generata proviene dall'orologio di sistema di questo dispositivo più l'offset opzionale, quindi sincronizza l'orologio del dispositivo prima di usare lo strumento. I browser non possono emettere direttamente la vera portante a onde lunghe; questo strumento usa un'approssimazione a onda quadra a frequenza più bassa che su alcuni dispositivi può funzionare tramite armoniche. Hardware, posizionamento dell'altoparlante e firmware dell'orologio influenzano tutti i risultati, e l'audio del nominativo JJY è omesso intenzionalmente.
