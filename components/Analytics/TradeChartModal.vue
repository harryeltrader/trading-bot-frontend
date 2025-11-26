<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <div class="header-info">
          <h3 class="text-xl font-bold text-white">
            {{ trade.symbol }} 
            <span :class="trade.order_type === 'BUY' ? 'text-green-400' : 'text-red-400'">
              {{ trade.order_type }}
            </span>
            <span class="timeframe-badge">{{ selectedTimeframe }}</span>
          </h3>
          <div class="text-sm text-gray-400">
            {{ formatDate(trade.open_time) }} - {{ formatDate(trade.close_time) }}
          </div>
        </div>
        <button @click="$emit('close')" class="close-btn">✕</button>
      </div>

      <div class="timeframe-selector">
        <button 
          v-for="tf in timeframes" 
          :key="tf.value"
          :class="['tf-btn', { active: selectedTimeframe === tf.value }]"
          @click="changeTimeframe(tf.value)"
        >
          {{ tf.label }}
        </button>
      </div>

      <div class="chart-container" ref="chartContainer"></div>

      <div class="modal-footer">
        <div class="stat-item">
          <span class="label">Entrada:</span>
          <span class="value">{{ trade.open_price }}</span>
        </div>
        <div class="stat-item">
          <span class="label">Salida:</span>
          <span class="value">{{ trade.close_price }}</span>
        </div>
        <div class="stat-item">
          <span class="label">P&L:</span>
          <span :class="trade.profit_usd >= 0 ? 'text-green-400' : 'text-red-400'" class="value font-bold">
            {{ formatCurrency(trade.profit_usd) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, markRaw } from 'vue'
import { createChart, ColorType, CrosshairMode, CandlestickSeries, createSeriesMarkers } from 'lightweight-charts'
import type { Trade } from '~/types/analytics'

const props = defineProps<{
  trade: Trade
}>()

defineEmits(['close'])

const chartContainer = ref<HTMLElement | null>(null)
let chart: any = null
let candleSeries: any = null

// Timeframe management
const selectedTimeframe = ref('5m')
const timeframes = [
  { label: '1m', value: '1m', seconds: 60 },
  { label: '5m', value: '5m', seconds: 300 },
  { label: '15m', value: '15m', seconds: 900 },
  { label: '1h', value: '1h', seconds: 3600 },
  { label: '4h', value: '4h', seconds: 14400 },
]

const changeTimeframe = (tf: string) => {
  selectedTimeframe.value = tf
  initChart()
}

// Helper to format dates
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('es-CO')
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'USD' }).format(val)
}

// Generate simulated candle data since we don't have historical API yet
const generateData = () => {
  const data = []
  const start = new Date(props.trade.open_time).getTime() / 1000
  const end = new Date(props.trade.close_time).getTime() / 1000
  const duration = end - start
  
  // Get selected timeframe in seconds
  const currentTf = timeframes.find(tf => tf.value === selectedTimeframe.value)
  const stepSize = currentTf ? currentTf.seconds : 300 // Default to 5m
  
  // Calculate number of candles for before, during, and after trade
  const preTradeCandles = 50  // More context before trade
  const postTradeCandles = 20 // Some context after trade
  const tradeDurationCandles = Math.max(10, Math.ceil(duration / stepSize))
  
  let currentPrice = props.trade.open_price
  let currentTime = start - (stepSize * preTradeCandles)
  
  // Pre-trade context - show market conditions before entry
  for (let i = 0; i < preTradeCandles; i++) {
    const open = currentPrice
    const close = open + (Math.random() - 0.5) * (open * 0.0015)
    const high = Math.max(open, close) + Math.random() * (open * 0.0008)
    const low = Math.min(open, close) - Math.random() * (open * 0.0008)
    
    data.push({ time: currentTime, open, high, low, close })
    currentPrice = close
    currentTime += stepSize
  }
  
  // Trade duration (ensure we hit open and close prices roughly)
  const priceDiff = props.trade.close_price - props.trade.open_price
  
  for (let i = 0; i <= tradeDurationCandles; i++) {
    const progress = i / tradeDurationCandles
    const targetPrice = props.trade.open_price + (priceDiff * progress)
    
    // Add some noise but trend towards target
    const open = currentPrice
    const noise = (Math.random() - 0.5) * (props.trade.open_price * 0.0015)
    let close = targetPrice + noise
    
    // Force exact open/close on first/last candle of trade
    if (i === 0) close = props.trade.open_price
    if (i === tradeDurationCandles) close = props.trade.close_price
    
    const high = Math.max(open, close) + Math.random() * (open * 0.0008)
    const low = Math.min(open, close) - Math.random() * (open * 0.0008)
    
    data.push({ time: currentTime, open, high, low, close })
    currentPrice = close
    currentTime += stepSize
  }
  
  // Post-trade context
  for (let i = 0; i < postTradeCandles; i++) {
    const open = currentPrice
    const close = open + (Math.random() - 0.5) * (open * 0.0015)
    const high = Math.max(open, close) + Math.random() * (open * 0.0008)
    const low = Math.min(open, close) - Math.random() * (open * 0.0008)
    
    data.push({ time: currentTime, open, high, low, close })
    currentPrice = close
    currentTime += stepSize
  }
  
  return data
}

const initChart = () => {
  if (!chartContainer.value) return

  // Ensure container is empty
  chartContainer.value.innerHTML = ''

  try {
    const chartInstance = createChart(chartContainer.value, {
      layout: {
        background: { type: ColorType.Solid, color: '#1f2937' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#374151' },
        horzLines: { color: '#374151' },
      },
      width: chartContainer.value.clientWidth,
      height: 400,
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    })
    
    // Use markRaw to prevent Vue from making the chart reactive
    chart = markRaw(chartInstance)

    candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    })

    const data = generateData()
    candleSeries.setData(data)

    // Calculate Stop Loss and Take Profit for RR visualization
    const isWinningTrade = props.trade.profit_usd >= 0
    const priceDiff = Math.abs(props.trade.close_price - props.trade.open_price)
    
    // Estimate SL and TP based on the trade direction and outcome
    let stopLoss: number
    let takeProfit: number
    
    if (props.trade.order_type === 'BUY') {
      if (isWinningTrade) {
        // For winning BUY: SL below entry, TP at close
        stopLoss = props.trade.open_price - priceDiff * 0.5
        takeProfit = props.trade.close_price
      } else {
        // For losing BUY: SL at close, TP above entry
        stopLoss = props.trade.close_price
        takeProfit = props.trade.open_price + priceDiff * 2
      }
    } else {
      // SELL
      if (isWinningTrade) {
        // For winning SELL: SL above entry, TP at close
        stopLoss = props.trade.open_price + priceDiff * 0.5
        takeProfit = props.trade.close_price
      } else {
        // For losing SELL: SL at close, TP below entry
        stopLoss = props.trade.close_price
        takeProfit = props.trade.open_price - priceDiff * 2
      }
    }

    // Add price lines for RR visualization with better visibility
    const entryLine = candleSeries.createPriceLine({
      price: props.trade.open_price,
      color: '#fbbf24',
      lineWidth: 2,
      lineStyle: 0, // Solid
      axisLabelVisible: true,
      title: 'ENTRY',
    })

    const slLine = candleSeries.createPriceLine({
      price: stopLoss,
      color: '#ef4444',
      lineWidth: 3,
      lineStyle: 2, // Dashed
      axisLabelVisible: true,
      title: 'SL',
    })

    const tpLine = candleSeries.createPriceLine({
      price: takeProfit,
      color: '#10b981',
      lineWidth: 3,
      lineStyle: 2, // Dashed
      axisLabelVisible: true,
      title: 'TP',
    })

    // Add markers for Entry and Exit using v5 API with correct typing
    // Find closest data points for entry and exit
    const entryTime = new Date(props.trade.open_time).getTime() / 1000
    const exitTime = new Date(props.trade.close_time).getTime() / 1000
    
    const entryCandle = data.reduce((prev, curr) => 
      Math.abs(curr.time - entryTime) < Math.abs(prev.time - entryTime) ? curr : prev
    )
    
    const exitCandle = data.reduce((prev, curr) => 
      Math.abs(curr.time - exitTime) < Math.abs(prev.time - exitTime) ? curr : prev
    )

    // Create markers with proper v5 API format
    const markers: any[] = [
      {
        time: entryCandle.time,
        position: (props.trade.order_type === 'BUY' ? 'belowBar' : 'aboveBar') as any,
        color: '#fbbf24',
        shape: (props.trade.order_type === 'BUY' ? 'arrowUp' : 'arrowDown') as any,
        text: 'ENTRY',
        size: 1.5,
      },
      {
        time: exitCandle.time,
        position: (isWinningTrade 
          ? (props.trade.order_type === 'BUY' ? 'aboveBar' : 'belowBar')
          : (props.trade.order_type === 'BUY' ? 'belowBar' : 'aboveBar')) as any,
        color: isWinningTrade ? '#10b981' : '#ef4444',
        shape: (isWinningTrade 
          ? (props.trade.order_type === 'BUY' ? 'arrowUp' : 'arrowDown')
          : (props.trade.order_type === 'BUY' ? 'arrowDown' : 'arrowUp')) as any,
        text: 'EXIT',
        size: 1.5,
      }
    ]

    // Use the new v5 API for markers
    createSeriesMarkers(candleSeries, markers)
    
    chart.timeScale().fitContent()
  } catch (err) {
    console.error('Error initializing chart:', err)
  }
}

const handleResize = () => {
  if (chart && chartContainer.value) {
    chart.applyOptions({ width: chartContainer.value.clientWidth })
  }
}

onMounted(() => {
  // Small delay to ensure DOM is ready
  setTimeout(() => {
    initChart()
    window.addEventListener('resize', handleResize)
  }, 100)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (chart) {
    chart.remove()
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
  backdrop-filter: blur(4px);
}

.modal-content {
  background-color: #1f2937;
  border-radius: 0.75rem;
  width: 90%;
  max-width: 900px;
  border: 1px solid #374151;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #374151;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  color: #9ca3af;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #fff;
}

.chart-container {
  width: 100%;
  height: 400px;
}

.modal-footer {
  padding: 1rem 1.5rem;
  background-color: #111827;
  display: flex;
  gap: 2rem;
  border-top: 1px solid #374151;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 0.75rem;
  color: #9ca3af;
  text-transform: uppercase;
}

.value {
  font-size: 1.125rem;
  color: #e5e7eb;
  font-family: monospace;
}

.timeframe-selector {
  padding: 0.75rem 1.5rem;
  background-color: #111827;
  border-bottom: 1px solid #374151;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tf-btn {
  padding: 0.375rem 0.75rem;
  background-color: #374151;
  color: #9ca3af;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.tf-btn:hover {
  background-color: #4b5563;
  color: #e5e7eb;
}

.tf-btn.active {
  background-color: #3b82f6;
  color: white;
}

.timeframe-badge {
  display: inline-block;
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
  background-color: #374151;
  color: #9ca3af;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
}
</style>
