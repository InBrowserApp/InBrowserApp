## O que é Keccak?

Keccak é uma família de funções hash criptográficas que serve como base para o padrão SHA-3 (Secure Hash Algorithm 3). Desenvolvido por Guido Bertoni, Joan Daemen, Michaël Peeters e Gilles Van Assche, venceu a competição de funções hash NIST em 2012.

**Características principais:**

- **Construção esponja**: Usa um design inovador de função esponja com fases de absorção e espremida
- **Comprimento de saída variável**: Pode produzir saídas hash de qualquer comprimento desejado
- **Alta margem de segurança**: Projetado com reservas de segurança substanciais
- **Diferente de SHA-1/SHA-2**: Baseado em princípios matemáticos completamente diferentes
- **Variante Keccak[c=2d]**: Esta implementação usa a especificação Keccak original com capacidade c = 2d (onde d é o comprimento da saída)

**Diferenças entre Keccak e SHA-3 (FIPS 202):**
🔍 **Distinção importante**: O Keccak original e o SHA-3 padronizado **não são idênticos**:

- **Keccak original**: Usa capacidade c = 2d e preenchimento diferente (preenchimento Keccak: 0x01)
- **FIPS 202 SHA-3**: Usa capacidade c = 2d mas preenchimento diferente (preenchimento SHA-3: 0x06)
- **Separação de domínio**: A diferença de preenchimento garante que Keccak e SHA-3 produzam saídas diferentes para a mesma entrada
- **Esta ferramenta implementa**: A **especificação Keccak original** com parametrização Keccak[c=2d]

**Status de segurança:**
✅ **Keccak é considerado altamente seguro** sem ataques práticos conhecidos. Fornece excelentes margens de segurança e resistência contra várias técnicas criptoanalíticas.

**Usos comuns:**

- Blockchain Ethereum (usa Keccak-256 original)
- Pesquisa acadêmica e protocolos criptográficos
- Aplicações que requerem saídas hash de comprimento variável
- Sistemas que precisam de alternativas à família SHA-2
- Implementações de blockchain e criptomoedas

**Vantagens sobre hashes tradicionais:**

- Design fundamentalmente diferente reduz risco de ataques relacionados
- Comprimento de saída flexível (não limitado a tamanhos fixos)
- Base de segurança teórica sólida
- Resistência a ataques de extensão de comprimento
- Excelente desempenho em várias plataformas

**Nota técnica:**

- **Keccak-256**: Produz saída de 256 bits (variante mais comum)
- **Fórmula de capacidade**: c = 2d garante nível de segurança apropriado
- **Uso Ethereum**: Ethereum especificamente usa Keccak-256 original, não SHA3-256
