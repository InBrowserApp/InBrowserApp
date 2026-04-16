## Cos'è Base32?

Base32 è utile quando un canale solo testo o non sensibile alle maiuscole deve trasportare dati binari, come segreti OTP, token adatti a DNS o valori di configurazione esportati. È un livello di codifica, non un livello di sicurezza.

## Quando usarlo

- Decodificare segreti o token Base32 per recuperare i byte originali.
- Ispezionare valori copiati dalla configurazione TOTP, da esportazioni di integrazione o da file di configurazione.
- Verificare che i dati Base32 incollati abbiano caratteri validi e padding corretto prima dell'uso.

## Cosa tenere presente

- Base32 aumenta la dimensione più di Base64.
- Non cifra né nasconde il valore originale.
- Alcuni sistemi omettono il padding `=`, ma i caratteri non validi continuano a causare errori di decodifica.
