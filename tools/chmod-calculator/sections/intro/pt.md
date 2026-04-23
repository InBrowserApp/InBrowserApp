## O que é chmod?

`chmod` ("change mode") é um comando Unix/Linux usado para alterar permissões de arquivos e diretórios. Esta calculadora permite alternar entre permissões numéricas como `755`, permissões simbólicas como `rwxr-xr-x` e a matriz de caixas de seleção sem fazer a conta mentalmente.

## Como funcionam as permissões numéricas

Cada dígito representa um papel: proprietário, grupo e outros. Dentro de cada dígito, `4` significa leitura, `2` escrita e `1` execução. Some esses valores para montar a permissão desejada: `7 = rwx`, `6 = rw-`, `5 = r-x` e `4 = r--`. Em diretórios, o bit de execução também permite entrar no diretório.

## Exemplos comuns de chmod

- `chmod 755 script.sh` dá acesso total ao proprietário e permite que os demais leiam e executem.
- `chmod 644 notes.txt` mantém o arquivo gravável pelo proprietário, enquanto os outros só podem ler.
- `chmod 600 .env` é uma escolha comum para segredos privados, porque apenas o proprietário pode ler ou escrever.
- `chmod 775 shared-folder` é útil para diretórios de equipe quando o grupo também precisa criar e modificar arquivos.
