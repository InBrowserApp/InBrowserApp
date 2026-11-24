## Como conectar um teclado ou controlador MIDI

Conecte um dispositivo MIDI e verifique se o sistema operacional o reconhece. Selecione **Ativar MIDI**, permita o acesso MIDI no navegador se solicitado e escolha uma entrada. Use um navegador compatível e acesse a página por HTTPS. O monitor recebe as mensagens da entrada selecionada e as exibe localmente.

## Como testar notas e velocidade

Pressione uma tecla ou um pad e observe o teclado de piano e o registro de mensagens. Note On mostra a nota e sua velocidade, normalmente um valor de 1 a 127. Note Off ou um Note On com velocidade 0 libera a nota. O teclado identifica a nota MIDI 60 como C4. Altere a oitava inicial para visualizar outra faixa. As notas pressionadas são listadas mesmo quando estão fora da faixa exibida.

## Como examinar CC, pitch bend e MIDI Clock

Mova um botão giratório, fader ou pedal para ver seu número de Control Change (CC) e seu valor. Por exemplo, muitos pedais de sustain enviam CC 64. O pitch bend é exibido com valor central 0. Os pulsos de MIDI Clock são contados separadamente do registro de mensagens. Um MIDI Clock padrão envia 24 pulsos por semínima. O registro inclui números de canal e bytes hexadecimais brutos para examinar mensagens individuais.

## Por que minha entrada MIDI não responde?

Verifique o cabo, a alimentação e o modo do dispositivo, e confirme se a porta selecionada corresponde ao controlador. Feche outros aplicativos que possam estar usando a entrada e reconecte o dispositivo. O suporte depende do navegador e do sistema operacional. Esta ferramenta recebe mensagens MIDI padrão com acesso MIDI normal. Mensagens System Exclusive (SysEx) específicas do dispositivo exigem permissão adicional.
