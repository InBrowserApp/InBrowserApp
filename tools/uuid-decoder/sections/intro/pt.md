# O que é um decodificador de UUID?

Um decodificador de UUID explica a estrutura interna de um Identificador Único Universal. Ele normaliza formatos de entrada comuns, verifica se o valor é um UUID de 128 bits e mostra a versão, a variante, os bytes hexadecimais brutos e representações numéricas prontas para copiar.

UUIDs muitas vezes são tratados como strings opacas, mas o nibble de versão indica como o identificador foi criado. UUIDs da versão 4 são aleatórios, as versões 3 e 5 usam hashes baseados em nome, e versões ordenadas por tempo, como 1, 6 e 7, podem conter informações de data/hora.

## Quando usá-lo

Use esta ferramenta quando precisar inspecionar um identificador de logs, bancos de dados, APIs, rastreamentos ou dados de teste. Ela é útil para confirmar se um UUID é aleatório ou baseado em tempo, convertê-lo para decimal ou Base64 para outro sistema e identificar se o campo de nó de um UUID v1 ou v6 pode expor um identificador no estilo MAC.

O decodificador é executado no seu navegador e não envia valores de UUID a um servidor. Ele aceita UUIDs canônicos, valores `urn:uuid:`, UUIDs entre chaves, entrada em maiúsculas e UUIDs hexadecimais de 32 caracteres sem hifens.

## O que observar

Os campos de versão e variante do UUID descrevem o layout de bits, não se o identificador é globalmente único na prática. Um UUID com aparência válida ainda pode ser duplicado se tiver sido gerado de forma inadequada ou copiado por engano.

Para UUIDs da versão 1 e versão 6, o campo de nó pode se parecer com um endereço MAC. Geradores modernos podem definir o bit de multicast e usar um nó aleatório, então trate-o como um identificador de nó a menos que você controle o gerador.
