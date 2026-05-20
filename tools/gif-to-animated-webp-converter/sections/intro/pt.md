WebP animado pode manter o movimento de um GIF e, muitas vezes, gerar arquivos
menores para sites, prévias de produtos, documentação e recursos fáceis de
compartilhar em chats. Este conversor é executado localmente e, quando você
mantém as configurações padrão de escala, velocidade e loop, envia o GIF
original por um codificador `gif2webp` sem perdas e de tamanho mínimo antes de
exportar arquivos `.webp`.

## Quando usar

Use esta ferramenta quando você tiver GIFs animados que precisam de um formato
web mais moderno, especialmente para páginas em que o tamanho do arquivo e a
velocidade de carregamento importam. WebP animado tem suporte nos principais
navegadores atuais e pode preservar transparência, temporização e comportamento
de loop.

## Opções de conversão

A escala altera cada quadro antes da codificação, o que é útil quando um GIF é
maior do que o espaço onde será exibido. A velocidade altera o tempo de
reprodução sem descartar quadros. O comportamento de loop pode seguir o GIF de
origem, forçar reprodução infinita ou usar uma contagem personalizada para
recursos que devem parar após um número específico de reproduções. Manter a
escala em 100%, a velocidade em 1x e o comportamento de loop definido como
Seguir GIF usa o caminho padrão sem perdas e de tamanho mínimo.

## Privacidade e limitações

A conversão é executada no seu navegador. WebP sem perdas geralmente comprime
melhor animações no estilo GIF, mas não pode garantir que toda saída será menor;
GIFs pequenos ou já otimizados podem aumentar porque o contêiner WebP ainda tem
sobrecarga. Alterar escala, velocidade ou comportamento de loop exige
decodificação dos quadros e pode usar bastante memória em GIFs muito grandes. Se
o GIF de origem não contiver metadados de loop, a exportação padrão reproduz uma
vez, a menos que você escolha loop infinito ou personalizado.
