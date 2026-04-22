## O que esta ferramenta normaliza

Esta ferramenta converte endereços IPv4, endereços IPv6 e intervalos CIDR em notação canônica diretamente no navegador. Ele remove o preenchimento IPv4 desnecessário, compacta o IPv6 no formato abreviado padrão e preserva a família de endereços original.

## Como funciona a normalização CIDR

Quando você insere um bloco CIDR, a ferramenta reescreve o endereço no endereço de rede real desse prefixo. Os bits do host são limpos, então `192.168.0.15/24` se torna `192.168.0.0/24` e `2001:db8::1234/64` se torna `2001:db8::/64`.

## Quando isso é útil

Use-o antes de comparar regras de firewall, ACLs, tabelas de rotas, listas de permissões de VPN ou arquivos de configuração importados. A entrada normalizada torna mais confiável a detecção, revisão e cópia e colagem de duplicatas nas ferramentas de rede.

## Por que a entrada pode ser rejeitada

A ferramenta rejeita endereços IPv4 ou IPv6 mal formados, prefixos CIDR inválidos e combinações de endereços ou prefixos que não correspondem à família de protocolos. Se o valor não puder ser analisado de forma inequívoca, é mais seguro rejeitá-lo do que normalizar a rede errada.
