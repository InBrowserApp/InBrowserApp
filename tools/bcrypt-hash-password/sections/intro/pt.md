## O que é bcrypt?

bcrypt é um algoritmo de hashing de senhas projetado para armazenamento de senhas. Ele combina a senha com um salt aleatório e repete trabalho computacionalmente caro com base em um fator de custo, para que invasores precisem de mais tempo para testar cada tentativa.

## Quando usar esta ferramenta

- Gere um hash bcrypt para uma conta de teste, script de seed ou ambiente de desenvolvimento local.
- Compare como diferentes fatores de custo alteram o formato da saída e o tempo de execução.
- Crie um hash pronto para copiar sem enviar a senha a um servidor.

## Como escolher o fator de custo

Valores de custo mais altos são mais lentos e geralmente mais seguros, mas também tornam cada tentativa de login mais lenta para a sua aplicação. Um custo em torno de 10-12 é comum para sistemas interativos; valores mais altos podem ser razoáveis para fluxos exclusivos de administração ou de baixo volume. Teste o custo no mesmo tipo de hardware que verificará a senha.

## O que ter em mente

- Todo hash gerado usa um salt aleatório novo, portanto a saída muda mesmo quando a senha e o custo permanecem iguais.
- Armazene o hash bcrypt, não a senha original.
- Use bcrypt para senhas, não para checksums de arquivos, assinaturas ou hashing geral.
- Mantenha o comportamento de verificação constante e evite revelar se uma conta de usuário existe.
