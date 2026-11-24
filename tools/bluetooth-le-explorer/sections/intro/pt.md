## Como conectar um dispositivo Bluetooth Low Energy

Ative o Bluetooth e coloque o dispositivo em um modo que permita a conexão. Selecione **Conectar dispositivo** e escolha o periférico no navegador. Este explorador solicita acesso a serviços GATT comuns, como Battery Service, Device Information, Heart Rate e Environmental Sensing. Para um serviço GATT personalizado, insira seu UUID antes de abrir o seletor. Use um UUID de 16 bits, como `180F`, ou um UUID completo de 128 bits da documentação do dispositivo.

## Como ler características GATT

Expanda um serviço para ver suas características e as operações compatíveis. Selecione **Ler** para solicitar o valor atual. Hex mostra os bytes exatamente como foram recebidos, enquanto UTF-8 é útil para características que contêm texto. Um nível de bateria, uma medição ou outro valor binário pode precisar ser interpretado usando a especificação dessa característica.

## Como capturar notificações Bluetooth

Selecione **Inscrever-se** em uma característica com suporte a Notify ou Indicate. As atualizações aparecem com o horário e o UUID da característica. Baixe as últimas 100 notificações como arquivo JSON para analisá-las depois ou selecione **Cancelar inscrição** para interromper esse fluxo. A página mantém o registro localmente.

## Por que não consigo ver meu dispositivo ou seus serviços?

O suporte a Web Bluetooth depende do navegador e do sistema operacional. Use um navegador compatível em uma página HTTPS, mantenha o dispositivo por perto e desconecte-o de outros aplicativos se ele permitir apenas uma conexão. O navegador disponibiliza serviços GATT autorizados em periféricos Bluetooth LE. Dispositivos Bluetooth Classic, como fones de ouvido que oferecem apenas perfis de áudio, exigem outra interface.
