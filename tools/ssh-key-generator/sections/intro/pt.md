## O que é um par de chaves SSH?

Um par de chaves SSH é formado por uma chave pública e uma chave privada usadas para autenticar em servidores, hosts Git, sistemas de implantação e outros serviços baseados em SSH. A chave pública pode ser compartilhada. A chave privada deve permanecer secreta.

Este gerador cria chaves Ed25519 ou RSA no formato OpenSSH inteiramente no seu navegador. Ele também mostra a impressão digital SHA-256, que é o valor compacto que o OpenSSH costuma exibir quando você verifica uma chave.

## Quando usar esta ferramenta

- Crie uma chave de desenvolvimento para um servidor de teste, remoto Git, contêiner ou ambiente temporário de laboratório.
- Gere uma chave Ed25519 quando precisar de um padrão moderno e compacto para novo acesso SSH.
- Gere uma chave RSA quando um serviço mais antigo não oferecer suporte a Ed25519.
- Copie uma chave pública para `authorized_keys` mantendo a chave privada no seu dispositivo.

## Como escolher um algoritmo

Ed25519 é o melhor padrão para a maioria das novas chaves SSH porque é pequeno, rápido e amplamente compatível com versões atuais do OpenSSH. RSA é útil para compatibilidade com equipamentos mais antigos, servidores Git legados ou requisitos de política que ainda esperam chaves RSA.

Para RSA, 4096 bits é um padrão conservador. Chaves menores de 2048 bits são mais rápidas e ainda são comuns, mas muitas equipes agora preferem 3072 ou 4096 bits para novas chaves de longa duração.

## O que levar em conta

- A chave privada produzida aqui não é criptografada. Adicione uma frase secreta com `ssh-keygen -p -f <key-file>` se precisar de uma.
- Armazene a chave privada com permissões restritivas, como `chmod 600 <key-file>`.
- Não cole chaves privadas em tickets, chats, logs ou páginas da web desconhecidas.
- Faça a rotação das chaves quando um laptop, segredo de CI ou backup contendo a chave privada puder ter sido exposto.
