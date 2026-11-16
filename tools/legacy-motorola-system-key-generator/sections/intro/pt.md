## O que é uma chave de sistema legada da Motorola?

Uma chave de sistema por software é um arquivo `.KEY` usado por software de programação Motorola compatível para permitir a edição de configurações protegidas de sistemas troncalizados. Este gerador reproduz o formato legado derivado do BatLabs para um ID de sistema. Uma chave de sistema é diferente de uma chave de criptografia do tráfego de rádio e, por si só, não concede acesso a uma rede de rádio.

## Como usar este gerador

1. Insira um ID de sistema usando 1–4 dígitos hexadecimais (`0–9`, `A–F`), sem o prefixo `0x`. Letras minúsculas são aceitas, e IDs curtos são preenchidos com zeros à esquerda: `ab` se torna `00AB`.
2. Confira o ID normalizado, o nome do arquivo e a pré-visualização hexadecimal.
3. Baixe o arquivo binário `.KEY` e carregue-o em um software de programação legado compatível. O arquivo tem 27 bytes; o ID de sistema `1234` produz `SYS01234.KEY`.

## Limites de compatibilidade

Esta ferramenta segue um formato legado publicado; a compatibilidade depende do software de programação. Ela não é compatível com ASTRO 25 Portable CPS (incluindo XTS5000), APX CPS ou Advanced System Keys (ASK). A conformidade com o formato de bytes de referência não comprova a compatibilidade com um determinado rádio ou uma determinada versão de CPS.

## Privacidade

A geração, a validação e a pré-visualização dos arquivos são realizadas localmente no seu navegador. Seu ID de sistema e a chave gerada não são enviados a um servidor.
