# Bienvenido a StoneDeck

**StoneDeck** es un motor de presentaciones "agentic" diseñado para transformar Markdown simple en diapositivas **HTML** impresionantes y profesionales. Cierra la brecha entre el texto sin formato y las presentaciones de alto diseño, imponiendo un sistema de diseño estricto que garantiza la coherencia.

## Características Principales

- **Markdown Primero**: Escribe contenido, no coordenadas de píxeles.
- **Exportación HTML**: Genera diapositivas HTML interactivas que se pueden imprimir fácilmente a PDF.
- **Diseños Inteligentes**: Cuadrículas de tarjetas unificadas, métricas de números grandes y columnas divididas funcionan de inmediato.
- **Diseño Agente**: Parámetros como "Big Number" o "Cards" ajustan automáticamente tamaños de fuente y cuadrículas para el máximo impacto.

## Inicio Rápido

1.  **Instalar**:
    ```bash
    npm install -g @stonedeck/cli
    ```

2.  **Crear un archivo (`slides.md`)**:
    ```markdown
    ---
    theme: default
    ---
    layout: title-slide
    title: "Hola StoneDeck"
    subtitle: "Markdown a Magia"
    ---
    layout: cards
    title: "¿Por qué StoneDeck?"
    style:
      card: { background: "surface", shadow: true }
    ---
    # Velocidad
    Escribe en minutos.
    
    # Belleza
    Sistema de diseño garantizando calidad.
    ```

3.  **Generar**:
    ```bash
    stonedeck slides.md
    ```

¡Revisa el [Catálogo de Diseños](./layouts) o la [Guía de Estilos](./styling) para más!

---

### 🔗 Documentación Adicional
- [🤖 Prompts para IA](../prompts/system-prompt.md)
- [🗺️ Roadmap](./roadmap.md)

### 🌍 Idiomas
- [🇺🇸 English](../en/)
- [🇧🇷 Português do Brasil](../pt-br/)
