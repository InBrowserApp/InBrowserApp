## Por que a decodificação Base85 importa

Base85 aparece quando dados binários precisam passar por sistemas apenas de texto com menos sobrecarga do que hexadecimal ou Base64. Você pode encontrá-lo em fluxos PostScript ou PDF, cargas Z85 do ZeroMQ, capturas de depuração, exportações arquivadas e ferramentas que precisam de caracteres imprimíveis em vez de bytes binários brutos.

## Como este decodificador ajuda

Esta ferramenta converte texto ASCII85 ou Z85 de volta para os bytes originais diretamente no navegador. Você pode colar dados codificados, importar um arquivo, trocar o alfabeto para corresponder ao sistema de origem, visualizar o resultado decodificado e baixar o binário recuperado sem enviar nada para um servidor.

## O que ter em mente

- ASCII85 e Z85 não são intercambiáveis. Escolher o alfabeto errado normalmente causa erros de decodificação ou saída corrompida.
- Base85 é um formato de codificação, não de criptografia. O resultado decodificado pode ser texto simples, conteúdo compactado ou dados binários arbitrários.
- Z85 exige grupos completos de 5 caracteres, enquanto ASCII85 também pode incluir delimitadores e atalhos como `z` para blocos de zeros.
