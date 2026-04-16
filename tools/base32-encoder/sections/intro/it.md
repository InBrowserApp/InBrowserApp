## Cos'è Base32?

Base32 è utile quando un canale solo testo o non sensibile alle maiuscole deve trasportare dati binari, come segreti OTP, token adatti a DNS o valori di configurazione esportati. È un livello di codifica, non un livello di sicurezza.

## Quando usarlo

- Codificare byte, testo o file in Base32 prima di inviarli tramite canali solo testuali.
- Preparare segreti OTP, impostazioni esportate o blob binari per sistemi che si aspettano input Base32.
- Convertire byte grezzi di file in una stringa facile da copiare per trasporto, log o inserimento manuale.

## Cosa tenere presente

- Base32 aumenta la dimensione più di Base64.
- Non cifra né nasconde il valore originale.
- Alcuni sistemi richiedono il padding `=`, altri accettano output senza padding, quindi conviene seguire ciò che si aspetta il destinatario.
