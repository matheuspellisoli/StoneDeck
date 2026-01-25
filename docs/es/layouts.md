# Guía Técnica de Diseños

StoneDeck utiliza un motor de resolución inteligente que transforma bloques de Markdown en cuadrículas visuales optimizadas.

## 1. Reglas de Resolución Dinámica

A diferencia de los sistemas de diapositivas tradicionales, StoneDeck cuenta cuántos bloques de contenido proporcionas (separados por `*-*`) y selecciona la mejor variación del diseño elegido.

### Diseño: `title-and-content`
Ideal para diapositivas estándar con un encabezado. El primer slot siempre se trata como el **Título**.

| Slots | Esquema Visual | Uso Típico |
| :--- | :--- | :--- |
| **1** | Solo Título | Encabezado solitario |
| **2** | Título + Cuerpo Completo | Texto corrido o imagen grande |
| **3** | Título + 2 Columnas | Comparativos o Texto + Imagen |
| **4** | Título + 3 Columnas | Tres pilares o características |
| **5-6**| Título + Cuadrícula 3x2 | Galería de fotos o tarjetas de equipo |

### Diseño: `content`
Ocupa el lienzo total (respetando los márgenes de seguridad) sin un encabezado fijo.

| Slots | Esquema Visual |
| :--- | :--- |
| **1** | Pantalla Completa (Márgenes por Defecto) |
| **2** | 2 Columnas Iguales |
| **3** | 3 Columnas Iguales |
| **4** | Cuadrícula 2x2 |
| **6** | Cuadrícula 3x2 |
| **9** | Cuadrícula 3x3 (Mosaico) |

---

## 2. Diseños Especializados (Estáticos)

Estos diseños tienen regiones fijas definidas en el sistema:

- **`title`**: Reservado para el inicio de la presentación. Acepta 1 o 2 ranuras (Título y Subtítulo).
- **`section-header`**: Texto centrado para abrir nuevos capítulos. Acepta 1 ranura.
- **`big-number`**: Se centra en una métrica.
    - **Slot 1**: El número (ID interno `number`, fuente 6x más grande).
    - **Slot 2**: La descripción.

---

## 3. Comportamiento de Ranuras e Imagen

### Separación de Ranuras (Slots)
En Markdown, usa o separador de ranura canónico:
```markdown
# Slot 1
Contenido...
*-*
# Slot 2
Contenido...
```

### Reglas de Imagen y Sangrado
- **`image_fit: cover`**: La imagen llena el slot, ocultando espacios vacíos pero pudiendo recortar bordes.
- **`full_bleed: true`**: El contenido ignora los márgenes internos y se extiende hasta el borde físico de la diapositiva (ideal para fotos de fondo o impacto total).

## 4. Dimensiones del Lienzo
- **Resolución Lógica**: 720pt x 405pt (Proporción 16:9).
- **Margen de Seguridad**: 30pt (Superior, Izquierdo, Derecho).
- **Zona de Protección Inferior**: 15pt constantes en el pie de página para evitar recortes.
