## Calcular um Piece CID a partir de um arquivo CAR ou de um ficheiro

Escolha exatamente o ficheiro que pretende enviar a um fornecedor de armazenamento do Filecoin. Selecione **Calcular Piece CID** e copie o identificador de que precisa. A ferramenta também apresenta, em bytes, o tamanho da peça após preenchimento. O navegador lê o ficheiro localmente e processa-o por segmentos, pelo que o conteúdo fica no seu dispositivo.

## Que formato devo utilizar?

O **Piece CID (v2)** segue a especificação [FRC-0069](https://github.com/filecoin-project/FIPs/blob/master/FRCs/frc-0069.md). Normalmente começa por `bafkzci` e contém as informações sobre o tamanho dos dados de que as ferramentas mais recentes do Filecoin precisam. O **CommP legado (v1)** começa normalmente por `baga6ea4` e é utilizado nos acordos de armazenamento tradicionais do Filecoin. Se precisar de um Piece CID legado e do tamanho da peça após preenchimento, copie o compromisso legado e utilize o tamanho que aparece ao lado. Pode colar qualquer um dos formatos para verificar um compromisso existente com o seu ficheiro. Ficheiros que diferem apenas no número de bytes a zero no fim podem gerar o mesmo CommP legado.

## Porque é que o meu CID do IPFS é diferente?

Um CID de raiz do IPFS identifica um bloco ou a raiz de um ficheiro ou pasta. Um Piece CID do Filecoin é um compromisso criptográfico relativo aos bytes exatos dos dados a armazenar, depois de aplicadas as regras de preenchimento e cálculo de hash do Filecoin. Se os dados a armazenar estiverem num arquivo CAR, calcule o compromisso a partir do próprio arquivo. Dois arquivos CAR podem ter o mesmo CID de raiz do IPFS e guardar os blocos por uma ordem diferente, o que pode alterar o Piece CID. Ao submeter um acordo de armazenamento, utilize exatamente o mesmo ficheiro que usou para o cálculo.

Consulte as regras de formato e preenchimento na [especificação de peças do Filecoin](https://spec.filecoin.io/systems/filecoin_files/piece/).
