## O que é xxHash (XXH3 128)?

XXH3 é o algoritmo xxHash moderno, projetado para velocidade muito alta e excelente distribuição. O XXH3 128 gera um valor hash de 128 bits (16 bytes), normalmente exibido como uma string hexadecimal de 32 caracteres. É um hash não criptográfico e também aceita uma semente opcional para resultados reproduzíveis.

**Principais características:**

- **Extremamente rápido**: Otimizado para alto desempenho em entradas grandes
- **Determinístico**: A mesma entrada e a mesma semente sempre produzem o mesmo hash
- **Não criptográfico**: Não é adequado para fins de segurança
- **Boa distribuição**: Útil para tabelas hash e indexação
- **Com semente**: A semente opcional ajuda a diferenciar as saídas do hash

**Usos comuns:**

- Tabelas hash e estruturas de dados
- Verificação de integridade de arquivos (sem foco em segurança)
- Deduplicação de dados e chunking
- Chaves de cache e indexação de banco de dados
- Pipelines de dados de alto throughput
