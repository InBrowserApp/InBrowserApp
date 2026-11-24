## Cómo inspeccionar un dispositivo USB en el navegador

Conecta el dispositivo con un cable que transmita datos, selecciona **Seleccionar dispositivo** y elígelo en el cuadro de diálogo de WebUSB del navegador. La tarjeta del dispositivo muestra el identificador de proveedor (VID), el identificador de producto (PID) y los campos de identificación disponibles. La versión USB procede del descriptor del dispositivo. La velocidad real de conexión también depende del cable, el puerto y el sistema operativo.

## Cómo leer las configuraciones, interfaces y puntos de conexión

Despliega una configuración para ver las funciones que ofrecen sus interfaces. Una interfaz puede tener varias configuraciones alternativas, cada una con su propia clase, subclase, protocolo y puntos de conexión. Los puntos de conexión IN transportan datos hacia el host y los OUT, hacia el dispositivo. El tipo y el tamaño de paquete indican cómo transfiere datos cada punto de conexión.

## ¿Qué indica la comprobación de acceso?

Selecciona **Comprobar acceso** para ver si el navegador puede abrir el dispositivo seleccionado. La comprobación utiliza el identificador de acceso al dispositivo y lo libera después. El acceso a las interfaces puede depender del controlador del sistema operativo o de otra aplicación. El inspector lee los descriptores proporcionados por el navegador y no modifica la configuración del dispositivo.

## ¿Por qué no puedo ver o abrir mi dispositivo USB?

Si el dispositivo no aparece en el selector, prueba un cable de datos y comprueba que el sistema operativo lo reconozca. Si el navegador deniega el acceso, comprueba el permiso USB del sitio o las políticas del navegador. Si puedes seleccionarlo pero no abrirlo, cierra las aplicaciones que puedan estar usándolo y comprueba los requisitos de controladores para tu dispositivo y plataforma. El navegador protege algunas clases USB. Consulta [Información del dispositivo](../device-information/) para ver las capacidades de este navegador y sistema.
