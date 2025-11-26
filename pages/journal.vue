<template>
  <div class="page-journal">
    <h1 class="page-title">📊 Journal de Trading - Análisis Completo</h1>
    
    <!-- DEBUG INFO -->
    <div v-if="analyticsStore.loading" class="debug-info loading">
      ⏳ Cargando datos...
    </div>
    
    <div v-if="analyticsStore.error" class="debug-info error">
      ❌ Error: {{ analyticsStore.error }}
    </div>
    
    <div v-if="analytics" class="debug-info success">
      ✅ Datos cargados: {{ analytics.total_trades }} operaciones
    </div>
    
    <!-- SECCIÓN 1: KPI WIDGETS -->
    <section class="kpi-section">
      <AnalyticsKpiCard
        title="Ganancia Total"
        :value="analytics?.total_profit || 0"
        :change="analytics?.total_profit_pct"
        icon="📈"
        color="green"
      />
      <AnalyticsKpiCard
        title="Win Rate"
        :value="`${analytics?.win_rate || 0}%`"
        :trades="`${analytics?.winning_trades || 0}/${analytics?.total_trades || 0}`"
        icon="🎯"
        color="blue"
      />
      <AnalyticsKpiCard
        title="Profit Factor"
        :value="analytics?.profit_factor || 0"
        subtitle="Ganancias / Pérdidas"
        icon="📊"
        color="purple"
      />
      <AnalyticsKpiCard
        title="Max Drawdown"
        :value="analytics?.max_drawdown || 0"
        :change="analytics?.max_drawdown_pct"
        icon="📉"
        color="red"
      />
      <AnalyticsKpiCard
        title="Mejor Racha"
        :value="analytics?.longest_win_streak || 0"
        subtitle="operaciones ganadoras"
        icon="🏆"
        color="gold"
      />
    </section>
    
    <!-- SECCIÓN 2: EQUITY CURVE -->
    <section class="equity-section">
      <AnalyticsEquityCurveChart 
        :analytics="analytics"
        :dates="analytics?.equity_dates"
        :values="analytics?.equity_curve"
      />
    </section>
    
    <!-- SECCIÓN 3: CALENDAR HEATMAP -->
    <section class="calendar-section">
      <AnalyticsCalendarHeatmap
        :daily-stats="analytics?.daily_stats"
        :best-day="analytics?.best_day_profit?.toString()"
        :worst-day="analytics?.worst_day_profit?.toString()"
      />
    </section>
    
    <!-- SECCIÓN 4: TABLA DE OPERACIONES -->
    <section class="trades-table-section">
      <h2 class="section-title">📋 Operaciones Recientes</h2>
      
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
      
      <AnalyticsTradesTable
        :trades="filteredTrades"
        :loading="loadingTrades"
        :total="analytics?.total_trades"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAnalyticsStore } from '~/stores/analytics'

const analyticsStore = useAnalyticsStore()

// State
const analytics = computed(() => analyticsStore.analytics)
const trades = computed(() => analyticsStore.trades)
const loadingTrades = ref(false)
const filters = ref({
  symbol: '',
  status: '',
  dateFrom: '',
  dateTo: ''
})

// Computed
const filteredTrades = computed(() => {
  return trades.value.filter(trade => {
    if (filters.value.symbol && !trade.symbol.includes(filters.value.symbol.toUpperCase())) return false
    if (filters.value.status && trade.status !== filters.value.status) return false
    if (filters.value.dateFrom && new Date(trade.open_time) < new Date(filters.value.dateFrom)) return false
    if (filters.value.dateTo && new Date(trade.open_time) > new Date(filters.value.dateTo)) return false
    return true
  })
})

// Methods
const applyFilters = async () => {
  loadingTrades.value = true
  try {
    await analyticsStore.fetchTrades({
      symbol: filters.value.symbol || undefined,
      status: filters.value.status || undefined,
      date_from: filters.value.dateFrom || undefined,
      date_to: filters.value.dateTo || undefined
    })
  } catch (error) {
    console.error('Error aplicando filtros:', error)
  } finally {
    loadingTrades.value = false
  }
}

onMounted(async () => {
  await analyticsStore.fetchAnalytics()
  await analyticsStore.fetchTrades()
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
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4;
}

.equity-section,
.calendar-section,
.trades-table-section {
  @apply bg-gray-800 rounded-lg p-6 border border-gray-700;
}

.section-title {
  @apply text-2xl font-bold text-white mb-6;
}

.filters-row {
  @apply flex gap-4 mb-6 flex-wrap;
}

.input {
  @apply px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500;
}

.btn {
  @apply px-6 py-2 rounded font-semibold transition;
}

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 cursor-pointer;
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

.debug-info {
  @apply p-4 mb-4 rounded-lg border font-semibold;
}

.debug-info.loading {
  @apply bg-blue-900 bg-opacity-20 border-blue-500 text-blue-300;
}

.debug-info.error {
  @apply bg-red-900 bg-opacity-30 border-red-500 text-red-300;
}

.debug-info.success {
  @apply bg-green-900 bg-opacity-20 border-green-500 text-green-300;
}
</style>
