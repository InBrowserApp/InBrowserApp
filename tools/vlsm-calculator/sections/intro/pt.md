## Como planejar sub-redes IPv4 com VLSM

Informe o bloco principal em notação CIDR, como 192.168.10.0/24. Adicione uma linha para cada rede e indique quantos endereços de host ela precisa, incluindo os que quiser reservar para um gateway ou futuras expansões. Calcule o plano para ver cada rede alocada com sua máscara, a faixa utilizável, o endereço de broadcast e os blocos CIDR que sobram.

O mascaramento de sub-rede de comprimento variável (VLSM) divide uma rede em sub-redes de tamanhos diferentes. A calculadora escolhe o menor bloco que atende a cada requisito e aloca primeiro os maiores, alinhados aos respectivos prefixos CIDR. Uma sub-rede padrão reserva os endereços de rede e de broadcast. Por exemplo, 50 hosts cabem em um bloco /26 com 62 endereços utilizáveis.

Use /31 apenas para um enlace IPv4 ponto a ponto que admita dois endereços utilizáveis. Use /32 para um só endereço, como o de uma interface de loopback do roteador. Nenhuma dessas opções tem endereço de broadcast. O cálculo é feito no seu navegador, onde também ficam os nomes das sub-redes.
