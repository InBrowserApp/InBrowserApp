## ¿Qué es Data URI?

Data URI (o data URL) incrusta archivos pequeños directamente en el texto. Formato: `data:[mime][;charset][;base64],data`.

**Usos comunes:**

- Imágenes o fuentes incrustadas en HTML/CSS
- Guardar recursos pequeños en JSON/configs

**Notas:**

- Ideal para archivos pequeños; cadenas grandes pueden ralentizar la página
- Base64 es común para datos binarios

### Ejemplo

```text
data:image/svg+xml;base64,PHN2ZyB4bWxucz0i...
```

Todo lo que aparece antes de la coma describe el archivo, como su tipo MIME y si usa Base64. Todo lo que aparece después de la coma es la carga codificada.

### Cuándo conviene usar este convertidor

- Convertir un archivo local en una cadena lista para incrustar en HTML, CSS, JSON o plantillas de correo
- Crear una demo autocontenida sin alojar el recurso en otro lugar
- Revisar el tipo MIME detectado antes de pegar el resultado en otra herramienta

### Límites prácticos

- Los Data URI funcionan mejor con archivos pequeños, como iconos, imágenes pequeñas o fragmentos cortos
- Base64 añade aproximadamente un 33 % de sobrecarga, por lo que la cadena final es mayor que el archivo original
- Las cadenas muy largas pueden resultar incómodas de pegar en formularios, configuraciones o editores con límites de tamaño
