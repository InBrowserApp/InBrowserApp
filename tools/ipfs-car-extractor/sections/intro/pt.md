## Abrir um ficheiro CAR do IPFS ou do Filecoin no navegador

Selecione um ficheiro `.car` no seu dispositivo. O extrator lê o arquivo localmente e apresenta o respetivo CID de raiz. Se o arquivo contiver várias raízes, escolha a que pretende. Os arquivos CAR (Content Addressable aRchives) são utilizados pelo IPFS e pelo Filecoin. Os catálogos de recursos da Apple têm a mesma extensão e utilizam outro formato.

## Extrair ficheiros ou converter uma pasta de um arquivo CAR em ZIP

Abra uma pasta para ver o conteúdo. Selecione um ficheiro e escolha **Descarregar ficheiro** para guardar os bytes originais. Para exportar uma pasta com as respetivas subpastas, escolha **Descarregar ZIP**. O ZIP preserva a estrutura de pastas UnixFS.

## O que significa faltar um bloco?

Um arquivo CAR armazena conteúdo em blocos identificados por CID. Uma raiz pode referenciar blocos que estejam fora de um arquivo parcial. Se faltar um bloco necessário para uma entrada, obtenha uma exportação completa da fonte ou descarregue uma entrada cujos blocos estejam disponíveis. Os ficheiros CAR também podem conter dados noutros formatos IPLD. Esta ferramenta extrai ficheiros e pastas UnixFS. [Formato CAR do IPLD](https://ipld.io/specs/transport/car/)
