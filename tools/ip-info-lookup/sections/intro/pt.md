## O que esta ferramenta consulta

A Consulta de informações de IP resolve um endereço IPv4, endereço IPv6, domínio ou URL e mostra os metadados públicos que serviços da internet podem informar para cada endereço. Ela é útil quando você precisa inspecionar para onde um domínio aponta, qual rede é proprietária de um endereço, qual nome de host de DNS reverso existe ou se registros IPv4 e IPv6 levam a provedores diferentes.

## Como funcionam consultas de domínio e URL

Quando você insere um domínio ou URL, a ferramenta extrai o nome de host e consulta o resolvedor DNS-over-HTTPS selecionado para registros A e AAAA. Cada endereço retornado é então enriquecido separadamente, então domínios dual-stack podem mostrar países, ASNs, ISPs, nomes de host ou fusos horários diferentes para IPv4 e IPv6.

## O que os resultados significam

Campos de localização e ISP vêm de provedores públicos de metadados de IP, como geojs.io e ip.sb, enquanto nomes de host vêm de consultas PTR de DNS reverso quando disponíveis. Esses registros descrevem como bancos de dados públicos veem o endereço, não a localização física exata de uma pessoa ou dispositivo.

## Notas sobre privacidade e precisão

A consulta é executada no seu navegador e envia solicitações de DNS e metadados de IP para serviços de terceiros. VPNs, proxies, CDNs, redes móveis e plataformas de nuvem podem fazer com que a localização ou organização informada seja diferente do usuário final ou servidor que você esperava. Campos vazios são normais para endereços privados, reservados, recém-alocados ou pouco documentados.
