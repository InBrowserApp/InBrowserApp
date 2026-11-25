## Converter um endereço f410 do Filecoin para 0x

Cole um endereço `f410` ou `t410` e selecione **Converter endereço**. O conversor valida a soma de verificação do Filecoin e mostra o endereço `0x` equivalente em formato Ethereum, com uma soma de verificação EIP-55. Copie o resultado para uma carteira ou um explorador de blocos que utilize endereços em formato Ethereum no Filecoin. Selecione **Experimentar um exemplo** para ver uma conversão sem introduzir o seu endereço.

## Converter um endereço 0x para o formato Filecoin

Cole um endereço `0x` com 40 dígitos hexadecimais. Selecione **Rede principal** para obter um endereço `f410` ou **Rede de teste Calibration** para obter um endereço `t410`. O formato `0x` não contém um prefixo de rede, pelo que os mesmos bytes podem ser escritos com qualquer um dos prefixos do Filecoin. Selecione a rede utilizada pela sua carteira, explorador ou plataforma de negociação. São aceites valores hexadecimais inteiramente em minúsculas ou em maiúsculas. Os valores que misturam maiúsculas e minúsculas têm de passar a verificação EIP-55.

## O que significam f410 e t410?

São endereços delegados utilizados pela máquina virtual Ethereum do Filecoin (FEVM). Um endereço `f410` ou `t410` e o seu equivalente `0x` representam o mesmo endereço de 20 bytes na rede do Filecoin selecionada. O formato nativo do Filecoin utiliza Base32 e tem a sua própria soma de verificação. A conversão preserva os bytes originais e os FIL permanecem na respetiva rede.

## Posso converter endereços f0, f1, f2 ou f3?

Esta ferramenta converte endereços delegados da FEVM no espaço de nomes `10`, identificadas pelo prefixo `f410` ou `t410`. Os endereços de ID de ator, as respetivas representações mascaradas `0xff0000…` e outros tipos de endereços do Filecoin ficam fora deste âmbito. Associar certos tipos de endereços nativos a um ator requer o estado da cadeia. A conversão é feita no navegador, sem chamadas RPC nem ligação a uma carteira.

Consulte o [guia do Filecoin sobre tipos de endereços e transferências](https://github.com/filecoin-project/filecoin-docs/blob/main/networks-and-tools/assets/transfer-fil.md) e a [especificação EIP-55 sobre somas de verificação](https://eips.ethereum.org/EIPS/eip-55).
