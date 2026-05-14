## O que é CityHash64?

CityHash64 é um algoritmo de hash não criptográfico rápido do Google que produz um valor de 64 bits (8 bytes). Ele é útil quando você precisa de uma impressão digital compacta e determinística para texto ou arquivos, e a velocidade importa mais do que a segurança criptográfica.

**Principais características:**

- **Rápido e determinístico**: A mesma entrada e seed sempre produzem o mesmo hash de 64 bits
- **Não criptográfico**: Não use CityHash64 para senhas, assinaturas, tokens ou verificações de integridade à prova de adulteração
- **Compatível com seed**: Deixe a seed em branco para CityHash64 padrão ou insira uma seed decimal ou hexadecimal `0x` quando precisar de um espaço de hash separado com seed
- **Processamento local**: Textos e arquivos são processados no navegador; arquivos enviados não são mandados para um servidor
- **Múltiplas codificações**: Os resultados são exibidos como valores hexadecimal, Base64, decimal e binário

**Usos comuns:**

- Tabelas hash e estruturas de dados
- Impressões digitais de arquivos sem finalidade de segurança
- Deduplicação e agrupamento de dados
- Chaves de cache e chaves de sharding
- Fixtures de regressão para sistemas que já usam CityHash64
- Indexação de banco de dados
