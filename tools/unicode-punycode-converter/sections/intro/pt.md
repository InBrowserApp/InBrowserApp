## Converter domínios entre Unicode e Punycode

Cole um domínio como `bücher.com` no campo **Domínio Unicode** para obter `xn--bcher-kva.com` no campo **Domínio ASCII**. Cole um domínio com `xn--` em **Domínio ASCII** para lê-lo em Unicode. Os campos se atualizam à medida que você digita, e você pode copiar qualquer uma das versões.

## Quando usar cada versão

O Punycode representa caracteres que não fazem parte do ASCII em nomes de domínio internacionalizados (IDNs) usando letras, dígitos e hífens ASCII. O rótulo convertido começa com `xn--`. Os rótulos que já estão em ASCII, como `com`, permanecem iguais. Use a versão ASCII nas configurações de DNS ou hospedagem que pedem esse formato. Use a versão Unicode para ler um domínio em um registro ou arquivo de configuração.

## O que colar no conversor

Insira somente o nome do host. Para `https://bücher.com/catalog`, cole `bücher.com`. A conversão também funciona para subdomínios. Por exemplo, `www.bücher.com` vira `www.xn--bcher-kva.com`.
