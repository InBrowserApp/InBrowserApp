## O que é xxHash (XXH3 64)?

XXH3 é o algoritmo moderno do xxHash projetado para altíssima velocidade e excelente distribuição. XXH3 64 produz um valor de hash de 64 bits (8 bytes), geralmente representado como uma string hexadecimal de 16 caracteres. É um hash não criptográfico e suporta uma semente opcional para cálculos de hash reproduzíveis.

**Características principais:**

- **Extremamente rápido**: Otimizado para desempenho com entradas grandes
- **Determinístico**: A mesma entrada e a mesma semente sempre produzem o mesmo hash
- **Não criptográfico**: Inadequado para fins de segurança
- **Boa distribuição**: Excelente para tabelas de hash e indexação
- **Com semente**: Semente opcional para diversificar os resultados dos hashes

**Usos comuns:**

- Tabelas de hash e estruturas de dados
- Verificações de integridade de arquivos (sem fins de segurança)
- Remoção de duplicatas e divisão de dados em blocos
- Chaves de cache e indexação de bancos de dados
- Fluxos de processamento de dados com alta taxa de transferência
