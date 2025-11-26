<template>
  <div class="trades-table-container">
    <div v-if="loading" class="loading">⏳ Cargando operaciones...</div>
    
    <div v-else class="table-wrapper">
      <table class="trades-table">
        <thead>
          <tr>
            <th @click="sortBy('open_time')">
              📅 Fecha Apertura
              <span v-if="sortColumn === 'open_time'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th @click="sortBy('symbol')">
              🔤 Símbolo
              <span v-if="sortColumn === 'symbol'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th @click="sortBy('order_type')">📌 Tipo</th>
            <th @click="sortBy('volume')">📦 Volumen</th>
            <th @click="sortBy('open_price')">📍 Entrada</th>
            <th @click="sortBy('close_price')">🎯 Salida</th>
            <th @click="sortBy('profit_usd')">
              💰 P&L ($)
              <span v-if="sortColumn === 'profit_usd'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th @click="sortBy('profit_pct')">📊 P&L (%)</th>
            <th @click="sortBy('duration')">⏱️ Duración</th>
            <th>📝 Status</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="trade in sortedTrades" 
            :key="trade.id" 
            :class="`status-${trade.status}`"
            @click="selectedTrade = trade"
            class="cursor-pointer"
          >
            <td>{{ formatDate(trade.open_time) }}</td>
            <td class="font-bold">{{ trade.symbol }}</td>
            <td>
              <span :class="trade.order_type === 'BUY' ? 'text-green-400' : 'text-red-400'">
                {{ trade.order_type }}
              </span>
            </td>
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
    
    <div v-if="!loading" class="table-footer">
      Mostrando {{ trades.length }} de {{ total || trades.length }} operaciones
    </div>

    <TradeChartModal 
      v-if="selectedTrade" 
      :trade="selectedTrade" 
      @close="selectedTrade = null" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Trade } from '~/types/analytics'
import TradeChartModal from './TradeChartModal.vue'

const props = defineProps<{
  trades: Trade[]
  loading?: boolean
  total?: number
}>()

const sortColumn = ref('open_time')
const sortOrder = ref<'asc' | 'desc'>('desc')
const selectedTrade = ref<Trade | null>(null)

const sortedTrades = computed(() => {
  const sorted = [...props.trades].sort((a: any, b: any) => {
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

const sortBy = (column: string) => {
  if (sortColumn.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortOrder.value = 'asc'
  }
}

const formatDate = (date: string) => new Date(date).toLocaleDateString('es-CO')
const formatDuration = (mins: number) => `${Math.round(mins / 60)}h ${mins % 60}m`
const formatCurrency = (val: number) => new Intl.NumberFormat('es-CO', { 
  style: 'currency', 
  currency: 'USD' 
}).format(val)
const profitColor = (val: number) => val > 0 ? 'text-green-400 font-bold' : val < 0 ? 'text-red-400 font-bold' : 'text-gray-400'
</script>

<style scoped>
.trades-table-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.loading {
  text-align: center;
  color: #9ca3af;
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 0.5rem;
  border: 1px solid #374151;
}

.trades-table {
  width: 100%;
  border-collapse: collapse;
}

.trades-table thead {
  background-color: #374151;
  position: sticky;
  top: 0;
}

.trades-table th {
  padding: 0.75rem 1rem;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s;
  color: #e5e7eb;
  font-weight: 600;
  white-space: nowrap;
}

.trades-table th:hover {
  background-color: #4b5563;
}

.trades-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #374151;
  color: #d1d5db;
}

.trades-table tbody tr {
  transition: background-color 0.2s;
}

.trades-table tbody tr:hover {
  background-color: rgba(55, 65, 81, 0.5);
}

.status-GANADOR {
  background-color: rgba(6, 78, 59, 0.1);
}

.status-PERDEDOR {
  background-color: rgba(127, 29, 29, 0.1);
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
}

.status-badge.status-GANADOR {
  background-color: #059669;
  color: white;
}

.status-badge.status-PERDEDOR {
  background-color: #dc2626;
  color: white;
}

.status-badge.status-BREAK_EVEN {
  background-color: #4b5563;
  color: white;
}

.table-footer {
  color: #9ca3af;
  font-size: 0.875rem;
  margin-top: 1rem;
}
</style>
