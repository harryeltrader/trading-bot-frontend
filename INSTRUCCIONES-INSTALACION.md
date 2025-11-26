# 🚀 Instrucciones de Instalación - Frontend Analytics

## ✅ Archivos Creados

### Tipos TypeScript
- ✅ `types/analytics.ts` - Interfaces de Analytics, Trade, y estadísticas

### Store Pinia
- ✅ `stores/analytics.ts` - Store global para gestión de analytics

### Composables
- ✅ `composables/useAnalytics.ts` - Hook reutilizable para analytics

### Componentes Analytics
- ✅ `components/Analytics/KpiCard.vue` - Tarjeta de KPI
- ✅ `components/Analytics/EquityCurveChart.vue` - Gráfico de equity curve
- ✅ `components/Analytics/TradesTable.vue` - Tabla de trades
- ✅ `components/Analytics/CalendarHeatmap.vue` - Heatmap de calendario

### Páginas
- ✅ `pages/upload.vue` - Subir archivos CSV
- ✅ `pages/journal.vue` - Dashboard principal

---

## 📦 Dependencias Necesarias

Ejecuta estos comandos en la terminal (PowerShell o CMD):

```bash
# Navegar al directorio del proyecto
cd c:\Users\harry\OneDrive\Documentos\trading-bot-frontend

# Instalar Plotly para gráficos
npm install plotly.js-dist-min

# Instalar date-fns para manejo de fechas (opcional)
npm install date-fns

# Instalar numeral para formateo de números (opcional)
npm install numeral
```

---

## ⚙️ Configuración del Entorno

Crea o edita el archivo `.env` en la raíz del proyecto:

```env
# Backend API URL
NUXT_PUBLIC_API_BASE_URL=http://localhost:8000
NUXT_PUBLIC_API_VERSION=v1
```

---

## 🏃 Ejecutar en Desarrollo

```bash
# Asegúrate de estar en el directorio del proyecto
cd c:\Users\harry\OneDrive\Documentos\trading-bot-frontend

# Ejecutar servidor de desarrollo
npm run dev
```

### URLs de Acceso

- **Upload CSV**: http://localhost:3000/upload
- **Journal Dashboard**: http://localhost:3000/journal

---

## 📋 Siguiente Paso

### 1. Instalar Dependencias
Ejecuta los comandos de instalación arriba mostrados.

### 2. Configurar Variables de Entorno
Crea el archivo `.env` con la URL del backend.

### 3. Verificar Backend
Asegúrate de que tu backend esté corriendo en `http://localhost:8000` con los siguientes endpoints:

- `POST /api/v1/analytics/upload-trades` - Subir CSV
- `GET /api/v1/analytics/summary` - Obtener KPIs
- `GET /api/v1/analytics/filter` - Filtrar trades

### 4. Ejecutar Proyecto
```bash
npm run dev
```

---

## 🎨 Componentes Adicionales Pendientes

Para completar el sistema, todavía necesitas crear:

- [ ] `pages/statistics.vue` - Estadísticas detalladas
- [ ] `pages/performance.vue` - Análisis de performance
- [ ] `components/Analytics/TradeDistributionChart.vue` - Pie chart
- [ ] `components/Analytics/ProfitHistogram.vue` - Histograma

---

## 🐛 Troubleshooting

### Error: npm no reconocido
Si npm no está en el PATH:
1. Abre PowerShell como Administrador
2. Verifica instalación de Node.js: `node --version`
3. Agrega npm al PATH o reinstala Node.js

### Error: Cannot find module 'plotly.js-dist-min'
Ejecuta: `npm install plotly.js-dist-min`

### Error de CORS desde el frontend
Verifica que tu backend tenga CORS habilitado para `http://localhost:3000`

---

## ✨ Features Implementadas

✅ Sistema de tipos TypeScript completo  
✅ Store Pinia con acciones y getters  
✅ Composable useAnalytics reutilizable  
✅ 4 componentes analytics profesionales  
✅ Página de upload con drag & drop  
✅ Dashboard de journal completo  
✅ Tabla de trades con sorting  
✅ Filtros de búsqueda  
✅ Responsive design  

---

## 🎯 Resultado Esperado

Una vez ejecutes `npm run dev`, deberías ver:

1. **Página Upload** (`/upload`)
   - Drag & drop para archivos CSV
   - Validación de archivos
   - Subida al backend

2. **Página Journal** (`/journal`)
   - 5 KPI cards en la parte superior
   - Gráfico de equity curve con Plotly
   - Heatmap de calendario
   - Tabla de trades con filtros

---

¡Listo para ejecutar! 🚀
