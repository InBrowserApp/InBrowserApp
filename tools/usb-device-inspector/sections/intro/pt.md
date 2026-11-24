## Como inspecionar um dispositivo USB no navegador

Conecte o dispositivo com um cabo que transmita dados, selecione **Selecionar dispositivo** e escolha-o na janela WebUSB do navegador. O cartão do dispositivo mostra o ID do fabricante (VID), o ID do produto (PID) e os dados de identificação disponíveis. A versão USB vem do descritor do dispositivo. A velocidade real da conexão também depende do cabo, da porta e do sistema operacional.

## Como ler configurações, interfaces e endpoints

Expanda uma configuração para ver as funções oferecidas por suas interfaces. Uma interface pode ter várias configurações alternativas, cada uma com sua própria classe, subclasse, protocolo e endpoints. Endpoints IN transportam dados para o host, enquanto endpoints OUT transportam dados para o dispositivo. O tipo e o tamanho do pacote descrevem como o endpoint transfere dados.

## O que a verificação de acesso informa?

Selecione **Verificar acesso** para saber se o navegador consegue abrir o dispositivo selecionado. A verificação usa o identificador do dispositivo e o libera em seguida. O acesso à interface ainda pode depender do driver do sistema operacional ou de outro aplicativo. O inspetor lê os descritores fornecidos pelo navegador e não altera as configurações do dispositivo.

## Por que não consigo ver ou abrir meu dispositivo USB?

Se o dispositivo não aparecer no seletor, tente um cabo de dados e verifique se o sistema operacional o reconhece. Se o navegador negar o acesso, verifique a permissão USB do site ou a política do navegador. Se a seleção funcionar, mas a abertura falhar, feche os aplicativos que possam estar usando o dispositivo e verifique os requisitos de driver para o dispositivo e a plataforma. Algumas classes USB são protegidas pelo navegador. Consulte [Informações do dispositivo](../device-information/) para conhecer os recursos deste navegador e sistema.
