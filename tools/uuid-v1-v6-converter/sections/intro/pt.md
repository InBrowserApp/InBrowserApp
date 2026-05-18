UUID v1 e UUID v6 contêm a mesma informação central: um carimbo de data/hora, uma sequência do relógio e um identificador de nó. UUID v1 armazena o carimbo de data/hora na ordem histórica dos campos UUID, enquanto UUID v6 reordena esses bits de carimbo de data/hora para que uma ordenação lexicográfica simples siga o tempo de criação de forma mais natural.

Use esta ferramenta quando precisar de mover identificadores entre sistemas que esperam disposições diferentes de UUIDs baseados em tempo. Cole um UUID v1 para obter o UUID v6 equivalente, ou cole um UUID v6 para recuperar a representação UUID v1. A conversão é determinística e mantém inalterados a sequência do relógio e os bytes do nó.

## Quando usar

- Migrar registos de armazenamento UUID v1 antigo para UUID v6 preservando os metadados de identidade.
- Depurar bases de dados, logs ou filas que misturam valores UUID v1 e UUID v6.
- Verificar se um valor UUID v6 corresponde ao valor UUID v1 esperado por uma integração mais antiga.

## Formato de entrada

O conversor aceita cadeias UUID canónicas com hífenes, cadeias UUID compactas de 32 caracteres, UUIDs em maiúsculas, valores `urn:uuid:` e UUIDs envolvidos por chavetas. Os resultados são sempre normalizados para a forma UUID canónica em minúsculas.

## Notas de privacidade e compatibilidade

UUID v1 e UUID v6 podem codificar o tempo de criação e informações de nó. Trate-os como identificadores operacionais, não como segredos, e evite expô-los quando os metadados de carimbo de data/hora ou de nó puderem ser sensíveis. Esta ferramenta é executada localmente no seu navegador e não carrega os seus UUIDs.
