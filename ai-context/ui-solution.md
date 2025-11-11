# UI Design Brief - Intelligent Casino Research Assistant

## Objetivo

Diseñar una interfaz minimalista para visualizar y gestionar los resultados de investigación de casinos y promociones en NJ, MI, PA y WV.

> **Nota importante**: Esta es una prueba de concepto (POC). El backend no debe funcionar - se utilizarán datos mock

## Pantallas Principales

### 1. Dashboard Principal

**Contenido:**

- Vista general de estados (NJ, MI, PA, WV) con contadores de:
  - Casinos faltantes por estado
  - Promociones nuevas/mejoradas descubiertas
- Botón de acción: "Ejecutar investigación" (on-demand)
- Indicador de última ejecución programada
- Toggle o configuración para ejecución programada (diaria)

### 2. Vista de Casinos Faltantes

**Contenido:**

- Lista agrupada por estado (NJ, MI, PA, WV)
- Para cada casino faltante mostrar:
  - Nombre del casino
  - Estado
  - Fuente de información (ej: "NJ Gaming Commission")
  - Botón/acción para agregar a la base de datos
- Filtros por estado
- Búsqueda de casinos

### 3. Vista de Comparación de Promociones

**Contenido:**

- Lista de casinos con promociones comparadas (más de 100 items - requiere paginación/virtualización)
- Para cada casino mostrar:
  - Nombre del casino (`Name`)
  - Estado (`state.Name`, `state.Abbreviation`)
  - **Promoción actual** (en DB):
    - Nombre de la oferta (`Offer_Name`)
    - Tipo de promoción (`offer_type`)
    - Depósito esperado (`Expected_Deposit`)
    - Bono esperado (`Expected_Bonus`)
    - ID del casino (`casinodb_id`)
  - **Promoción descubierta** (nueva):
    - Nombre de la oferta
    - Tipo de promoción
    - Depósito esperado
    - Bono esperado
    - Indicador visual si es mejor (mayor `Expected_Bonus`) o alternativa
  - Botones de acción:
    - "Actualizar promoción" (si es mejor)
    - "Marcar como revisado"
    - "Ignorar"
- Filtros:
  - Por estado (NJ, MI, PA, WV)
  - Por tipo de oferta (`offer_type`)
  - Solo mejores ofertas (mayor `Expected_Bonus`)
  - Solo alternativas
- Búsqueda por nombre de casino
- Paginación o virtualización para manejar 100+ items
- Indicadores visuales:
  - Badge/color para promociones mejores
  - Badge/color para promociones alternativas

## Requisitos de Diseño

### Principios

- **Minimalista**: Enfoque en información esencial
- **Accionable**: Cada elemento debe tener una acción clara asociada
- **Escaneable**: Fácil de revisar rápidamente grandes cantidades de datos
- **Claro**: Diferenciación visual clara entre estados, tipos de promociones, y acciones

### Componentes Clave (shadcn/ui)

1. **Cards de Casino**: Información compacta con acciones visibles (Card component)
2. **Comparación lado a lado**: Promoción actual vs. descubierta (layout con Grid/Flex)
3. **Badges de Estado**: Visual para identificar mejor/alternativa/faltante (Badge component)
4. **Filtros y Búsqueda**: Acceso rápido a información específica (Input, Select, Combobox)
5. **Tabla de Datos**: TanStack Table con paginación, filtros y ordenamiento (Table component)
6. **Indicadores de Progreso**: Para ejecuciones de investigación en curso (Progress, Skeleton)
7. **Botones de Acción**: Acciones claras y visibles (Button component)
8. **Alertas/Notificaciones**: Feedback visual para acciones (Toast, Alert)

### Estados a Considerar

- Carga inicial
- Investigación en progreso
- Sin resultados
- Resultados disponibles
- Acciones completadas (feedback visual)

## Flujo de Usuario Principal

1. Usuario llega al dashboard → ve resumen de estados
2. Usuario hace clic en "Casinos faltantes" → ve lista filtrable
3. Usuario revisa y actúa sobre casinos faltantes (agregar/ignorar)
4. Usuario navega a "Comparación de promociones" → ve ofertas comparadas
5. Usuario revisa y actúa sobre promociones (actualizar/marcar/ignorar)

## Notas Técnicas

### Stack Tecnológico

- **shadcn/ui**: Componentes UI base (botones, cards, badges, filtros, tablas, etc.)
- **TanStack Query**: Para manejo de estado de datos, cache y sincronización (aunque sea mock data)
- **TanStack Table**: Para tablas con paginación, filtros, ordenamiento y virtualización (necesario para 100+ items)
- **Datos Mock**: Simular estructura del endpoint de Reel Edge DB sin backend funcional

### Estructura de Datos (Endpoint Reel Edge DB)

```json
{
  "casinodb_id": number,
  "Offer_Name": string,
  "offer_type": string,
  "Expected_Deposit": number,
  "Expected_Bonus": number,
  "Name": string, // Nombre del casino
  "states_id": number,
  "state": {
    "Name": string, // "West Virginia", "Pennsylvania", "Michigan", "New Jersey"
    "Abbreviation": string // "WV", "PA", "MI", "NJ"
  }
}
```

### Consideraciones de Implementación

- **No requiere autenticación/login**: Interfaz pública
- **Datos Mock**: Simular respuesta del endpoint con 100+ items para testing
- **Paginación/Virtualización**: Usar TanStack Table para manejar grandes volúmenes de datos eficientemente
- **Responsive**: Desktop-first, pero funcional en móvil
- **Estados de UI**: Carga inicial, investigación en progreso, sin resultados, resultados disponibles, acciones completadas
- **Acciones Mock**: Los botones de acción no deben hacer llamadas reales al backend (solo feedback visual)
