## Como conectar um dispositivo HID no navegador

Conecte um dispositivo de interface humana compatível, como um controle de jogo, joystick, pedal ou teclado de macros. Selecione **Conectar dispositivo** e escolha o dispositivo no seletor WebHID. O visualizador mostra o ID do fabricante (VID) e o ID do produto (PID), que ajudam a identificar o hardware. Use um navegador de desktop compatível em uma página HTTPS.

## Como ler coleções HID e IDs de relatório

Abra uma coleção para ver sua página de uso, uso e IDs de relatório. A página de uso agrupa funções relacionadas, enquanto o uso identifica uma função dentro desse grupo. Relatórios de entrada transportam dados do dispositivo, relatórios de saída descrevem dados que um host pode enviar e relatórios de recurso descrevem configurações ou estados específicos do dispositivo. O ID de relatório 0 significa que a interface não usa um ID de relatório explícito.

## Como inspecionar alterações nos bytes de entrada

Mova um controle por vez enquanto observa os relatórios em hexadecimal ao vivo. Os bytes destacados diferem dos dados anteriores com o mesmo ID de relatório. O ID do relatório é mostrado separado dos dados. Pause a captura para examinar os relatórios mais recentes ou limpe a lista e comece novamente. Consulte o formato de relatório do dispositivo para interpretar botões, eixos e outros campos.

## Por que meu dispositivo ou uma coleção não aparece?

Verifique se o sistema operacional reconhece o dispositivo e abra o seletor novamente. Os navegadores protegem coleções comuns de teclado e mouse, e alguns dispositivos disponibilizam apenas parte dos relatórios para a web. Este visualizador recebe relatórios de entrada do dispositivo selecionado e mantém os dados nesta aba. Para controles comuns, experimente o [Testador de gamepad](../gamepad-tester/) ou o [Testador de teclado](../keyboard-tester/).
