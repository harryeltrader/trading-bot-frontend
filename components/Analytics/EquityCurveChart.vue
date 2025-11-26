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
        <span class="font-bold text-green-400">{{ formatCurrency(analytics?.best_day_profit || 0) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { Analytics } from '~/types/analytics'

const props = defineProps<{
  analytics: Analytics | null
  dates?: string[]
  values?: number[]
}>()

const initialBalance = ref(0)
const finalBalance = ref(0)

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}

const renderChart = async () => {
  if (!props.analytics?.equity_dates || !props.analytics?.equity_curve) {
    return
  }
  
  // Usar dates/values de props si están disponibles, sino usar del analytics
  const dates = props.dates || props.analytics.equity_dates
  const values = props.values || props.analytics.equity_curve
  
  if (!dates.length || !values.length) return
  
  initialBalance.value = values[0]
  finalBalance.value = values[values.length - 1]
  
  // Importar Plotly dinámicamente
  const Plotly = await import('plotly.js-dist-min')
  
  const trace = {
    x: dates,
    y: values,
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
    xaxis: { 
      title: 'Fecha',
      color: '#9ca3af'
    },
    yaxis: { 
      title: 'Balance ($)',
      color: '#9ca3af'
    },
    hovermode: 'closest',
    plot_bgcolor: 'rgba(31, 41, 55, 0.5)',
    paper_bgcolor: 'rgba(17, 24, 39, 0)',
    font: { color: '#fff' },
    margin: { t: 20, r: 20, b: 40, l: 60 }
  }
  
  const config = {
    responsive: true,
    displayModeBar: false
  }
  
  Plotly.newPlot('equity-chart', [trace], layout, config)
}

onMounted(() => {
  renderChart()
})

watch(() => props.analytics, () => {
  renderChart()
}, { deep: true })
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
