## Como converter um endereço MAC em IPv6

Digite um endereço MAC de 48 bits com dois-pontos, hífens, pontos ou sem separadores. Adicione o prefixo de rede IPv6 `/64` que deseja usar. O conversor aceita as notações abreviada e completa. Todos os bits de host do prefixo devem estar zerados. O endereço IPv6 é atualizado enquanto você digita e fica pronto para copiar. O botão **Testar exemplo** preenche os dois campos.

## Como o EUI-64 modificado forma o endereço

Em uma sub-rede `/64`, o prefixo de rede fornece os primeiros 64 bits e o identificador de interface fornece os últimos 64. O EUI-64 modificado insere `ff:fe` entre as duas metades do endereço MAC e inverte o bit universal/local no primeiro byte. Por exemplo, `00:11:22:33:44:55` vira o identificador de interface `211:22ff:fe33:4455`. Com o prefixo `2001:db8:1:2::/64`, o endereço resultante é `2001:db8:1:2:211:22ff:fe33:4455`.

## Prefixos IPv6 comuns

- **Link-local.** Use `fe80::/64` para se comunicar no mesmo enlace. O botão **Usar prefixo link-local** preenche esse prefixo e mantém o endereço MAC que você digitou. Para acrescentar um nome de interface como `%eth0`, use o [conversor de IPv6 link-local](/pt/tools/mac-address-to-ipv6-link-local-address-converter/).
- **Endereço local único (ULA).** O botão **Usar exemplo ULA** preenche `fd12:3456:789a:1::/64`, um exemplo do intervalo `fd00::/8` destinado a redes internas. Para criar um prefixo único para a sua rede, use o [gerador de ULA IPv6](/pt/tools/ipv6-ula-generator/).
- **Unicast global.** Digite uma sub-rede `/64` do bloco que seu provedor de internet, provedor de nuvem ou administrador de rede atribuiu a você.
- **Documentação.** O prefixo `2001:db8:1:2::/64` faz parte do intervalo `2001:db8::/32`, reservado para documentação e exemplos.

## O resultado vai coincidir com o endereço IPv6 do meu dispositivo?

O resultado é o endereço calculado para o seu prefixo com EUI-64 modificado. Um dispositivo pode usar outro identificador de interface, como um identificador estável ou temporário gerado para preservar a privacidade. Se você já tem um endereço IPv6 cujo identificador de interface foi gerado a partir de um endereço MAC, pode recuperar esse MAC com o [conversor de IPv6 para MAC](/pt/tools/ipv6-address-to-mac-address-converter/).
