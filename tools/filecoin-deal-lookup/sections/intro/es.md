## Consulta un acuerdo de almacenamiento de Filecoin por su ID

Introduce el **ID del acuerdo** numérico (Deal ID) de un acuerdo del Storage Market en la red principal de Filecoin y selecciona **Consultar acuerdo**. **Probar un ejemplo** carga un registro público real para que puedas ver el estado, el proveedor, el cliente, las fechas y el Piece CID. La consulta abarca los acuerdos del Storage Market. Filecoin Onchain Cloud usa un ID propio para los conjuntos de datos.

## Cómo interpretar el estado de un acuerdo de Filecoin

Un acuerdo está activo si se ha registrado su activación y aún no ha llegado la fecha de fin prevista. Si está pendiente, todavía espera la activación y aún no ha llegado la fecha prevista de inicio. La consulta también muestra los casos en que pasó la fecha de inicio sin activación, el acuerdo venció o el estado del mercado registra una penalización. Las épocas de inicio y fin proceden de la propuesta del acuerdo. Sus fechas en UTC se calculan según el calendario de épocas de la cadena.

## Compara el Piece CID del acuerdo con tu archivo

El Piece CID es el compromiso registrado para la pieza de Filecoin. Cópialo y compáralo con el compromiso que genera la Calculadora de Piece CID de Filecoin para tu archivo local o CAR. El resultado también muestra el tamaño de la pieza tras aplicar el relleno de Filecoin. Un acuerdo verificado lleva el indicador de verificación de Filecoin Plus.

## Encuentra acuerdos anteriores de Filecoin

El navegador consulta primero el estado actual del mercado en la red principal de Filecoin. Si un acuerdo ya no figura en ese estado, el visor puede mostrar las condiciones originales indexadas por Filfox y las identifica como registro histórico. Esas condiciones incluyen las fechas previstas y las partes del acuerdo. **Ver en Filfox** abre el explorador con el mismo ID del acuerdo.

Consulta la [referencia RPC del Storage Market de Filecoin](https://docs.filecoin.io/reference/json-rpc/state#statemarketstoragedeal) para conocer los campos que devuelve la cadena.
