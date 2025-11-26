<template>
  <div class="calendar-heatmap-container">
    <h2 class="chart-title">📅 Heatmap de Performance Diario</h2>
    
    <div v-if="dailyStats && dailyStats.length > 0" class="calendar-grid">
      <div
        v-for="day in dailyStats"
        :key="day.date"
        :class="['calendar-day', getDayColor(day.profit)]"
        :title="`${day.date}: ${day.profit > 0 ? '✓' : '✗'} $${day.profit.toFixed(2)}`"
      >
        <div class="day-date">{{ getDateNumber(day.date) }}</div>
        <div class="day-profit">{{ formatProfit(day.profit) }}</div>
      </div>
    </div>
    
    <div v-else class="no-data">
      No hay datos para mostrar
    </div>
    
    <div class="heatmap-legend">
      <div class="legend-item">
        <span class="legend-color bg-green-900"></span> Mejor
      </div>
      <div class="legend-item">
        <span class="legend-color bg-green-600"></span> Ganancia
      </div>
      <div class="legend-item">
        <span class="legend-color bg-gray-600"></span> Neutro
      </div>
      <div class="legend-item">
        <span class="legend-color bg-red-500"></span> Pérdida
      </div>
      <div class="legend-item">
        <span class="legend-color bg-red-900"></span> Peor
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DailyStat } from '~/types/analytics'

defineProps<{
  dailyStats?: DailyStat[]
  bestDay?: string
  worstDay?: string
}>()

const getDayColor = (profit: number) => {
  if (profit > 1000) return 'bg-green-900'
  if (profit > 100) return 'bg-green-600'
  if (profit === 0) return 'bg-gray-600'
  if (profit > -500) return 'bg-red-500'
  return 'bg-red-900'
}

const getDateNumber = (dateStr: string) => {
  return new Date(dateStr).getDate()
}

const formatProfit = (profit: number) => {
  return (profit / 100).toFixed(0)
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
  @apply p-3 rounded cursor-pointer hover:scale-110 transition-transform text-white text-center;
}

.day-date {
  @apply text-sm font-bold;
}

.day-profit {
  @apply text-xs mt-1 opacity-75;
}

.no-data {
  @apply text-center text-gray-400 py-8;
}

.heatmap-legend {
  @apply flex gap-4 justify-center flex-wrap text-sm text-gray-300;
}

.legend-item {
  @apply flex items-center gap-2;
}

.legend-color {
  @apply w-4 h-4 rounded;
}
</style>
