## Aprire un APK e leggere il manifest

Trascina un file `.apk` Android o scegli **Apri APK o manifest**. Il visualizzatore apre il file `AndroidManifest.xml` incluso nell’APK, anche se è in formato XML binario compilato come nella maggior parte degli APK. Puoi anche aprire un manifest già estratto in formato binario o testuale. Prova l’APK di esempio per esplorare la panoramica e l’XML decodificato. I file restano nel browser.

## Capire i campi del pacchetto, della versione e dell’SDK

Il **Nome del pacchetto** identifica l’app Android. Il nome della versione è l’etichetta mostrata agli utenti. Il codice di versione è il numero che Android usa per ordinare gli aggiornamenti. L’SDK minimo indica il livello API di Android più basso dichiarato nel manifest e l’SDK di destinazione indica quello a cui si rivolge l’app. I campi omessi nel manifest sono indicati come non specificati.

## Esaminare le autorizzazioni ed esportare AndroidManifest.xml

La panoramica elenca i nomi delle autorizzazioni dichiarate dal pacchetto. Android determina quali autorizzazioni vengono concesse sul dispositivo in base alla versione del sistema, alle impostazioni dell’app e alle scelte dell’utente. Apri **XML del manifest** per leggere i componenti, i filtri di intent e le dichiarazioni di autorizzazioni condizionali. Usa **Copia XML** o **Scarica XML** per conservare il file decodificato. I riferimenti alle risorse compilate possono comparire come ID, ad esempio `@0x7f010001`.

[Struttura ed elementi del manifest Android](https://developer.android.com/guide/topics/manifest/manifest-intro)
