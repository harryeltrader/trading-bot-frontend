# 🎨 PLAN DE DESARROLLO COMPLETO: Trading Portfolio Frontend

## Sistema: Dashboard Analítico (Similar a MyFxBook)
**Stack:** Vue 3 + Nuxt 3 + Tailwind CSS + Plotly/Recharts
**Fecha:** Nov 25, 2025
**Versión:** 1.0 Plan Técnico

---

# PARTE 2: PLAN DE FRONTEND (Vue 3 + Nuxt)

## 2.1 Estructura de Páginas

### Arquitectura General

```
pages/
├── index.vue                          # Dashboard principal
├── journal.vue                        # 🆕 Journal de operaciones (PÁGINA PRINCIPAL)
├── statistics.vue                     # 🆕 Estadísticas y análisis
├── performance.vue                    # 🆕 Curva de capital y drawdown
├── trades.vue                         # 🆕 Tabla de todas operaciones
└── upload.vue                         # 🆕 Subir archivo CSV
```

---

## 2.2 Página Principal: Journal Analítico (`pages/journal.vue`)

**Este es el equivalente a la página de MyFxBook que viste**

### 2.2.1 Componentes que incluye

```
journal.vue
├── 📊 Sección 1: KPI Widgets (Resumen Superior)
│   ├── TotalProfit Card              (Ganancia total, %)
│   ├── WinRate Card                  (% operaciones ganadoras)
│   ├── ProfitFactor Card             (Ganancias / Pérdidas)
│   ├── MaxDrawdown Card              (Drawdown máximo)
│   └── StreakCard                    (Mejor racha)
│
├── 📈 Sección 2: Equity Curve Chart
│   ├── Gráfico línea (curva de capital)
│   ├── Tabla con balance por fecha
│   └── Heatmap (mejor/peor días)
│
├── 📊 Sección 3: Trade Distribution
│   ├── Pie chart (Ganadores vs Perdedores)
│   ├── Histograma (Distribución P&L)
│   └── Tabla resumen por símbolo
│
├── 🎯 Sección 4: Calendar Heatmap
│   ├── Calendario interactivo
│   ├── Colores según P&L diario
│   └── Hover para ver detalles
│
├── 📋 Sección 5: Tabla de Operaciones
│   ├── Listado ordenable
│   ├── Filtros (símbolo, fecha, status)
│   ├── Paginación
│   └── Búsqueda
│
└── 🔧 Controles
    ├── Date Range Picker
    ├── Symbol Filter
    ├── Status Filter (Ganador/Perdedor)
    └── Export to PDF/Excel
```

### 2.2.2 Código estructura `journal.vue`

```vue
<template>
  <div class="page-journal">
    <h1 class="page-title">📊 Journal de Trading - Análisis Completo</h1>
    
    <!-- SECCIÓN 1: KPI WIDGETS -->
    <section class="kpi-section">
      <KpiCard
        title="Ganancia Total"
        :value="analytics?.total_profit"
        :change="analytics?.total_profit_pct"
        icon="📈"
        color="green"
      />
      <KpiCard
        title="Win Rate"
        :value="`${analytics?.win_rate}%`"
        :trades="`${analytics?.winning_trades}/${analytics?.total_trades}`"
        icon="🎯"
        color="blue"
      />
      <KpiCard
        title="Profit Factor"
        :value="analytics?.profit_factor"
        :subtitle="'Ganancias / Pérdidas'"
        icon="📊"
        color="purple"
      />
      <KpiCard
        title="Max Drawdown"
        :value="analytics?.max_drawdown"
        :change="analytics?.max_drawdown_pct"
        icon="📉"
        color="red"
      />
      <KpiCard
        title="Mejor Racha"
        :value="analytics?.longest_win_streak"
        :subtitle="'operaciones ganadoras'"
        icon="🏆"
        color="gold"
      />
    </section>
    
    <!-- SECCIÓN 2: EQUITY CURVE -->
    <section class="equity-section">
      <EquityCurveChart 
        :data="analytics"
        :dates="analytics?.equity_dates"
        :values="analytics?.equity_curve"
      />
    </section>
    
    <!-- SECCIÓN 3: DISTRIBUCIÓN -->
    <section class="distribution-section">
      <div class="grid grid-cols-2">
        <TradeDistributionChart
          :winning="analytics?.winning_trades"
          :losing="analytics?.losing_trades"
          :break_even="analytics?.break_even"
        />
        <ProfitHistogram
          :data="analytics?.profit_distribution"
        />
      </div>
    </section>
    
    <!-- SECCIÓN 4: CALENDAR HEATMAP -->
    <section class="calendar-section">
      <CalendarHeatmap
        :daily-stats="analytics?.daily_stats"
        :best-day="analytics?.best_day"
        :worst-day="analytics?.worst_day"
      />
    </section>
    
    <!-- SECCIÓN 5: TABLA DE OPERACIONES -->
    <section class="trades-table-section">
      <div class="filters-row">
        <input
          v-model="filters.symbol"
          type="text"
          placeholder="Filtrar por símbolo (ej: EURUSD)"
          class="input"
        />
        <select v-model="filters.status" class="input">
          <option value="">Todos los estados</option>
          <option value="GANADOR">Ganador</option>
          <option value="PERDEDOR">Perdedor</option>
          <option value="BREAK_EVEN">Break Even</option>
        </select>
        <input
          v-model="filters.dateFrom"
          type="date"
          class="input"
        />
        <input
          v-model="filters.dateTo"
          type="date"
          class="input"
        />
        <button @click="applyFilters" class="btn btn-primary">
          Filtrar
        </button>
      </div>
      
      <TradesTable
        :trades="filteredTrades"
        :loading="loadingTrades"
        :total="analytics?.total_trades"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import { useAnalyticsStore } from '~/stores/analytics'

// Store y composables
const api = useApi()
const analyticsStore = useAnalyticsStore()

// State
const analytics = ref(null)
const trades = ref([])
const loadingTrades = ref(false)
const filters = ref({
  symbol: '',
  status: '',
  dateFrom: '',
  dateTo: '',
  minProfit: null,
  maxProfit: null
})

// Computed
const filteredTrades = computed(() => {
  // Lógica de filtrado en frontend (O hacer en backend)
  return trades.value.filter(trade => {
    if (filters.value.symbol && !trade.symbol.includes(filters.value.symbol)) return false
    if (filters.value.status && trade.status !== filters.value.status) return false
    return true
  })
})

// Métodos
const fetchAnalytics = async () => {
  try {
    const response = await api.get('/analytics/summary')
    analytics.value = response.data
    analyticsStore.setAnalytics(response.data)
  } catch (error) {
    console.error('Error cargando analytics:', error)
  }
}

const fetchTrades = async () => {
  loadingTrades.value = true
  try {
    const response = await api.get('/analytics/trades')
    trades.value = response.data
  } catch (error) {
    console.error('Error cargando trades:', error)
  } finally {
    loadingTrades.value = false
  }
}

const applyFilters = async () => {
  try {
    const response = await api.get('/analytics/filter', {
      params: {
        symbol: filters.value.symbol || undefined,
        status: filters.value.status || undefined,
        date_from: filters.value.dateFrom || undefined,
        date_to: filters.value.dateTo || undefined,
        min_profit: filters.value.minProfit,
        max_profit: filters.value.maxProfit
      }
    })
    trades.value = response.data.trades
  } catch (error) {
    console.error('Error aplicando filtros:', error)
  }
}

onMounted(() => {
  fetchAnalytics()
  fetchTrades()
})
</script>

<style scoped>
.page-journal {
  @apply space-y-8 p-8;
}

.page-title {
  @apply text-4xl font-bold text-white mb-8;
}

.kpi-section {
  @apply grid grid-cols-5 gap-4;
}

.equity-section,
.distribution-section,
.calendar-section,
.trades-table-section {
  @apply bg-gray-800 rounded-lg p-6 border border-gray-700;
}

.filters-row {
  @apply flex gap-4 mb-6 flex-wrap;
}

.input,
.btn {
  @apply px-4 py-2 rounded bg-gray-700 text-white border border-gray-600;
}

.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 cursor-pointer;
}

@media (max-width: 1024px) {
  .kpi-section {
    @apply grid-cols-2 lg:grid-cols-3;
  }
}

@media (max-width: 640px) {
  .kpi-section {
    @apply grid-cols-1;
  }
}
</style>
```

---

## 2.3 Componentes Reutilizables

### 2.3.1 KpiCard Component

```vue
<!-- components/Analytics/KpiCard.vue -->

<template>
  <div :class="`kpi-card kpi-${color}`">
    <div class="kpi-icon">{{ icon }}</div>
    <div class="kpi-content">
      <p class="kpi-title">{{ title }}</p>
      <p class="kpi-value">{{ formattedValue }}</p>
      <p v-if="change" :class="`kpi-change ${change >= 0 ? 'positive' : 'negative'}`">
        {{ change >= 0 ? '▲' : '▼' }} {{ Math.abs(change) }}%
      </p>
      <p v-if="subtitle" class="kpi-subtitle">{{ subtitle }}</p>
      <p v-if="trades" class="kpi-trades">{{ trades }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  title: String,
  value: [Number, String],
  change: Number,
  subtitle: String,
  trades: String,
  icon: String,
  color: { type: String, default: 'blue' }
})

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }
  return props.value
})
</script>

<style scoped>
.kpi-card {
  @apply bg-gradient-to-br p-6 rounded-lg border border-opacity-20 hover:shadow-lg transition;
}

.kpi-green {
  @apply from-green-900 to-green-800 border-green-600;
}

.kpi-blue {
  @apply from-blue-900 to-blue-800 border-blue-600;
}

.kpi-red {
  @apply from-red-900 to-red-800 border-red-600;
}

.kpi-purple {
  @apply from-purple-900 to-purple-800 border-purple-600;
}

.kpi-icon {
  @apply text-4xl mb-2;
}

.kpi-value {
  @apply text-2xl font-bold text-white;
}

.kpi-change {
  @apply text-sm font-semibold mt-1;
}

.kpi-change.positive {
  @apply text-green-400;
}

.kpi-change.negative {
  @apply text-red-400;
}

.kpi-subtitle,
.kpi-trades {
  @apply text-xs text-gray-300 mt-1;
}
</style>
```

### 2.3.2 Equity Curve Chart

```vue
<!-- components/Analytics/EquityCurveChart.vue -->

<template>
  <div class="equity-chart-container">
    <h2 class="chart-title">📈 Curva de Capital</h2>
    
    <div id="equity-chart" class="w-full h-96"></div>
    
    <div class="chart-stats">
      <div class="stat">
        <span>Capital Inicial:</span>
        <span class="font-bold">{{ formatCurrency(initialBalance) }}</span>
      </div>
      <div class="stat">
        <span>Capital Final:</span>
        <span class="font-bold">{{ formatCurrency(finalBalance) }}</span>
      </div>
      <div class="stat">
        <span>Drawdown Máximo:</span>
        <span class="font-bold text-red-400">{{ analytics?.max_drawdown }}</span>
      </div>
      <div class="stat">
        <span>Mejor Día:</span>
        <span class="font-bold text-green-400">{{ analytics?.best_day_profit }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Plotly from 'plotly.js-dist-min'

const props = defineProps({
  data: Object,
  dates: Array,
  values: Array
})

const initialBalance = ref(0)
const finalBalance = ref(0)

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}

onMounted(() => {
  if (props.values && props.dates) {
    initialBalance.value = props.values[0]
    finalBalance.value = props.values[props.values.length - 1]
    
    const trace = {
      x: props.dates,
      y: props.values,
      type: 'scatter',
      mode: 'lines',
      name: 'Equity',
      line: {
        color: '#10b981',
        width: 2
      },
      fill: 'tozeroy',
      fillcolor: 'rgba(16, 185, 129, 0.1)'
    }
    
    const layout = {
      title: '',
      xaxis: { title: 'Fecha' },
      yaxis: { title: 'Balance ($)' },
      hovermode: 'closest',
      plot_bgcolor: 'rgba(31, 41, 55, 0.5)',
      paper_bgcolor: 'rgba(17, 24, 39, 0)',
      font: { color: '#fff' }
    }
    
    Plotly.newPlot('equity-chart', [trace], layout, { responsive: true })
  }
})
</script>

<style scoped>
.equity-chart-container {
  @apply space-y-4;
}

.chart-title {
  @apply text-2xl font-bold text-white;
}

.chart-stats {
  @apply grid grid-cols-2 md:grid-cols-4 gap-4;
}

.stat {
  @apply flex justify-between items-center bg-gray-700 p-3 rounded;
}
</style>
```

### 2.3.3 Trades Table Component

```vue
<!-- components/Analytics/TradesTable.vue -->

<template>
  <div class="trades-table-container">
    <div v-if="loading" class="loading">Cargando operaciones...</div>
    
    <div v-else class="table-wrapper">
      <table class="trades-table">
        <thead>
          <tr>
            <th @click="sortBy('open_time')">📅 Fecha Apertura</th>
            <th @click="sortBy('symbol')">🔤 Símbolo</th>
            <th @click="sortBy('order_type')">📌 Tipo</th>
            <th @click="sortBy('volume')">📦 Volumen</th>
            <th @click="sortBy('open_price')">📍 Entrada</th>
            <th @click="sortBy('close_price')">🎯 Salida</th>
            <th @click="sortBy('profit_usd')">💰 P&L ($)</th>
            <th @click="sortBy('profit_pct')">📊 P&L (%)</th>
            <th @click="sortBy('duration')">⏱️ Duración</th>
            <th>📝 Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="trade in sortedTrades" :key="trade.id" :class="`status-${trade.status}`">
            <td>{{ formatDate(trade.open_time) }}</td>
            <td class="font-bold">{{ trade.symbol }}</td>
            <td>{{ trade.order_type }}</td>
            <td>{{ trade.volume }}</td>
            <td>{{ trade.open_price.toFixed(5) }}</td>
            <td>{{ trade.close_price.toFixed(5) }}</td>
            <td :class="profitColor(trade.profit_usd)">
              {{ formatCurrency(trade.profit_usd) }}
            </td>
            <td :class="profitColor(trade.profit_pct)">
              {{ trade.profit_pct.toFixed(2) }}%
            </td>
            <td>{{ formatDuration(trade.duration) }}</td>
            <td>
              <span :class="`status-badge status-${trade.status}`">
                {{ trade.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="table-footer">
      Mostrando {{ trades.length }} de {{ total }} operaciones
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
  trades: Array,
  loading: Boolean,
  total: Number
})

const sortColumn = ref('open_time')
const sortOrder = ref('desc')

const sortedTrades = computed(() => {
  const sorted = [...props.trades].sort((a, b) => {
    const aVal = a[sortColumn.value]
    const bVal = b[sortColumn.value]
    
    if (sortOrder.value === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })
  return sorted
})

const sortBy = (column) => {
  if (sortColumn.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortOrder.value = 'asc'
  }
}

const formatDate = (date) => new Date(date).toLocaleDateString('es-CO')
const formatDuration = (mins) => `${Math.round(mins / 60)}h ${mins % 60}m`
const formatCurrency = (val) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'USD' }).format(val)
const profitColor = (val) => val > 0 ? 'text-green-400' : val < 0 ? 'text-red-400' : 'text-gray-400'
</script>

<style scoped>
.trades-table-container {
  @apply space-y-4;
}

.table-wrapper {
  @apply overflow-x-auto;
}

.trades-table {
  @apply w-full border-collapse;
}

.trades-table thead {
  @apply bg-gray-700 sticky top-0;
}

.trades-table th {
  @apply px-4 py-3 text-left cursor-pointer hover:bg-gray-600;
}

.trades-table td {
  @apply px-4 py-3 border-b border-gray-700;
}

.trades-table tbody tr:hover {
  @apply bg-gray-750;
}

.status-GANADOR {
  @apply bg-green-900 bg-opacity-20;
}

.status-PERDEDOR {
  @apply bg-red-900 bg-opacity-20;
}

.status-badge {
  @apply px-3 py-1 rounded-full text-sm font-semibold;
}

.status-badge.status-GANADOR {
  @apply bg-green-600 text-white;
}

.status-badge.status-PERDEDOR {
  @apply bg-red-600 text-white;
}

.table-footer {
  @apply text-gray-400 text-sm mt-4;
}
</style>
```

### 2.3.4 Calendar Heatmap

```vue
<!-- components/Analytics/CalendarHeatmap.vue -->

<template>
  <div class="calendar-heatmap-container">
    <h2 class="chart-title">📅 Heatmap de Performance Diario</h2>
    
    <div class="calendar-grid">
      <div
        v-for="day in dailyStats"
        :key="day.date"
        :class="getDayColor(day.profit)"
        class="calendar-day"
        :title="`${day.date}: ${day.profit > 0 ? '✓' : '✗'} $${day.profit}`"
      >
        <div class="day-date">{{ getDateNumber(day.date) }}</div>
        <div class="day-profit">{{ (day.profit / 100).toFixed(0) }}</div>
      </div>
    </div>
    
    <div class="heatmap-legend">
      <div class="legend-item">
        <span class="legend-color" style="background: #065f46;"></span> Mejor
      </div>
      <div class="legend-item">
        <span class="legend-color" style="background: #10b981;"></span> Ganancia
      </div>
      <div class="legend-item">
        <span class="legend-color" style="background: #6b7280;"></span> Neutro
      </div>
      <div class="legend-item">
        <span class="legend-color" style="background: #ef4444;"></span> Pérdida
      </div>
      <div class="legend-item">
        <span class="legend-color" style="background: #7f1d1d;"></span> Peor
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  dailyStats: Array,
  bestDay: String,
  worstDay: String
})

const getDayColor = (profit) => {
  if (profit > 1000) return 'bg-green-900'
  if (profit > 100) return 'bg-green-600'
  if (profit === 0) return 'bg-gray-600'
  if (profit > -500) return 'bg-red-500'
  return 'bg-red-900'
}

const getDateNumber = (dateStr) => {
  return new Date(dateStr).getDate()
}
</script>

<style scoped>
.calendar-heatmap-container {
  @apply space-y-6;
}

.chart-title {
  @apply text-2xl font-bold text-white;
}

.calendar-grid {
  @apply grid grid-cols-7 gap-2;
}

.calendar-day {
  @apply p-3 rounded cursor-pointer hover:scale-110 transition text-white text-center;
}

.day-date {
  @apply text-sm font-bold;
}

.day-profit {
  @apply text-xs mt-1 opacity-75;
}

.heatmap-legend {
  @apply flex gap-4 justify-center flex-wrap text-sm;
}

.legend-item {
  @apply flex items-center gap-2;
}

.legend-color {
  @apply w-4 h-4 rounded;
}
</style>
```

---

## 2.4 Store Pinia (Estado Global)

```typescript
// stores/analytics.ts

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi } from '~/composables/useApi'

export const useAnalyticsStore = defineStore('analytics', () => {
  const api = useApi()
  
  // State
  const analytics = ref(null)
  const trades = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  // Actions
  const fetchAnalytics = async () => {
    loading.value = true
    try {
      const response = await api.get('/analytics/summary')
      analytics.value = response.data
      error.value = null
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  const fetchTrades = async (filters = {}) => {
    loading.value = true
    try {
      const response = await api.get('/analytics/filter', { params: filters })
      trades.value = response.data.trades || []
      error.value = null
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  const uploadTrades = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await api.post('/analytics/upload-trades', formData)
      await fetchAnalytics()
      await fetchTrades()
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    }
  }
  
  // Getters
  const sortedTrades = computed(() => {
    return trades.value.sort((a, b) => new Date(b.open_time) - new Date(a.open_time))
  })
  
  const winningTrades = computed(() => {
    return trades.value.filter(t => t.status === 'GANADOR')
  })
  
  const losingTrades = computed(() => {
    return trades.value.filter(t => t.status === 'PERDEDOR')
  })
  
  return {
    // State
    analytics,
    trades,
    loading,
    error,
    
    // Getters
    sortedTrades,
    winningTrades,
    losingTrades,
    
    // Actions
    fetchAnalytics,
    fetchTrades,
    uploadTrades
  }
})
```

---

## 2.5 Estructura de Carpetas Frontend

```
trading-bot-frontend/
├── components/
│   ├── Analytics/
│   │   ├── KpiCard.vue              🆕
│   │   ├── EquityCurveChart.vue     🆕
│   │   ├── TradesTable.vue          🆕
│   │   ├── CalendarHeatmap.vue      🆕
│   │   ├── TradeDistributionChart.vue
│   │   └── ProfitHistogram.vue
│   ├── Layout/
│   │   ├── Navbar.vue
│   │   ├── Sidebar.vue
│   │   └── Footer.vue
│   └── Common/
│       ├── LoadingSpinner.vue
│       └── UploadModal.vue          🆕
├── pages/
│   ├── index.vue
│   ├── journal.vue                  🆕 (PRINCIPAL)
│   ├── statistics.vue               🆕
│   ├── performance.vue              🆕
│   ├── trades.vue                   🆕
│   └── upload.vue                   🆕
├── stores/
│   ├── trading.ts
│   └── analytics.ts                 🆕
├── composables/
│   ├── useApi.ts
│   └── useAnalytics.ts              🆕
├── types/
│   ├── index.ts
│   └── analytics.ts                 🆕
└── utils/
    ├── formatters.ts                🆕
    └── charts.ts                    🆕
```

---

## 2.6 package.json Dependencies

```json
{
  "dependencies": {
    "vue": "^3.3.0",
    "nuxt": "^3.8.0",
    "pinia": "^2.1.0",
    "axios": "^1.6.0",
    "plotly.js-dist-min": "^2.26.0",
    "recharts": "^2.10.0",
    "socket.io-client": "^4.7.0",
    "@vueuse/core": "^10.7.0",
    "date-fns": "^2.30.0",
    "numeral": "^2.0.6"
  },
  "devDependencies": {
    "@nuxt/devtools": "^1.0.0",
    "@nuxtjs/tailwindcss": "^6.10.0",
    "tailwindcss": "^3.3.0",
    "typescript": "^5.3.0"
  }
}
```

---

## 2.7 Estilos Globales

```css
/* assets/styles/analytics.css */

:root {
  --color-profit: #10b981;
  --color-loss: #ef4444;
  --color-neutral: #6b7280;
  --color-grid: rgba(31, 41, 55, 0.5);
}

.chart-container {
  @apply bg-gray-800 rounded-lg p-6 border border-gray-700;
}

.chart-title {
  @apply text-xl font-bold text-white mb-4;
}

.stat-row {
  @apply flex justify-between items-center py-2 border-b border-gray-700;
}

.stat-label {
  @apply text-gray-400;
}

.stat-value {
  @apply font-bold text-white;
}

.status-indicator {
  @apply w-3 h-3 rounded-full inline-block mr-2;
}

.status-indicator.positive {
  @apply bg-green-500;
}

.status-indicator.negative {
  @apply bg-red-500;
}
```

---

## 2.8 Flujo de Datos Frontend

```
upload.vue (Usuario carga CSV)
        ↓
analyticsStore.uploadTrades()
        ↓
POST /analytics/upload-trades
        ↓
journal.vue (Se carga dashboard)
        ↓
analyticsStore.fetchAnalytics()
        ↓
GET /analytics/summary
        ↓
Componentes se actualizan (KpiCards, Charts, Tables)
        ↓
Usuario ve dashboard completo tipo MyFxBook
```

---

## 2.9 Flujo de Uso (User Journey)

```
1. Usuario llega a /upload
   → Subir archivo CSV desde MT5
   → Backend parsea y calcula KPIs
   
2. Redirige a /journal
   → Dashboard principal carga
   → Ver todos los KPIs en widgets
   → Ver curva de capital
   → Ver distribución de trades
   
3. Usuario puede:
   → Hacer click en calendar para ver día específico
   → Filtrar trades por símbolo/fecha/status
   → Ver estadísticas detalladas por símbolo
   → Exportar reporte a PDF
   
4. Updates automáticos:
   → Cada vez que sube nuevo CSV
   → Se recalculan todos los KPIs
   → Dashboard se actualiza en tiempo real
```

---

## 2.10 Páginas Secundarias

### `pages/statistics.vue` - Análisis Detallado
- Estadísticas por símbolo
- Estadísticas por hora del día
- Análisis de rachas
- Distribuciones

### `pages/performance.vue` - Curva de Capital
- Gráfico equity curve
- Drawdown analysis
- Monthly performance
- Yearly performance

### `pages/trades.vue` - Tabla Completa
- Tabla de todas las operaciones
- Filtros avanzados
- Búsqueda
- Exportar a Excel

### `pages/upload.vue` - Cargar datos
- Dropzone para CSV
- Vista previa
- Confirmación

---

## 2.11 Notas Técnicas Frontend

✅ **Implementación Inmediata:**
- Dashboard con 5 componentes
- Tabla de operaciones
- Store Pinia
- 2-3 páginas principales

⏳ **Fase 2:**
- WebSocket para updates real-time
- Más gráficos (hora, símbolo, correlación)
- Exportar PDF
- Temas oscuro/claro

🔐 **Performance:**
- Lazy load componentes
- Virtual scroll en tabla (>1000 trades)
- Cachear datos en store

📱 **Responsive:**
- Mobile: KPIs en stack vertical
- Tablet: Grid 2-3 columnas
- Desktop: Grid 5 columnas

---

## 2.12 Implementaciones de Páginas Secundarias

### `pages/upload.vue` - Upload CSV

```vue
<template>
  <div class="page-upload">
    <h1 class="page-title">📤 Cargar Historial de Operaciones</h1>
    
    <div class="upload-container">
      <div class="instruction-card">
        <h2>📋 Instrucciones</h2>
        <ol>
          <li>Exporta tu historial desde MT5: <code>Historial → Guardar como Informe</code></li>
          <li>Selecciona formato <strong>CSV</strong></li>
          <li>Arrastra el archivo aquí o haz clic para seleccionar</li>
        </ol>
      </div>
      
      <div
        class="dropzone"
        :class="{ 'is-dragging': isDragging }"
        @drop.prevent="handleDrop"
        @dragover.prevent="isDragging = true"
        @dragleave="isDragging = false"
      >
        <input
          ref="fileInput"
          type="file"
          accept=".csv"
          @change="handleFileSelect"
          class="file-input"
        />
        
        <div class="dropzone-content" @click="$refs.fileInput.click()">
          <div class="icon">📁</div>
          <p class="title">Arrastra tu archivo CSV aquí</p>
          <p class="subtitle">o haz clic para seleccionar</p>
        </div>
      </div>
      
      <div v-if="selectedFile" class="file-preview">
        <div class="file-info">
          <span class="file-name">{{ selectedFile.name }}</span>
          <span class="file-size">{{ formatFileSize(selectedFile.size) }}</span>
        </div>
        
        <button
          @click="uploadFile"
          :disabled="uploading"
          class="btn btn-primary btn-lg"
        >
          {{ uploading ? '⏳ Procesando...' : '🚀 Procesar Archivo' }}
        </button>
      </div>
      
      <div v-if="error" class="error-message">
        ❌ {{ error }}
      </div>
      
      <div v-if="success" class="success-message">
        ✅ Archivo procesado exitosamente. Redirigiendo...
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAnalyticsStore } from '~/stores/analytics'

const router = useRouter()
const analyticsStore = useAnalyticsStore()

const fileInput = ref(null)
const selectedFile = ref(null)
const isDragging = ref(false)
const uploading = ref(false)
const error = ref(null)
const success = ref(false)

const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    validateAndSetFile(files[0])
  }
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    validateAndSetFile(files[0])
  }
}

const validateAndSetFile = (file: File) => {
  if (!file.name.endsWith('.csv')) {
    error.value = 'Solo se aceptan archivos CSV'
    return
  }
  
  if (file.size > 10 * 1024 * 1024) { // 10MB
    error.value = 'El archivo es demasiado grande (máx 10MB)'
    return
  }
  
  selectedFile.value = file
  error.value = null
}

const uploadFile = async () => {
  if (!selectedFile.value) return
  
  uploading.value = true
  error.value = null
  
  try {
    await analyticsStore.uploadTrades(selectedFile.value)
    success.value = true
    
    setTimeout(() => {
      router.push('/journal')
    }, 1500)
  } catch (err) {
    error.value = err.message || 'Error al procesar el archivo'
  } finally {
    uploading.value = false
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}
</script>

<style scoped>
.page-upload {
  @apply max-w-4xl mx-auto p-8;
}

.page-title {
  @apply text-4xl font-bold text-white mb-8;
}

.upload-container {
  @apply space-y-6;
}

.instruction-card {
  @apply bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg p-6;
}

.instruction-card h2 {
  @apply text-xl font-bold text-white mb-4;
}

.instruction-card ol {
  @apply space-y-2 text-gray-300;
}

.dropzone {
  @apply border-4 border-dashed border-gray-600 rounded-lg p-12 transition cursor-pointer;
}

.dropzone.is-dragging {
  @apply border-blue-500 bg-blue-900 bg-opacity-20;
}

.dropzone-content {
  @apply text-center;
}

.file-input {
  @apply hidden;
}

.icon {
  @apply text-6xl mb-4;
}

.title {
  @apply text-xl font-bold text-white mb-2;
}

.subtitle {
  @apply text-gray-400;
}

.file-preview {
  @apply bg-gray-800 rounded-lg p-6 flex justify-between items-center;
}

.file-info {
  @apply flex flex-col;
}

.file-name {
  @apply text-white font-bold;
}

.file-size {
  @apply text-gray-400 text-sm;
}

.btn {
  @apply px-6 py-3 rounded font-semibold transition;
}

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.btn-primary:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.btn-lg {
  @apply text-lg;
}

.error-message {
  @apply bg-red-900 bg-opacity-30 border border-red-500 rounded-lg p-4 text-red-300;
}

.success-message {
  @apply bg-green-900 bg-opacity-30 border border-green-500 rounded-lg p-4 text-green-300;
}
</style>
```

### `pages/statistics.vue` - Estadísticas Detalladas

```vue
<template>
  <div class="page-statistics">
    <h1 class="page-title">📊 Estadísticas Detalladas</h1>
    
    <!-- Stats por Símbolo -->
    <section class="stats-section">
      <h2 class="section-title">💱 Performance por Símbolo</h2>
      
      <div class="stats-grid">
        <div
          v-for="symbol in symbolStats"
          :key="symbol.name"
          class="symbol-stat-card"
        >
          <div class="symbol-header">
            <span class="symbol-name">{{ symbol.name }}</span>
            <span class="trade-count">{{ symbol.total_trades }} operaciones</span>
          </div>
          
          <div class="symbol-metrics">
            <div class="metric">
              <span class="metric-label">Ganancia Total</span>
              <span :class="profitColor(symbol.total_profit)">
                {{ formatCurrency(symbol.total_profit) }}
              </span>
            </div>
            
            <div class="metric">
              <span class="metric-label">Win Rate</span>
              <span>{{ symbol.win_rate }}%</span>
            </div>
            
            <div class="metric">
              <span class="metric-label">Profit Factor</span>
              <span>{{ symbol.profit_factor }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Stats por Hora -->
    <section class="stats-section">
      <h2 class="section-title">⏰ Performance por Hora del Día</h2>
      
      <div class="hourly-chart">
        <div id="hourly-performance-chart" class="w-full h-96"></div>
      </div>
    </section>
    
    <!-- Análisis de Rachas -->
    <section class="stats-section">
      <h2 class="section-title">🔥 Análisis de Rachas</h2>
      
      <div class="streak-grid">
        <div class="streak-card">
          <div class="streak-icon">🏆</div>
          <div class="streak-label">Mejor Racha Ganancias</div>
          <div class="streak-value text-green-400">{{ analytics?.longest_win_streak }} operaciones</div>
        </div>
        
        <div class="streak-card">
          <div class="streak-icon">💔</div>
          <div class="streak-label">Peor Racha Pérdidas</div>
          <div class="streak-value text-red-400">{{ analytics?.longest_loss_streak }} operaciones</div>
        </div>
        
        <div class="streak-card">
          <div class="streak-icon">💰</div>
          <div class="streak-label">Mejor Día</div>
          <div class="streak-value text-green-400">{{ formatCurrency(analytics?.best_day_profit) }}</div>
        </div>
        
        <div class="streak-card">
          <div class="streak-icon">📉</div>
          <div class="streak-label">Peor Día</div>
          <div class="streak-value text-red-400">{{ formatCurrency(analytics?.worst_day_profit) }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAnalyticsStore } from '~/stores/analytics'
import Plotly from 'plotly.js-dist-min'

const analyticsStore = useAnalyticsStore()
const analytics = ref(null)
const symbolStats = ref([])

onMounted(async () => {
  await analyticsStore.fetchAnalytics()
  analytics.value = analyticsStore.analytics
  
  // Fetch stats by symbol
  const response = await useApi().get('/analytics/by-symbol')
  symbolStats.value = response.data
  
  // Render hourly chart
  renderHourlyChart()
})

const renderHourlyChart = () => {
  const trace = {
    x: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    y: analytics.value?.hourly_profit || [],
    type: 'bar',
    marker: {
      color: analytics.value?.hourly_profit?.map(v => v > 0 ? '#10b981' : '#ef4444')
    }
  }
  
  const layout = {
    title: 'Ganancia/Pérdida por Hora',
    xaxis: { title: 'Hora del Día' },
    yaxis: { title: 'P&L ($)' },
    plot_bgcolor: 'rgba(31, 41, 55, 0.5)',
    paper_bgcolor: 'rgba(17, 24, 39, 0)',
    font: { color: '#fff' }
  }
  
  Plotly.newPlot('hourly-performance-chart', [trace], layout, { responsive: true })
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'USD' }).format(val)
}

const profitColor = (val: number) => {
  return val > 0 ? 'text-green-400 font-bold' : 'text-red-400 font-bold'
}
</script>

<style scoped>
.page-statistics {
  @apply space-y-8 p-8;
}

.page-title {
  @apply text-4xl font-bold text-white mb-8;
}

.stats-section {
  @apply bg-gray-800 rounded-lg p-6 border border-gray-700;
}

.section-title {
  @apply text-2xl font-bold text-white mb-6;
}

.stats-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4;
}

.symbol-stat-card {
  @apply bg-gray-700 rounded-lg p-4 border border-gray-600;
}

.symbol-header {
  @apply flex justify-between items-center mb-4 pb-3 border-b border-gray-600;
}

.symbol-name {
  @apply text-xl font-bold text-white;
}

.trade-count {
  @apply text-sm text-gray-400;
}

.symbol-metrics {
  @apply space-y-3;
}

.metric {
  @apply flex justify-between items-center;
}

.metric-label {
  @apply text-gray-400;
}

.streak-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4;
}

.streak-card {
  @apply bg-gray-700 rounded-lg p-6 text-center;
}

.streak-icon {
  @apply text-4xl mb-3;
}

.streak-label {
  @apply text-gray-400 mb-2;
}

.streak-value {
  @apply text-2xl font-bold;
}
</style>
```

### `pages/performance.vue` - Análisis de Performance

```vue
<template>
  <div class="page-performance">
    <h1 class="page-title">📈 Análisis de Performance</h1>
    
    <!-- Equity Curve Detallada -->
    <section class="chart-section">
      <h2 class="section-title">💹 Curva de Capital con Drawdown</h2>
      <div id="equity-drawdown-chart" class="w-full h-96"></div>
    </section>
    
    <!-- Monthly Performance -->
    <section class="chart-section">
      <h2 class="section-title">📅 Performance Mensual</h2>
      <div class="monthly-grid">
        <div
          v-for="month in monthlyStats"
          :key="month.month"
          :class="['month-card', month.profit > 0 ? 'positive' : 'negative']"
        >
          <div class="month-name">{{ month.month }}</div>
          <div class="month-profit">{{ formatCurrency(month.profit) }}</div>
          <div class="month-trades">{{ month.trades }} operaciones</div>
        </div>
      </div>
    </section>
    
    <!-- Métricas Avanzadas -->
    <section class="chart-section">
      <h2 class="section-title">🎯 Métricas Avanzadas</h2>
      
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-icon">📊</div>
          <div class="metric-label">Sharpe Ratio</div>
          <div class="metric-value">{{ analytics?.sharpe_ratio?.toFixed(2) }}</div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon">📉</div>
          <div class="metric-label">Calmar Ratio</div>
          <div class="metric-value">{{ analytics?.calmar_ratio?.toFixed(2) }}</div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon">💎</div>
          <div class="metric-label">Recovery Factor</div>
          <div class="metric-value">{{ analytics?.recovery_factor?.toFixed(2) }}</div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon">⚡</div>
          <div class="metric-label">Expectancy</div>
          <div class="metric-value">{{ formatCurrency(analytics?.expectancy) }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAnalyticsStore } from '~/stores/analytics'
import Plotly from 'plotly.js-dist-min'

const analyticsStore = useAnalyticsStore()
const analytics = ref(null)
const monthlyStats = ref([])

onMounted(async () => {
  await analyticsStore.fetchAnalytics()
  analytics.value = analyticsStore.analytics
  
  const response = await useApi().get('/analytics/monthly')
  monthlyStats.value = response.data
  
  renderEquityDrawdownChart()
})

const renderEquityDrawdownChart = () => {
  const equityTrace = {
    x: analytics.value?.equity_dates,
    y: analytics.value?.equity_curve,
    type: 'scatter',
    name: 'Equity',
    line: { color: '#10b981', width: 2 }
  }
  
  const drawdownTrace = {
    x: analytics.value?.equity_dates,
    y: analytics.value?.drawdown_curve,
    type: 'scatter',
    name: 'Drawdown',
    fill: 'tozeroy',
    fillcolor: 'rgba(239, 68, 68, 0.2)',
    line: { color: '#ef4444', width: 1 },
    yaxis: 'y2'
  }
  
  const layout = {
    title: '',
    xaxis: { title: 'Fecha' },
    yaxis: { title: 'Balance ($)' },
    yaxis2: {
      title: 'Drawdown (%)',
      overlaying: 'y',
      side: 'right'
    },
    plot_bgcolor: 'rgba(31, 41, 55, 0.5)',
    paper_bgcolor: 'rgba(17, 24, 39, 0)',
    font: { color: '#fff' }
  }
  
  Plotly.newPlot('equity-drawdown-chart', [equityTrace, drawdownTrace], layout, { responsive: true })
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'USD' }).format(val)
}
</script>

<style scoped>
.page-performance {
  @apply space-y-8 p-8;
}

.page-title {
  @apply text-4xl font-bold text-white mb-8;
}

.chart-section {
  @apply bg-gray-800 rounded-lg p-6 border border-gray-700;
}

.section-title {
  @apply text-2xl font-bold text-white mb-6;
}

.monthly-grid {
  @apply grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4;
}

.month-card {
  @apply rounded-lg p-4 text-center border-2;
}

.month-card.positive {
  @apply bg-green-900 bg-opacity-20 border-green-500;
}

.month-card.negative {
  @apply bg-red-900 bg-opacity-20 border-red-500;
}

.month-name {
  @apply text-sm text-gray-400 mb-2;
}

.month-profit {
  @apply text-xl font-bold text-white mb-1;
}

.month-trades {
  @apply text-xs text-gray-500;
}

.metrics-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4;
}

.metric-card {
  @apply bg-gray-700 rounded-lg p-6 text-center;
}

.metric-icon {
  @apply text-4xl mb-3;
}

.metric-label {
  @apply text-gray-400 mb-2;
}

.metric-value {
  @apply text-2xl font-bold text-white;
}
</style>
```

---

## 2.13 Composables

### `composables/useAnalytics.ts`

```typescript
import { ref, computed } from 'vue'
import { useApi } from './useApi'

export const useAnalytics = () => {
  const api = useApi()
  
  const analytics = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  const fetchAnalytics = async () => {
    loading.value = true
    try {
      const response = await api.get('/analytics/summary')
      analytics.value = response.data
      error.value = null
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  const totalProfit = computed(() => analytics.value?.total_profit || 0)
  const winRate = computed(() => analytics.value?.win_rate || 0)
  const profitFactor = computed(() => analytics.value?.profit_factor || 0)
  
  return {
    analytics,
    loading,
    error,
    fetchAnalytics,
    totalProfit,
    winRate,
    profitFactor
  }
}
```

---

## 2.14 TypeScript Types

### `types/analytics.ts`

```typescript
export interface Trade {
  id: number
  open_time: string
  close_time: string
  symbol: string
  order_type: 'BUY' | 'SELL'
  volume: number
  open_price: number
  close_price: number
  profit_usd: number
  profit_pct: number
  duration: number
  status: 'GANADOR' | 'PERDEDOR' | 'BREAK_EVEN'
}

export interface Analytics {
  total_trades: number
  winning_trades: number
  losing_trades: number
  break_even: number
  
  total_profit: number
  total_profit_pct: number
  
  win_rate: number
  profit_factor: number
  
  max_drawdown: number
  max_drawdown_pct: number
  
  longest_win_streak: number
  longest_loss_streak: number
  
  best_day_profit: number
  worst_day_profit: number
  
  equity_dates: string[]
  equity_curve: number[]
  drawdown_curve: number[]
  
  daily_stats: DailyStat[]
  profit_distribution: number[]
  
  // Métricas avanzadas
  sharpe_ratio?: number
  calmar_ratio?: number
  recovery_factor?: number
  expectancy?: number
}

export interface DailyStat {
  date: string
  profit: number
  trades: number
}

export interface SymbolStats {
  name: string
  total_trades: number
  total_profit: number
  win_rate: number
  profit_factor: number
}

export interface MonthlyStats {
  month: string
  profit: number
  trades: number
}
```

---

## 2.15 Roadmap de Implementación

### **FASE 1: Fundamentos (Día 1-2)** ✅

```bash
# 1. Crear estructura de carpetas
mkdir -p components/Analytics
mkdir -p pages
mkdir -p stores
mkdir -p types
mkdir -p composables

# 2. Instalar dependencias
npm install plotly.js-dist-min date-fns numeral

# 3. Crear tipos TypeScript
touch types/analytics.ts

# 4. Crear store Pinia
touch stores/analytics.ts

# 5. Crear composable
touch composables/useAnalytics.ts
```

### **FASE 2: Componentes Base (Día 2-3)** 🎨

```
1. Implementar KpiCard.vue
2. Implementar TradesTable.vue
3. Implementar EquityCurveChart.vue
4. Implementar CalendarHeatmap.vue
```

### **FASE 3: Páginas Principales (Día 3-4)** 📄

```
1. Implementar pages/upload.vue
2. Implementar pages/journal.vue
3. Implementar pages/statistics.vue
4. Implementar pages/performance.vue
```

### **FASE 4: Integración y Testing (Día 4-5)** 🧪

```
1. Conectar frontend con backend
2. Testing de endpoints
3. Validar cálculos de KPIs
4. Responsive design testing
```

### **FASE 5: Polish y Optimización (Día 5-6)** ✨

```
1. Lazy loading de componentes
2. Virtual scroll para tablas grandes
3. Animaciones y transiciones
4. Export a PDF/Excel
```

---

## 2.16 Checklist de Implementación

### Backend API (Prerequisitos)
- [ ] Endpoint `/analytics/upload-trades` funcionando
- [ ] Endpoint `/analytics/summary` retornando KPIs
- [ ] Endpoint `/analytics/filter` con filtros de búsqueda
- [ ] Endpoint `/analytics/by-symbol` con stats por símbolo
- [ ] Endpoint `/analytics/monthly` con stats mensuales

### Frontend Components
- [ ] KpiCard.vue implementado y testeado
- [ ] EquityCurveChart.vue con Plotly
- [ ] TradesTable.vue con sorting y filtros
- [ ] CalendarHeatmap.vue con colores dinámicos
- [ ] TradeDistributionChart.vue (Pie chart)
- [ ] ProfitHistogram.vue (Histogram)

### Frontend Pages
- [ ] pages/upload.vue con drag & drop
- [ ] pages/journal.vue dashboard completo
- [ ] pages/statistics.vue con análisis detallado
- [ ] pages/performance.vue con equity curve
- [ ] pages/trades.vue con tabla completa

### State Management
- [ ] Store Pinia creado
- [ ] Actions: fetchAnalytics, fetchTrades, uploadTrades
- [ ] Getters: sortedTrades, winningTrades, losingTrades

### Utilities
- [ ] Formatters: currency, date, percentage
- [ ] Validators: CSV file validation
- [ ] Chart helpers: color scales, data transform

### Testing
- [ ] Upload CSV funciona correctamente
- [ ] Todos los KPIs se calculan bien
- [ ] Charts renderizan correctamente
- [ ] Filtros funcionan
- [ ] Responsive en mobile/tablet/desktop

---

## 2.17 Comandos de Inicio Rápido

```bash
# Clonar proyecto
git clone https://github.com/tu-usuario/trading-bot-frontend.git
cd trading-bot-frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
echo "NUXT_PUBLIC_API_BASE_URL=http://localhost:8000" > .env.local

# Ejecutar en desarrollo
npm run dev

# Acceder a:
# http://localhost:3000/upload     → Subir CSV
# http://localhost:3000/journal    → Dashboard principal
# http://localhost:3000/statistics → Estadísticas
# http://localhost:3000/performance → Performance
```

---

## 2.18 Resultado Final Esperado

Una aplicación web profesional tipo **MyFxBook** con:

✅ **Dashboard Interactivo**
- 5 KPI cards en la parte superior
- Equity curve con área rellena
- Calendar heatmap mensual
- Tabla de operaciones con filtros
- Distribución de ganancias/pérdidas

✅ **Análisis Avanzado**
- Estadísticas por símbolo
- Performance por hora del día
- Rachas de ganancias/pérdidas
- Métricas profesionales (Sharpe, Calmar)

✅ **Experiencia de Usuario**
- Subida de CSV con drag & drop
- Navegación fluida entre páginas
- Responsive design
- Tema oscuro profesional

✅ **Performance**
- Lazy loading de componentes
- Virtual scroll en tablas grandes
- Caché de datos en Pinia store

---

## 🎯 **SIGUIENTE PASO INMEDIATO**

```bash
# 1. Ir a la carpeta del proyecto
cd trading-bot-frontend

# 2. Crear archivo de tipos
touch types/analytics.ts

# 3. Copiar la definición de tipos de la sección 2.14

# 4. Crear el store
touch stores/analytics.ts

# 5. Copiar la implementación del store de la sección 2.4

# 6. Empezar con el primer componente
touch components/Analytics/KpiCard.vue

# 7. Copiar la implementación de la sección 2.3.1
```

**¿Listo para implementar?** 🚀

