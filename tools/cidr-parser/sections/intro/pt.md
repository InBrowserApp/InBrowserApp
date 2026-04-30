CIDR Parser transforma um bloco como `10.24.8.19/21` ou `2001:db8:abcd::123/64` na rede que você realmente quer usar. Ele normaliza entradas com endereço de host, mostra a sub-rede canônica e expõe os limites normalmente necessários ao escrever regras de firewall, documentar intervalos ou verificar se uma alocação é maior do que deveria.

## O que ele mostra

O resultado começa com uma visão geral rápida e depois divide o bloco em detalhes práticos: CIDR canônico, contagens de endereços totais e utilizáveis, início e fim do intervalo, além dos valores inteiros por trás do bloco. Para IPv4, você também recebe netmask, wildcard mask e endereço de broadcast. Para IPv6, o parser mantém o mesmo fluxo e oculta campos que não se aplicam.

## Por que a canonicalização importa

Muitos valores CIDR colados incluem bits de host. Isso é aceitável para humanos, mas roteadores, ACLs e documentação geralmente precisam do endereço de rede canônico. Ao reescrever o bloco antes de qualquer cópia, a ferramenta ajuda a encontrar suposições off-by-one antes que elas cheguem à configuração.

## Notas práticas

- Blocos IPv4 `/31` e `/32` são tratados como totalmente utilizáveis, de acordo com usos modernos ponto a ponto e host-route.
- Blocos IPv6 informam todo o espaço de endereços e o intervalo utilizável sem inventar um conceito de broadcast.
- Tudo roda localmente no navegador, então sub-redes internas não saem da página enquanto você as inspeciona.
