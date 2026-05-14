A descriptografia AES restaura o texto claro a partir de dados criptografados com o mesmo material de chave AES. Esta ferramenta foi projetada para o envelope JSON produzido pelo Criptografador AES do InBrowser.App. O envelope mantém juntos o algoritmo, as configurações de derivação de chave, o salt, o IV, o texto cifrado e os metadados do texto claro, enquanto a senha ou a chave bruta permanece separada.

Todo o processamento acontece localmente com a Web Crypto API do navegador. O JSON criptografado, a senha, a chave bruta e o resultado descriptografado não são enviados.

## Quando usar esta ferramenta

Use-a quando alguém lhe fornecer um envelope JSON `inbrowser-aes-v1` ou quando você precisar recuperar uma nota, token, trecho de configuração ou arquivo que criptografou anteriormente com a página correspondente do Criptografador AES.

Se o envelope foi criado com uma senha, informe a mesma senha e a ferramenta reutilizará o hash PBKDF2, a contagem de iterações, o salt, o modo AES e o comprimento de chave armazenados. Se o envelope foi criado com uma chave bruta, cole a chave hexadecimal exata com o comprimento registrado no envelope.

## Notas práticas

AES-GCM autentica os dados criptografados, portanto chaves incorretas ou JSON alterado devem falhar em vez de retornar texto claro modificado. AES-CBC e AES-CTR podem descriptografar envelopes compatíveis, mas não autenticam o texto cifrado por conta própria.

Mantenha a senha ou a chave bruta separada do envelope JSON. Qualquer pessoa com o envelope e o material da chave pode recuperar o texto claro. Para envelopes de arquivo, o download recuperado usa o nome original do arquivo e o tipo de mídia armazenados no JSON.
