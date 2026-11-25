## Consultar um acordo de armazenamento do Filecoin pelo ID

Para consultar um acordo do Storage Market na rede principal do Filecoin, introduza o **ID do acordo** numérico (Deal ID) e selecione **Consultar acordo**. **Experimentar um exemplo** carrega um registo público real em que pode ver o estado, o fornecedor, o cliente, as datas e o Piece CID. A consulta abrange acordos do Storage Market. A Filecoin Onchain Cloud utiliza um ID distinto para os conjuntos de dados.

## Como interpretar o estado de um acordo do Filecoin

Um acordo está ativo se a sua ativação estiver registada e a data de fim prevista ainda não tiver chegado. Um acordo pendente aguarda ativação até ao fim da época de início prevista. A consulta também indica os casos em que a data de início passou sem ativação, o acordo expirou ou o estado do mercado regista uma penalização. As épocas de início e fim constam da proposta de acordo. As respetivas datas em UTC são calculadas a partir do calendário de épocas da cadeia.

## Comparar o Piece CID do acordo com o seu ficheiro

O Piece CID é o compromisso registado para a peça do Filecoin. Copie-o para o comparar com o compromisso calculado a partir do seu ficheiro local ou arquivo CAR com a Calculadora de Piece CID do Filecoin. O resultado também mostra o tamanho da peça após aplicar o preenchimento do Filecoin. Um acordo verificado tem o indicador de verificação do Filecoin Plus.

## Encontrar acordos anteriores do Filecoin

O navegador consulta primeiro o estado atual do mercado na rede principal do Filecoin. Se um acordo já não constar desse estado, a ferramenta pode mostrar as condições originais indexadas pelo Filfox e identifica-as como registo histórico. Essas condições incluem as datas previstas e as partes do acordo. **Ver no Filfox** abre o explorador para o mesmo ID do acordo.

Consulte a [referência RPC do Storage Market do Filecoin](https://docs.filecoin.io/reference/json-rpc/state#statemarketstoragedeal) para conhecer os campos devolvidos pela cadeia.
