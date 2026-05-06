## O que é uma impressão digital de chave pública SSH?

Uma impressão digital de chave pública SSH é um resumo curto do blob da chave pública. Ela fornece um valor compacto para comparar antes de confiar em uma chave em `authorized_keys`, em um inventário de servidores ou em um fluxo de implantação.

O OpenSSH normalmente mostra impressões digitais SHA-256 como `SHA256:...`. Documentação mais antiga e algumas auditorias ainda usam impressões digitais MD5 separadas por dois-pontos. Esta ferramenta mostra ambos os formatos para que você possa comparar a saída SSH moderna e registros legados sem enviar a chave a lugar nenhum.

Cole uma única chave pública, várias linhas de `authorized_keys` ou um bloco de chave pública SSH2. O analisador ignora comentários e opções de authorized_keys, lê o blob real da chave SSH e calcula as impressões digitais localmente no seu navegador.

- Verifique se uma chave pública copiada corresponde à impressão digital compartilhada por um colega de equipe.
- Compare entradas de `authorized_keys` com uma lista de acesso do servidor.
- Inspecione tipo de chave, tamanho da chave, curva e comentário antes de copiar uma impressão digital.
