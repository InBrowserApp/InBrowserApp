## Como testar seu teclado

Selecione **Iniciar teste** e pressione e solte as teclas do seu teclado físico uma de cada vez. Cada tecla se ilumina enquanto você a mantém pressionada e fica marcada com um ponto quando você a solta. Teste Ctrl, Shift e Alt dos dois lados e confira o teclado numérico separadamente, se o seu teclado tiver um. Selecione **Redefinir** para apagar as marcas e repetir o teste.

## Teste combinações de teclas, rollover e ghosting

Experimente uma combinação que você usa em um jogo ou aplicativo. Por exemplo, mantenha `W`, `A`, `Shift` e `Space` pressionadas ao mesmo tempo. As quatro teclas devem aparecer em **Combinação atual**. O indicador **Máx. simultâneas** mantém o maior número de teclas que o navegador detectou ao mesmo tempo durante o teste, incluindo as modificadoras.

Rollover é a capacidade do teclado de registrar várias teclas ao mesmo tempo. Se uma tecla funciona sozinha, mas deixa de ser detectada em uma combinação específica, o teclado pode estar bloqueando essa entrada. Se aparecer uma tecla que você nunca pressionou, pode ser um acionamento fantasma (ghosting). Teste a combinação que apresenta o problema, já que o comportamento pode variar de um grupo de teclas para outro. [Demonstração de ghosting em teclados da Microsoft](https://www.microsoft.com/applied-sciences/projects/anti-ghosting-demo)

## Por que uma tecla não é detectada?

Selecione **Iniciar teste** novamente se você clicou fora da área de teste ou usou Tab ou Esc para sair dela. O próprio teclado ou o sistema operacional processa algumas teclas, como Fn e certas teclas de mídia. O navegador também pode interceptar um atalho antes que ele chegue à página. Se uma tecla de letra nunca responde quando pressionada sozinha, experimente em outro aplicativo para verificar se o problema se repete.

## Por que uma tecla diferente se ilumina?

O diagrama utiliza as posições físicas de um teclado ANSI de tamanho completo. No layout AZERTY francês, pressionar `A` pode iluminar `Q` no diagrama. Em **Última tecla**, você vê o valor gerado pelo seu layout, `a`, ao lado do código físico `KeyQ`. Se seu teclado for compacto, teste as teclas que ele tem. [Guia da MDN sobre códigos físicos de teclas](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code)
