## Como o endereço é formado

O EUI-64 modificado insere `ff:fe` entre as duas metades do endereço MAC e inverte o bit universal/local no primeiro byte. Por exemplo, `00:11:22:33:44:55` vira o identificador de interface `211:22ff:fe33:4455`. Com o prefixo `2001:db8:1:2::/64`, o endereço resultante é `2001:db8:1:2:211:22ff:fe33:4455`.

Digite `fe80::/64` para obter um endereço link-local. Para acrescentar o nome da interface, use o [conversor de IPv6 link-local](/pt/tools/mac-address-to-ipv6-link-local-address-converter/). Para usar um endereço unicast na sua rede, escolha um prefixo /64 atribuído a ela. O exemplo usa um prefixo reservado para documentação.
