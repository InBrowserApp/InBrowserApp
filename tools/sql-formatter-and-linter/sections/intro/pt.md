## O que é SQL Formatter & Linter?

SQL Formatter & Linter reformata consultas SQL no navegador e, ao mesmo tempo, verifica um pequeno conjunto de problemas de alta relevância. É útil quando você quer um layout de consulta mais limpo, uso consistente de maiúsculas e minúsculas nas palavras-chave e retorno rápido sobre padrões de risco como `SELECT *` ou instruções `UPDATE` sem cláusula `WHERE`.

## Quando Usar

Use esta ferramenta quando estiver revisando SQL escrito à mão, limpando consultas coladas antes de compartilhá-las ou comparando a formatação entre diferentes dialetos de SQL. Ela funciona bem para revisão ad hoc de consultas, limpeza de pull requests e formatação apenas no navegador, sem enviar seu SQL a um servidor.

## O Que Ela Verifica

Esta versão mantém o formatador e o linter separados, mas coordenados. A formatação usa `sql-formatter` com opções de layout sensíveis ao dialeto, enquanto o lint mostra erros de análise, ponto e vírgula ausente, uso amplo de `SELECT *`, mutações inseguras, linhas longas e divergências no uso de maiúsculas e minúsculas das palavras-chave.
