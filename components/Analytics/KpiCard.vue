<template>
  <div :class="`kpi-card kpi-${color}`">
    <div class="kpi-icon">{{ icon }}</div>
    <div class="kpi-content">
      <p class="kpi-title">{{ title }}</p>
      <p class="kpi-value">{{ formattedValue }}</p>
      <p v-if="change !== undefined && change !== null" :class="`kpi-change ${change >= 0 ? 'positive' : 'negative'}`">
        {{ change >= 0 ? '▲' : '▼' }} {{ Math.abs(change) }}%
      </p>
      <p v-if="subtitle" class="kpi-subtitle">{{ subtitle }}</p>
      <p v-if="trades" class="kpi-trades">{{ trades }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  value: number | string
  change?: number
  subtitle?: string
  trades?: string
  icon: string
  color?: string
}>()

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
  @apply bg-gradient-to-br p-6 rounded-lg border border-opacity-20 hover:shadow-lg transition-all duration-300 cursor-pointer;
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

.kpi-gold {
  @apply from-yellow-900 to-yellow-800 border-yellow-600;
}

.kpi-icon {
  @apply text-4xl mb-2;
}

.kpi-content {
  @apply space-y-1;
}

.kpi-title {
  @apply text-sm text-gray-300 font-medium;
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
