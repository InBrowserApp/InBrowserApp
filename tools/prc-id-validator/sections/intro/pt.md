## O que é um ID de residente da RPC?

O número de ID de residente da RPC tem 18 caracteres e inclui código de endereço, data de nascimento, código de sequência e dígito verificador. Este validador verifica essas partes offline e ajuda a entender como o número é estruturado.

### Como a validação funciona

- Remove espaços e hífens e normaliza o último caractere para `X` maiúsculo
- Exige exatamente 18 caracteres: 17 dígitos mais um dígito final ou `X`
- Compara os 6 primeiros dígitos com o conjunto de divisões administrativas de 2023 e analisa a data de nascimento de 8 dígitos
- Recalcula o dígito verificador a partir dos primeiros 17 dígitos e o compara com o último caractere

### O que o resultado mostra

- Desdobramento regional: província, cidade, distrito/condado e o código bruto da região
- Data de nascimento, idade atual, código de sequência e o gênero derivado do código de sequência
- O ID normalizado junto com o dígito verificador esperado e o real para depuração

### Exemplo

`110101199001010015` pode ser lido assim:

- `110101` -> distrito de Dongcheng, Pequim
- `19900101` -> data de nascimento `1990-01-01`
- `001` -> código de sequência
- `5` -> dígito verificador

### Observação importante

Esta ferramenta realiza apenas validação estrutural e de checksum offline. Um número que passa nessas verificações não prova que corresponda a uma identidade real nem a um documento atualmente ativo.

Os nomes das regiões são baseados no conjunto de divisões administrativas de 2023.
