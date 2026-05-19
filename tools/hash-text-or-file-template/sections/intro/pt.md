## O que é um hash de texto ou arquivo?

Uma função hash transforma texto ou bytes de arquivo em um resumo de tamanho fixo. A mesma entrada e o mesmo algoritmo sempre produzem o mesmo resumo, por isso hashes são úteis quando você precisa de uma impressão digital repetível sem enviar dados privados.

## Quando usar esta ferramenta

Use esta ferramenta para verificar somas de verificação de downloads, comparar se dois arquivos são idênticos, registrar rapidamente uma impressão digital para um trecho de texto ou depurar sistemas que publicam resumos SHA. Ao importar um arquivo, o hash é calculado diretamente a partir dos bytes do arquivo, enquanto o modo de texto calcula o hash do texto UTF-8 mostrado no editor.

## Escolhendo um algoritmo

SHA-256 é uma boa opção padrão para novas verificações de integridade. SHA-384 e SHA-512 fornecem resumos SHA-2 mais longos quando outro sistema espera esses formatos. SHA-1 está incluído para comparação com sistemas legados, mas não deve ser usado em novos projetos sensíveis à segurança.

## Privacidade e limitações

O hashing é executado localmente no seu navegador por meio de Web Crypto, e os arquivos não são enviados. Um hash não é criptografia: ele não consegue proteger um segredo por si só, e o armazenamento de senhas precisa de uma função dedicada de hashing de senhas com salt e fator de trabalho.
