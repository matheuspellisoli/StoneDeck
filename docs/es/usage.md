# Guía de Uso

## Comandos CLI

StoneDeck CLI te permite convertir tus archivos Markdown en presentaciones profesionales.

### Comando Export (Recomendado)
```bash
stonedeck export <archivo-entrada> [opciones]
```

### Comando Preview
Genera un HTML temporal (`.preview.html`) y permite observar los cambios en tiempo real. Por defecto, **no utiliza el modo offline** para garantizar una mayor velocidad.
```bash
stonedeck preview <archivo-entrada> [opciones]
```

**Formato Único:** El CLI genera archivos **HTML** optimizados. Para obtener un PDF, utilice la función "Imprimir como PDF" de su navegador.

**Opciones:**
- `--output, -o`: Define la ruta del archivo de salida.
- `--theme, -t`: Sobrescribe el tema definido en el archivo.
- `--watch, -w`: (Solo Preview) Observa cambios en el archivo y actualiza automáticamente.
- `--no-offline`: Desactiva la conversión automática de imágenes a Base64 (genera el archivo más rápido).
- `--debug`: Guarda el estado intermedio (IR) en `.ir.json`.

---

### Ejemplos

**Exportar a PDF (vía HTML):**
1. Genere el HTML: `stonedeck export diapositivas.md`
2. Abra el archivo en su navegador y use **Ctrl+P** (Imprimir).
3. Seleccione "Guardar como PDF" y asegúrese de activar "Gráficos de fondo".

**Modo Watch (Preview en tiempo real):**
```bash
stonedeck preview diapositivas.md --watch
```

**Exportar HTML "Online" (sin Base64):**
```bash
stonedeck export diapositivas.md --no-offline
```

**Exportar a HTML (Offline):**
```bash
stonedeck export diapositivas.md --output mi-clase.html
# Genera mi-clase.html (Modo Offline activado por defecto)
```

> [!TIP]
> **Modo Offline Automático**: Al exportar a HTML, StoneDeck convierte automáticamente todas las imágenes (locales y remotas) a Base64. Esto garantiza que tu presentación funcione en cualquier lugar, incluso sin internet.

**Depuración:**
```bash
stonedeck export diapositivas.md --debug
```

---

## Estructura de Markdown

Los archivos StoneDeck comienzan con un **Manifiesto** (YAML Frontmatter) y separan las diapositivas con `---`.

### El Manifiesto (Encabezado)
El primer bloque define las configuraciones globales.

```yaml
---
StoneDeck: true
title: Mi Presentación
theme: default
author: Yo
---
```

### Separación de Diapositivas
Usa tres guiones (`---`) para iniciar una nueva diapositiva. Inmediatamente después de los guiones, define la configuración de la diapositiva en YAML.

```markdown
---
layout: title-and-content
title: "Título de la Diapositiva"
---
# Columna Izquierda
Contenido...

*-*

# Columna Derecha
Contenido...
```

Consulta [Layouts](./layouts) para obtener IDs de diseño válidos.
