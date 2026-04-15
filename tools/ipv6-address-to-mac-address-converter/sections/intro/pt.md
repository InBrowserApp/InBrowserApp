## Como converter IPv6 em endereço MAC

Você só consegue recuperar um endereço MAC a partir de um endereço IPv6 quando
o identificador de interface IPv6 foi derivado desse MAC com o método EUI-64.
Isso é mais comum em endereços link-local mais antigos que começam com
`fe80::` e em alguns endereços autoconfigurados sem estado.

### Quando funciona

Essa conversão reversa funciona quando os últimos 64 bits do endereço IPv6
ainda contêm um identificador de interface EUI-64.

- O identificador de interface foi construído a partir de um MAC de 48 bits.
- Os bytes centrais ainda são `ff:fe`.
- O endereço não foi gerado por extensões de privacidade nem por outro esquema
  de aleatorização.

### Como a conversão funciona

O conversor reconstrói o endereço MAC com estes passos:

1. Lê os últimos 64 bits do endereço IPv6.
2. Remove os bytes `ff:fe` inseridos no meio do identificador de interface.
3. Inverte o bit universal/local do primeiro byte.
4. Formata os 48 bits restantes como um endereço MAC padrão.

### Por que nenhum MAC aparece

Você pode não obter resultado por vários motivos:

- O endereço IPv6 não é sintaticamente válido.
- O endereço é válido, mas não foi gerado a partir de um MAC com EUI-64.
- O endereço usa privacidade, stable-random, DHCPv6 ou outro método de
  atribuição que não é baseado em MAC.
