## O que esta ferramenta faz

Esta ferramenta combina blocos CIDR no menor conjunto equivalente e, em seguida, subtrai todos os blocos CIDR que você colocar na lista de exclusão. Ela oferece suporte a IPv4 e IPv6 na mesma execução, e todo o processamento acontece localmente no seu navegador.

## Como mesclar e excluir funciona

A lista de mesclagem é normalizada primeiro: os bits de host são zerados, redes sobrepostas são combinadas e redes adjacentes são agrupadas quando podem ser representadas por um bloco CIDR mais curto. Depois disso, a lista de exclusão é subtraída dos intervalos mesclados. A saída final é expandida novamente para a lista CIDR mínima que cobre exatamente o que resta.

## Quando isto é útil

Use ao limpar regras de firewall, preparar entradas de grupos de segurança na nuvem, revisar listas de permissão de VPN, resumir tabelas de rotas ou remover intervalos reservados de uma alocação maior. Ela é especialmente útil quando uma configuração copiada contém blocos sobrepostos ou quando uma rede ampla precisa ter alguns intervalos menores removidos.

## Observações de entrada

Insira um CIDR por linha, ou separe vários CIDRs com vírgulas. Blocos IPv4 e IPv6 podem ser colados juntos, mas as exclusões só se aplicam a blocos da mesma família de endereços. Entradas inválidas são informadas com a respectiva lista e número de linha para que você possa corrigir grandes entradas coladas sem adivinhar.
