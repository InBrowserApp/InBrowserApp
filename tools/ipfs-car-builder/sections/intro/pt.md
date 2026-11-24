## Criar um ficheiro CAR a partir de ficheiros ou de uma pasta

Escolha ficheiros ou uma pasta e selecione **Criar CAR**. Copie o CID de raiz e guarde o arquivo `.car`. O navegador lê a seleção no seu dispositivo e reúne-a num arquivo CARv1 com uma raiz UnixFS. Pode guardar o arquivo como cópia de segurança ou importá-lo para um nó do IPFS ou um serviço de armazenamento.

## Como o arquivo preserva os seus ficheiros

Um único ficheiro torna-se a raiz. Vários ficheiros ficam juntos numa pasta de raiz. Ao selecionar uma pasta, os caminhos dos ficheiros são preservados. O seletor de pastas do navegador fornece os ficheiros e os respetivos caminhos. Se o navegador permitir arrastar e largar pastas, largue a pasta para incluir as subpastas vazias.

## O que significa o CID de raiz

O CID de raiz identifica o ficheiro ou a pasta incluída no arquivo. O gerador utiliza as mesmas definições predefinidas de CIDv1 que a Calculadora de CID do IPFS. Uma estrutura idêntica de ficheiros e pastas produz o mesmo identificador de conteúdo. Para adicionar o arquivo ao Kubo, execute `ipfs dag import archive.car` com o nome do ficheiro descarregado. [Referência de comandos do Kubo](https://docs.ipfs.tech/reference/kubo/cli/#ipfs-dag-import)
