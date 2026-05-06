## O que a Sincronização de código horário por rádio faz

A Sincronização de código horário por rádio gera áudio no navegador que segue formatos comuns de sinais horários de rádio de ondas longas: JJY, BPC, DCF77, MSF e WWVB. Ela é útil quando um relógio radiocontrolado compatível não consegue receber o transmissor real em ambientes internos ou quando você quer testar como um relógio reage a um formato de estação conhecido.

## Como usar

Selecione a estação que corresponde ao relógio, coloque o alto-falante do dispositivo perto da área da antena do relógio, inicie o sinal e dê ao relógio tempo suficiente para captar pelo menos um quadro completo de um minuto. Mantenha o volume baixo no início e aumente-o apenas se o relógio não detectar o sinal.

## Precisão e limitações

A hora gerada vem do relógio do sistema deste dispositivo mais o deslocamento opcional, portanto sincronize o relógio do dispositivo antes de usar a ferramenta. Navegadores não conseguem emitir diretamente a portadora real de ondas longas; esta ferramenta usa uma aproximação de onda quadrada de frequência mais baixa que pode funcionar por meio de harmônicos em alguns dispositivos. Hardware, posicionamento do alto-falante e firmware do relógio afetam os resultados, e o áudio de indicativo de chamada JJY é omitido intencionalmente.
