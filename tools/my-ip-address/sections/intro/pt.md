## O que esta ferramenta mostra

Esta ferramenta procura os endereços IPv4 e IPv6 públicos que os serviços externos podem ver na sua sessão atual do navegador. Se o navegador também puder expor candidatos de interface local por meio do WebRTC, a ferramenta os listará separadamente.

## Por que os resultados de IPv4, IPv6 e WebRTC podem ser diferentes

Seu endereço IPv4 e endereço IPv6 podem vir de diferentes caminhos de rede, ISPs ou configurações de tunelamento. Os candidatos WebRTC podem incluir endereços de LAN privados, endereços de interface IPv6 temporários ou rotas relacionadas a VPN que sites normais nem sempre exibem diretamente.

## Como funciona a pesquisa

A ferramenta consulta provedores de IP públicos, como Cloudflare, geojs.io, ip.sb e ipify.org, e então enriquece o endereço detectado com nome de host, ASN, organização, país, fuso horário e metadados de coordenadas, quando disponíveis. Isso significa que a ferramenta precisa de uma conexão ativa com a Internet e depende da qualidade de resposta desses serviços de terceiros.

## Por que um endereço pode estar faltando

Um endereço pode não aparecer se sua rede bloquear uma família de protocolos, sua VPN ou proxy filtrar a solicitação, seu navegador desabilitar a exposição WebRTC ou o serviço de pesquisa upstream estiver temporariamente indisponível. Se o IPv6 não estiver disponível na sua rede, ver apenas o IPv4 é normal.
