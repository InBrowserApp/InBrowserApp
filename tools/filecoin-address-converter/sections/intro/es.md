## Convierte una dirección f410 de Filecoin a 0x

Pega una dirección `f410` o `t410` y selecciona **Convertir dirección**. El conversor comprueba la suma de comprobación de Filecoin y muestra la dirección `0x` equivalente en formato Ethereum, con la suma de comprobación EIP-55. Copia el resultado para usarlo en una cartera o un explorador de bloques que utilice direcciones en formato Ethereum en Filecoin. Con **Probar un ejemplo** puedes ver una conversión sin introducir tu propia dirección.

## Convierte una dirección 0x a Filecoin

Pega una dirección `0x` con 40 dígitos hexadecimales. Selecciona **Red principal** para obtener una dirección `f410` o **Red de pruebas Calibration** para obtener una dirección `t410`. El formato `0x` carece de prefijo de red, así que los mismos bytes se pueden escribir con cualquiera de los dos prefijos de Filecoin. Selecciona la red que utiliza tu cartera, explorador o plataforma de intercambio. Se aceptan entradas hexadecimales en minúsculas o en mayúsculas. Si combinan mayúsculas y minúsculas, deben superar la comprobación EIP-55.

## ¿Qué significan f410 y t410?

Son direcciones delegadas que utiliza la máquina virtual de Ethereum de Filecoin (FEVM). Una dirección `f410` o `t410` y su formato `0x` representan la misma dirección de 20 bytes en la red de Filecoin seleccionada. El formato nativo de Filecoin usa Base32 y su propia suma de comprobación. La conversión conserva los bytes originales y el FIL permanece en su red.

## ¿Puedo convertir direcciones f0, f1, f2 o f3?

Esta herramienta convierte direcciones delegadas de la FEVM en el espacio de nombres `10`, identificado por el prefijo `f410` o `t410`. Las direcciones de ID de actor, sus representaciones enmascaradas `0xff0000…` y otros tipos de direcciones de Filecoin quedan fuera del alcance de la herramienta. Para asociar algunos tipos de direcciones nativas con un actor se necesita el estado de la cadena. La conversión se ejecuta en tu navegador, sin llamadas RPC ni conexión a una cartera.

Consulta la [guía de Filecoin sobre tipos de direcciones y transferencias](https://github.com/filecoin-project/filecoin-docs/blob/main/networks-and-tools/assets/transfer-fil.md) y la [especificación de suma de comprobación EIP-55](https://eips.ethereum.org/EIPS/eip-55).
