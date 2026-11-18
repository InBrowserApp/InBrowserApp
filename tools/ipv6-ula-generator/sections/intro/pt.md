## Gerar um prefixo /48 ULA IPv6

Copie o prefixo `fd` gerado para a sua rede doméstica, laboratório ou VPN. Salve o `/48` escolhido com a configuração da rede para reutilizá-lo ao acrescentar sub-redes. Selecione **Gerar novo prefixo** quando quiser uma nova alocação.

## Calcular uma sub-rede /64

Insira um **ID da sub-rede** hexadecimal de `0000` a `ffff`. Por exemplo, o ID `00a0` dentro de `fd12:3456:789a::/48` resulta em `fd12:3456:789a:a0::/64`. Um `/48` permite 65.536 sub-redes `/64`, de modo que você pode atribuir prefixos separados à LAN, à rede Wi-Fi de visitantes e à VPN, por exemplo.

## De onde vem o prefixo fd

A RFC 4193 define o espaço de endereços locais únicos em `fc00::/7`. A metade de atribuição local, `fd00::/8`, começa com `fd`. O gerador usa a Web Crypto API do navegador para adicionar um ID global aleatório de 40 bits e formar o `/48`.

## Quando usar um endereço local único

Use ULA para manter endereços IPv6 estáveis dentro de uma rede ou entre locais conectados por VPN. Um dispositivo também pode usar um endereço IPv6 global para o tráfego da internet pública e manter o ULA para serviços internos.
