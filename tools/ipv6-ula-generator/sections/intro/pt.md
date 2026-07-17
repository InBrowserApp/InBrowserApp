## O que é um endereço local único IPv6?

Um endereço local único (ULA) IPv6 é destinado à comunicação dentro de sites, redes privadas e organizações interconectadas. O espaço ULA completo é `fc00::/7`. Seu oitavo bit é o **bit L**: o valor `1` seleciona a faixa `fd00::/8` atribuída localmente e usada por este gerador, enquanto a metade `fc00::/8` permanece reservada para outro método de atribuição.

Endereços ULA não são globalmente alcançáveis por padrão, mas “local” não significa secreto nem automaticamente seguro. Eles podem atravessar limites roteados de sites, VPNs e interconexões privadas quando os operadores configuram esses caminhos.

## Como este gerador RFC 4193 cria um prefixo /48

Este gerador RFC 4193 solicita exatamente 40 bits aleatórios à Web Crypto API e os combina com `fd`. O resultado é um prefixo de site de 48 bits estatisticamente único, como `fd12:3456:789a::/48`. A geração permanece no navegador: ela não coleta endereço MAC, carimbo de data/hora, identificador do dispositivo nem resposta do servidor.

Existem `2^40` IDs globais possíveis — cerca de 1,1 trilhão. A aleatoriedade segura torna improvável a reutilização acidental, mas não garante que dois prefixos gerados independentemente jamais colidam. Registre o `/48` escolhido na documentação da rede e reutilize-o de forma consistente.

## Planejando as 65.536 sub-redes /64 disponíveis

Depois do prefixo de site `/48` vem um ID de sub-rede de 16 bits. Os valores de `0000` a `ffff` oferecem 65.536 redes `/64` possíveis. Por exemplo, o ID de sub-rede `00a0` transforma `fd12:3456:789a::/48` na rede canônica `fd12:3456:789a:a0::/64`.

Os 64 bits restantes formam o ID da interface. Esta ferramenta planeja apenas prefixos de rede; ela não gera endereços `/128` de host nem deriva identificadores de interface de endereços MAC.

## Onde usar ULAs — e onde não usar

ULAs funcionam bem para endereçamento interno estável, sites conectados por VPN, redes de laboratório e serviços que devem manter um prefixo interno enquanto também usam IPv6 unicast global. Eles não são um firewall nem um limite de segurança inerente. Aplique os controles de acesso normais, filtre tráfego ULA inadequado nos limites dos sites e mantenha registros ULA internos fora do DNS público.

Um host pode usar um ULA e um endereço unicast global ao mesmo tempo. Use o endereço global para obter conectividade com a Internet e o prefixo ULA duradouro nos caminhos privados que precisarem dele.
