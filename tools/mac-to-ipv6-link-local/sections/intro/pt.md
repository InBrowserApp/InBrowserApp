## O que é um endereço IPv6 Link-Local?

Endereços IPv6 Link-Local são endereços IPv6 especiais que são automaticamente configurados em cada interface habilitada para IPv6. Eles sempre começam com o prefixo fe80::/10 e são usados para comunicação entre dispositivos no mesmo segmento de rede. Esses endereços não são roteáveis além do link local e são comumente usados para descoberta de vizinhos, descoberta de roteadores e outros protocolos de rede local. Endereços link-local podem ser gerados a partir do endereço MAC de um dispositivo usando o formato EUI-64.

### Formatos de entrada

- `00:11:22:33:44:55`
- `00-11-22-33-44-55`
- `0011.2233.4455`
- `001122334455`

### Saída EUI-64

- `fe80::/10`
- flip the U/L bit
- insert `ff:fe`

### Sufixo de interface

- `%eth0`
- `%en0`
- `%wlan0`
