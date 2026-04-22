## ¿Qué es Local Font Access?

Local Font Access es una API del navegador que enumera las fuentes instaladas en tu dispositivo.

Esta herramienta te permite buscar resultados, comparar variantes relacionadas y copiar un fragmento CSS de la fuente elegida.

Solo funciona en contextos seguros y navegadores compatibles, y requiere permiso del usuario (local-fonts).

La API devuelve FontData con metadatos family, fullName, postscriptName y style.

### Puntos clave

- Úsala para confirmar los nombres exactos que necesitas en una pila CSS `font-family` en el dispositivo actual.
- Las llamadas deben iniciarse con un gesto del usuario.
- Permissions Policy puede bloquear el acceso en algunos sitios.
- Esta herramienta se ejecuta localmente y no sube fuentes.
