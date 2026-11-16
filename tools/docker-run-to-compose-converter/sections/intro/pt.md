## O que faz

O Conversor Docker Run para Compose converte um ou mais comandos `docker run` em um
arquivo `docker-compose.yml` no navegador. Você pode examinar o YAML gerado,
copiá-lo ou baixá-lo antes de incorporá-lo ao seu projeto.

## Quando usar

Use-o quando quiser transformar um comando avulso de contêiner em uma definição
reproduzível de serviço Compose, ou quando quiser ver como portas, volumes,
variáveis de ambiente e sinalizadores de recursos são mapeados para o Compose.

## O que esperar

Opções comuns, como portas, variáveis de ambiente, política de reinicialização,
verificações de integridade, montagens e limites de recursos, são preservadas.
Sinalizadores não suportados ou ambíguos são apresentados como avisos para que
você possa revisar o resultado antes de usá-lo.
