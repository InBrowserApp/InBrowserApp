## ¿Qué es NanoID?

NanoID es un generador compacto de identificadores únicos, seguro para URL, diseñado para aplicaciones web modernas, API y herramientas internas. El formato predeterminado usa 21 caracteres de un alfabeto de 64 caracteres, lo que ofrece aproximadamente 126 bits de aleatoriedad sin dejar de ser lo bastante corto para URLs, nombres de archivo y datos de prueba.

Todo en esta herramienta se ejecuta localmente en tu navegador. Tu alfabeto personalizado y los identificadores generados no salen de la página, por lo que resulta práctica para prototipos rápidos, generación de fixtures y tareas operativas puntuales.

**Puntos clave:**

- **Seguro para URL**: usa A-Z, a-z, 0-9, - y \_.
- **Personalizable**: ajusta la longitud y el alfabeto según tus restricciones.
- **Aleatoriedad segura**: usa valores aleatorios criptográficos en el navegador.
- **Exportación en texto plano**: copia o descarga el lote actual cuando necesites datos semilla, contenido de demostración o listas listas para importar.

**Recomendaciones prácticas:**

- Mantén la longitud predeterminada de 21 caracteres cuando necesites un identificador general sólido con una probabilidad de colisión muy baja.
- Los IDs más cortos sirven para tokens temporales de UI o datos mock locales, pero el riesgo de colisión aumenta a medida que reduces la longitud o generas lotes más grandes.
- Un alfabeto más amplio aporta más entropía por carácter, así que a menudo puedes usar IDs más cortos sin perder tanta unicidad.
- Los alfabetos personalizados solo deben contener caracteres únicos. Los duplicados alteran la distribución, por eso esta herramienta los bloquea antes de generar resultados.
