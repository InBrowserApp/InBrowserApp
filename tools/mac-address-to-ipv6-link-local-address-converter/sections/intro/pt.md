## O que é um endereço IPv6 Link-Local?

Endereços IPv6 Link-Local são endereços IPv6 especiais que são automaticamente configurados em cada interface habilitada para IPv6. Eles sempre começam com o prefixo fe80::/10 e são usados para comunicação entre dispositivos no mesmo segmento de rede. Esses endereços não são roteáveis além do link local e são comumente usados para descoberta de vizinhos, descoberta de roteadores e outros protocolos de rede local. Endereços link-local podem ser gerados a partir do endereço MAC de um dispositivo usando o formato EUI-64.

### Quando usar

Use esta ferramenta quando precisar do endereço link-local determinístico que o EUI-64 deriva do endereço MAC de um dispositivo.

### Como funciona o mapeamento EUI-64

1. Normalize o endereço MAC para 48 bits.
2. Inverta o `U/L bit` no primeiro byte.
3. Insira `ff:fe` no meio para criar um identificador de interface de 64 bits.
4. Adicione o prefixo `fe80::/10`.

### Formatos de entrada aceitos

- `00:11:22:33:44:55`
- `00-11-22-33-44-55`
- `0011.2233.4455`
- `001122334455`

### Sufixo de interface opcional

Adicione `%eth0`, `%en0` ou outro índice de zona apenas quando um comando local precisar saber qual interface deve ser usada.
