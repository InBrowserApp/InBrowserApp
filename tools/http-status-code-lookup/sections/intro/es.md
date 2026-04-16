## ?Que es un codigo de estado HTTP?

Los codigos de estado HTTP son codigos de respuesta de tres cifras que devuelve un servidor para mostrar que ocurrio con una solicitud. Aparecen con frecuencia en las herramientas de desarrollador del navegador, respuestas de API, registros del servidor, monitores de disponibilidad y paneles de proxy inverso.

### Como leer las principales familias de codigos

- **1xx Informativo:** El servidor recibio la solicitud y el intercambio sigue en curso.
- **2xx Exito:** La solicitud se completo correctamente.
- **3xx Redireccion:** El cliente debe seguir otra ubicacion o reutilizar un resultado almacenado en cache.
- **4xx Error del cliente:** La propia solicitud tiene un problema, como un recurso inexistente, una entrada invalida o una autenticacion fallida.
- **5xx Error del servidor:** El servidor o una dependencia ascendente fallo mientras procesaba una solicitud valida.

### Cuando resulta util este lookup

Usa esta herramienta cuando necesites confirmar el significado de un codigo, comparar codigos parecidos como 401 frente a 403 o 502 frente a 504, o buscar a partir de una frase que aparece en un mensaje de error. La busqueda funciona por codigo, nombre del estado y descripcion localizada.

### Por que importa interpretarlo bien

Durante la depuracion, el codigo de estado suele ser la pista mas rapida. Una respuesta 4xx normalmente apunta a la solicitud, las credenciales o el recurso objetivo. Una respuesta 5xx suele apuntar a la aplicacion, la pasarela o un servicio ascendente. Leer primero la categoria ayuda a elegir mejor el siguiente paso.
