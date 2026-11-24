## Como usar o terminal serial no navegador

Conecte seu Arduino, ESP32, Raspberry Pi Pico ou adaptador USB-serial com um cabo de dados. Defina a taxa de baud usada pelo dispositivo, como 9600 ou 115200, selecione **Conectar** e escolha a porta correspondente no navegador. Este monitor serial usa 8 bits de dados, sem paridade, um bit de parada e sem controle de fluxo (8N1).

## Envio de texto e bytes hexadecimais

O texto é enviado em UTF-8. Escolha LF, CR ou CR + LF se o dispositivo usar um final de linha para receber comandos. Para comandos binários, selecione **Hex** e insira bytes completos, como `41 54 0D 0A`. No modo Hex, os bytes são enviados como foram inseridos, sem final de linha automático.

## Leitura e salvamento de registros seriais

O registro mostra os dados recebidos (RX) e enviados (TX) com indicação de horário. Mude para Hex para examinar bytes individuais quando o texto aparecer ilegível. Pause a rolagem para examinar uma entrada anterior enquanto os dados continuam chegando, ou baixe o registro mantido como arquivo de texto. Os dados seriais permanecem nesta aba até que você escolha salvá-los.

## Por que não consigo conectar meu dispositivo?

Use um navegador atualizado com suporte a Web Serial e verifique se o sistema operacional reconhece a porta serial. Tente outro cabo e feche outros monitores seriais que já estejam usando a porta. Se o dispositivo se conectar, mas produzir texto ilegível, verifique a taxa de baud e tente visualizar os bytes em Hex.
