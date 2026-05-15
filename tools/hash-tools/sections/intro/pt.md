A coleção de ferramentas de hash reúne os utilitários de hashing migrados para que você possa escolher o algoritmo certo antes de abrir uma ferramenta específica. Ela cobre hashes de arquivos do dia a dia, verificações de compatibilidade com sistemas legados, autenticação de mensagens com chave, strings de Subresource Integrity, hashing de senhas, verificação de senhas e checksums rápidos não criptográficos.

## Quando usar estas ferramentas

Use as ferramentas de hash criptográfico quando precisar de uma impressão digital repetível para texto ou arquivo, como comparar um arquivo baixado com um checksum SHA-256 publicado. Use HMAC quando o resultado precisar provar que alguém com um segredo compartilhado criou ou aprovou a mensagem. Use Argon2, bcrypt, PBKDF2 ou scrypt para fluxos de senhas e derivação de chaves, em que o custo configurável importa mais que a velocidade bruta.

## Escolha com segurança

Nem todo hash é adequado para segurança. MD4, MD5 e SHA-1 são úteis para sistemas legados e verificações de compatibilidade, mas não devem ser usados em novos projetos de integridade sensíveis à segurança. CRC, Adler-32, MurmurHash, CityHash e xxHash são checksums rápidos ou hashes de agrupamento, não assinaturas resistentes à adulteração. Quando não tiver certeza, prefira SHA-256 para checksums públicos, HMAC-SHA-256 para verificação com chave e Argon2id ou bcrypt para armazenamento de senhas.

## Privacidade e fluxo de trabalho

As ferramentas individuais desta coleção executam no navegador. Textos e arquivos são processados localmente pela ferramenta selecionada, a menos que essa ferramenta documente explicitamente um comportamento de consulta pública, algo de que as ferramentas de hash não precisam. Para material sensível, limpe os valores gerados após o uso e evite colar segredos em sessões de navegador compartilhadas ou gravadas.
