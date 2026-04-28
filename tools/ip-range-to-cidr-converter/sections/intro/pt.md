## O que esta ferramenta faz

Esta ferramenta converte um endereço IP inicial e um endereço IP final no menor conjunto de blocos CIDR que cobre exatamente todo o intervalo. Tudo funciona localmente no seu navegador, para que os endereços nunca saiam do seu dispositivo.

## Como funciona a cobertura CIDR

Um bloco CIDR representa uma rede de tamanho de potência de dois alinhada em um limite correspondente. Quando um intervalo começa ou termina no meio desses limites, um bloco não é suficiente. O conversor continua pegando o maior bloco alinhado que cabe e depois repete até que toda a faixa seja coberta.

## Por que vários blocos podem aparecer

Intervalos como 192.168.1.10 a 192.168.1.25 não começam em um limite de rede limpo e também não terminam em um. O resultado exato é, portanto, uma pequena lista de blocos, cada um cobrindo uma porção alinhada sem incluir endereços extras fora do intervalo solicitado.

## Quando isso é útil

Use-o ao preparar regras de firewall, resumos de rotas, entradas de ACL, grupos de segurança de nuvem ou listas de verificação de migração em que um intervalo inicial e final bruto precisa se tornar uma notação CIDR padrão.
