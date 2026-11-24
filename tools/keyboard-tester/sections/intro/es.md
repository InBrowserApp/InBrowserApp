## Cómo probar tu teclado

Selecciona **Iniciar prueba** y pulsa y suelta las teclas de tu teclado físico una por una. Cada tecla se ilumina mientras la mantienes pulsada y queda marcada con un punto al soltarla. Prueba las teclas Ctrl, Shift y Alt de ambos lados, y comprueba por separado el teclado numérico si tienes uno. Selecciona **Restablecer** para borrar las marcas y repetir la prueba.

## Cómo probar combinaciones, rollover y pulsaciones fantasma

Prueba una combinación que uses en un juego o una aplicación. Por ejemplo, mantén pulsadas a la vez `W`, `A`, `Shift` y `Space`. En **Combinación actual** deberían aparecer las cuatro teclas. El indicador **Máx. simultáneas** conserva el mayor número de teclas que el navegador ha detectado a la vez durante la sesión, incluidos los modificadores.

El rollover es la capacidad del teclado de registrar varias teclas a la vez. Si una tecla funciona por separado pero deja de detectarse en cierta combinación, puede que el teclado esté bloqueando esa pulsación. Si aparece una tecla que nunca pulsaste, puede tratarse de una pulsación fantasma (ghosting). Prueba la combinación que te da problemas, ya que distintos grupos de teclas pueden comportarse de forma diferente. [Demostración de pulsaciones fantasma de Microsoft](https://www.microsoft.com/applied-sciences/projects/anti-ghosting-demo)

## ¿Por qué no se detecta una tecla?

Selecciona **Iniciar prueba** de nuevo si hiciste clic fuera o pulsaste Tab o Esc para salir de la zona de prueba. El propio teclado o el sistema operativo gestionan algunas teclas, como Fn y ciertas teclas multimedia. El navegador también puede interceptar un atajo antes de que llegue a esta página. Si una tecla de letra falla siempre al pulsarla sola, pruébala en otra aplicación para ver si el problema también ocurre allí.

## ¿Por qué se ilumina una tecla distinta?

El diagrama usa las posiciones físicas de un teclado ANSI de tamaño completo. Con la distribución francesa AZERTY, pulsar `A` puede iluminar `Q` en el diagrama. En **Última tecla** verás el valor que produce tu distribución, `a`, junto al código físico `KeyQ`. Si tu teclado es compacto, prueba las teclas que tiene. [Guía de MDN sobre códigos de teclas físicas](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code)

[Comprobador de ratón](../mouse-tester/)
