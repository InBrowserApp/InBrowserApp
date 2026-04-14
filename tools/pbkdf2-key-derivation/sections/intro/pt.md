## O que é PBKDF2?

PBKDF2 (Password-Based Key Derivation Function 2) deriva uma chave criptográfica de uma senha usando salt e muitas iterações. Ele desacelera ataques de força bruta e produz chaves diferentes quando o salt muda.

**Pontos principais:**

- Usa HMAC com um hash escolhido (SHA-1/SHA-256/etc.)
- Mais iterações aumentam o custo de computação
- O comprimento de saída é configurável

**Boas práticas:**

- Use um salt único e aleatório
- Prefira mais iterações dentro de uma performance aceitável
- Para sistemas novos, considere Argon2 ou scrypt
