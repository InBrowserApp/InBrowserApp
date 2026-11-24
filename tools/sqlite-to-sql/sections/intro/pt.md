## Como exportar SQLite para um arquivo SQL

Abra ou arraste um arquivo de banco de dados SQLite 3, como `.db`, `.sqlite` ou `.sqlite3`. A ferramenta gera um dump SQL automaticamente. Ative **Somente o esquema** para exportar a estrutura sem as linhas das tabelas e escolha **Baixar .sql** para salvar o script completo. Teste com o banco de exemplo para ver o resultado.

## O que um dump SQL do SQLite contém

Um dump SQL é um script de texto que permite recriar um banco de dados. Ele inclui instruções `CREATE` para tabelas, índices, visualizações e gatilhos. A exportação completa também inclui instruções `INSERT` com as linhas das tabelas. Use o dump para revisar mudanças no esquema com o Git, manter uma cópia de segurança legível ou transferir o banco para outro ambiente SQLite.

O arquivo de origem fica no seu dispositivo. Se o banco usa um log de gravação antecipada (WAL), exporte uma cópia independente. Use o aplicativo de origem ou o comando de backup do SQLite para incluir na cópia as alterações confirmadas no log.

## Como restaurar o dump SQL

Execute este comando para importar o script em um novo banco SQLite.

```sh
sqlite3 restored.sqlite < database.sql
```

Troque `database.sql` pelo nome do arquivo baixado. O script usa a sintaxe do SQLite. Se o banco usa tabelas virtuais ou extensões, restaure em uma instalação do SQLite com os módulos necessários.

Para explorar tabelas ou exportar resultados de consultas em CSV ou JSON, abra o [Visualizador SQLite](../sqlite-viewer/). Para criar um banco a partir de planilhas, use o [Conversor de CSV e Excel para SQLite](../csv-excel-to-sqlite/).
