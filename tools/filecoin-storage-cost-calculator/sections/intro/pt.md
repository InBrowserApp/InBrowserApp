## Estimar os custos de armazenamento na Filecoin Onchain Cloud

Introduza o tamanho dos dados, o **Período de conservação (dias)** e o número de **Cópias**. A calculadora estima o custo de armazenar um novo conjunto de dados por cópia com o Filecoin Warm Storage Service. Apresenta a tarifa mensal de armazenamento e geração de provas, a despesa para o período selecionado e as taxas de criação dos conjuntos de dados e de adição de peças. Os montantes são expressos em USDFC. O mês de faturação do Filecoin tem 30 dias.

## Como é calculada a estimativa de armazenamento

Cada conjunto de dados ativo está sujeito a uma tarifa de armazenamento baseada no tamanho e a uma taxa fixa de prova de posse dos dados (Proof of Data Possession, PDP). Por exemplo, com uma tarifa de armazenamento de 2,50 USDFC por TiB e uma taxa de prova de 0,12 USDFC por cópia, armazenar um TiB em duas cópias custa cerca de 5,24 USDFC a cada 30 dias. A estimativa usa o tamanho dos dados que introduzir. O Filecoin calcula o tamanho exato a faturar a partir dos nós folha que contêm dados, o que pode acrescentar até 31 bytes por peça.

## Planear as taxas de envio e a reserva reembolsável

Abra **Detalhes do envio** para indicar quantas peças e lotes de envio terá cada cópia. A estimativa começa com um lote por cópia. Deixe o número de peças em branco para estimar o mínimo a partir do limite de envio de 63,5 GiB do SDK do Synapse ou introduza as quantidades reais. Cada cópia tem a sua própria taxa de criação do conjunto de dados. A adição de peças tem uma taxa base por lote e uma taxa por peça. A reserva para o ciclo de vida é um saldo que o serviço retém para cobrir operações. A reserva apresentada é separada da despesa estimada e os fundos não utilizados são libertados após a liquidação. A estimativa abrange um novo envio e o respetivo período de armazenamento. A recuperação de dados e as operações posteriores têm custos próprios. Consulte os [limites de tamanho do SDK do Synapse](https://docs.filecoin.cloud/developer-guides/synapse/#size-constraints).

## De onde vêm as tarifas do Filecoin

A página calcula com as tarifas de referência datadas que aparecem junto ao resultado. Selecione **Atualizar tarifas da rede principal** para consultar o contrato de preços do Warm Storage através de um RPC público do Filecoin. O navegador utiliza as tarifas devolvidas e mostra o bloco de onde vieram. Pode efetuar o cálculo com as tarifas de referência mesmo quando esse pedido não estiver disponível.

Consulte o [guia de custos de armazenamento do Filecoin](https://docs.filecoin.cloud/developer-guides/storage/storage-costs/) para conhecer os tamanhos exatos faturados, o financiamento necessário para cada conta e a tabela completa de taxas.
