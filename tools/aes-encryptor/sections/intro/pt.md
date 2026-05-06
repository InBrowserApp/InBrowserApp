# O que é criptografia AES?

AES é um algoritmo de criptografia simétrica, o que significa que o mesmo segredo é usado para criptografar e descriptografar os dados. Esta ferramenta roda inteiramente no seu navegador e usa a Web Crypto API, portanto texto claro, senhas e arquivos selecionados não são enviados.

O modo padrão é AES-GCM porque ele criptografa e autentica a saída. A autenticação é importante: se o texto cifrado, o salt ou o IV mudarem depois, a descriptografia deverá falhar em vez de retornar dados alterados. AES-CBC e AES-CTR estão disponíveis para compatibilidade, mas não autenticam o texto cifrado por conta própria.

## Quando usar esta ferramenta

Use-a quando precisar proteger uma nota, token, trecho de configuração ou arquivo pequeno antes de armazená-lo ou compartilhá-lo por outro canal. A saída é um envelope JSON contendo o modo, as configurações de derivação de chave, o salt, o IV e o texto cifrado, para que esses parâmetros permaneçam juntos na etapa de descriptografia correspondente.

Para criptografia baseada em senha, a senha é processada com PBKDF2 e um salt aleatório. Aumente a contagem de iterações quando puder tolerar criptografia e descriptografia mais lentas. Para criptografia com chave bruta, cole uma chave hexadecimal com exatamente o comprimento selecionado: 32 caracteres hexadecimais para 128 bits, 48 para 192 bits ou 64 para 256 bits.

## Notas práticas

Mantenha a senha ou a chave bruta separada do JSON criptografado. Qualquer pessoa com o JSON e o material da chave pode descriptografar os dados. Se você criptografar um arquivo, baixe o resultado JSON e mantenha o nome original do arquivo separadamente se esse contexto for importante.

Não reutilize um IV manual com a mesma chave. Esta ferramenta gera um IV e um salt novos a cada execução, que é o padrão mais seguro. Prefira AES-GCM, a menos que outro sistema exija especificamente AES-CBC ou AES-CTR.
