# Gerador de chaves PGP

Use esta ferramenta para criar um par de chaves OpenPGP diretamente no seu navegador. Ela produz uma chave pública com armadura ASCII, uma chave privada, um certificado de revogação, um ID da chave e uma impressão digital para que você possa configurar fluxos de trabalho de e-mail criptografado, criptografia de arquivos, assinatura de versões ou recuperação de contas sem enviar o material da chave para um servidor.

## Quando usar

Chaves PGP são úteis quando você precisa de criptografia assimétrica: outras pessoas usam sua chave pública para criptografar dados para você ou verificar assinaturas, enquanto sua chave privada descriptografa dados e cria assinaturas. Um gerador baseado no navegador é conveniente para sessões curtas de configuração, demonstrações ou fluxos de trabalho locais em que você quer obter o resultado imediatamente.

## Como gerar um par de chaves

Insira um nome, e-mail ou ambos para que a chave tenha um ID de usuário reconhecível. Adicione um comentário opcional se quiser separar chaves de trabalho, projeto ou assinatura de versões. Escolha ECC para softwares OpenPGP modernos, ou RSA quando precisar de compatibilidade com ferramentas mais antigas. Uma frase de senha é opcional, mas altamente recomendada para qualquer chave privada que você pretenda manter.

## Tipos de chave e expiração

ECC usa Curve25519 e é o padrão porque é compacto e rápido. RSA está disponível em 2048, 3072 e 4096 bits para compatibilidade. A expiração é definida em dias; use 0 apenas para chaves que você gerencia ativamente e pode revogar. Períodos de expiração mais curtos reduzem o risco de longo prazo e facilitam hábitos de rotação.

## Como lidar com chaves privadas com segurança

Baixe a chave pública, a chave privada e o certificado de revogação como arquivos separados. Faça backup da chave privada em um gerenciador de senhas criptografado ou em armazenamento offline seguro, e mantenha o certificado de revogação em um local separado para poder retirar a chave se a chave privada for perdida ou exposta. Antes de publicar uma chave pública, compare a impressão digital por um canal confiável.
