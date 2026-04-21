## O que é SHAKE128 (FIPS 202)?

SHAKE128 (FIPS 202) é uma função de saída extensível (XOF) da família SHA-3. Ao contrário das funções hash de comprimento fixo, ela pode retornar qualquer quantidade de bits de saída mantendo uma força de segurança de 128 bits. É padronizada pelo NIST no FIPS 202 e baseada na construção de esponja do Keccak.

Essa flexibilidade importa quando um protocolo, formato de arquivo ou regra interna de checksum exige um comprimento específico de digest. Nesta ferramenta você pode gerar o hash de texto simples ou arquivos enviados e escolher o comprimento de saída em bits, desde que seja múltiplo de 8.

Os usos comuns incluem hash de protocolos, derivação de chaves, digests criptográficos de comprimento variável e fluxos de integridade de dados em que a mesma entrada e o mesmo comprimento de saída devem sempre produzir o mesmo resultado.
