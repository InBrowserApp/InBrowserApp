# Calculadora de Checksum CRC

Checksums CRC (Cyclic Redundancy Check) são valores compactos usados para
detectar alterações acidentais nos dados. Eles são comuns em quadros de rede,
formatos de arquivo compactado, protocolos embarcados, atualizações de firmware
e fluxos de integridade de arquivos em que um valor rápido de detecção de erro é
mais útil do que uma assinatura criptográfica.

## Quando usar

Use esta calculadora quando precisar comparar valores CRC de documentação,
protocolos de hardware, formatos de arquivo ou outro sistema. Cole texto para
verificações rápidas ou importe um arquivo quando o checksum precisar ser
calculado a partir do fluxo exato de bytes.

## Variantes compatíveis

A ferramenta calcula as variantes comuns da ferramenta CRC legada do
InBrowser.App: CRC-1, CRC-8, CRC-8 1-Wire, CRC-8 DVB-S2, CRC-16,
CRC-16 CCITT, CRC-16 Modbus, CRC-16 Kermit, CRC-16 XModem, CRC-24, CRC-32,
CRC-32 MPEG-2, CRCJAM e vários modelos CRC-64, incluindo ECMA-182, GO-ISO, MS,
NVME, REDIS, WE e XZ.

## Pontos de atenção

Os nomes das variantes CRC importam. A mesma entrada pode produzir valores
diferentes dependendo do polinômio, do valor inicial, das configurações de
reflexão e do XOR final. Se você estiver comparando com um protocolo ou uma
especificação de fornecedor, escolha o resultado cujo nome de variante
corresponde a essa especificação, em vez de tratar todas as larguras de CRC como
intercambiáveis.

CRC foi projetado para detectar erros acidentais, não para armazenamento de
senhas, assinaturas ou segurança contra adulteração. Para verificações sensíveis
à segurança, use um fluxo de hash criptográfico ou assinatura em vez disso.
