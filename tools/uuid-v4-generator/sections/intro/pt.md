Gere um UUID v4 localmente no navegador quando precisar de um identificador novo para registros de teste, linhas de banco de dados, exemplos de API, payloads de eventos, fixtures ou arquivos de configuração. A ferramenta cria um UUID canônico em minúsculas por vez, mantendo o foco no fluxo de trabalho de valor único sem se sobrepor ao gerador em lote separado.

## O que UUID v4 significa

Um UUID v4 é um identificador de 128 bits em que os bits de versão e variante são fixos, e os 122 bits restantes vêm de dados aleatórios. Isso o torna útil quando você precisa de identificadores que não revelem hora de criação, informações da máquina, contadores sequenciais ou detalhes do usuário.

## Quando usar

Use UUID v4 para IDs gerados no cliente, objetos simulados, registros temporários, exemplos públicos e sistemas distribuídos em que coordenar um contador central seria incômodo. É uma boa opção padrão quando a ordem de classificação não é importante e você só precisa de um identificador com baixa probabilidade de colisão.

## Privacidade e confiabilidade

A geração ocorre nesta aba do navegador com Web Crypto, portanto o UUID não é enviado à InBrowser.App nem a outro serviço. Copie o valor quando ele estiver correto e gere outro sempre que precisar de um identificador novo para o próximo registro ou exemplo.
