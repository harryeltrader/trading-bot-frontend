import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Analytics, Trade } from '~/types/analytics'

export const useAnalyticsStore = defineStore('analytics', () => {
    // State
    const analytics = ref<Analytics | null>(null)
    const trades = ref<Trade[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    // Actions
    const fetchAnalytics = async () => {
        loading.value = true
        error.value = null

        try {
            const config = useRuntimeConfig()
            const baseURL = config.public.apiBaseUrl || 'http://localhost:8000'
            const url = `${baseURL}/api/v1/analytics/summary`

            console.log('🔄 Fetching analytics from:', url)

            const response = await $fetch<Analytics>(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            console.log('✅ Analytics response:', response)
            analytics.value = response
        } catch (err: any) {
            error.value = err.message || 'Error al cargar analytics'
            console.error('❌ Error fetching analytics:', err)
            console.error('❌ Error details:', {
                message: err.message,
                status: err.statusCode,
                data: err.data
            })
        } finally {
            loading.value = false
        }
    }

    const fetchTrades = async (filters = {}) => {
        loading.value = true
        error.value = null

        try {
            const config = useRuntimeConfig()
            const baseURL = config.public.apiBaseUrl || 'http://localhost:8000'
            const url = `${baseURL}/api/v1/analytics/filter`

            console.log('🔄 Fetching trades from:', url, 'with filters:', filters)

            const response = await $fetch<{ trades: Trade[] }>(url, {
                method: 'GET',
                params: filters,
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            console.log('✅ Trades response:', response)
            trades.value = response.trades || []
        } catch (err: any) {
            error.value = err.message || 'Error al cargar trades'
            console.error('❌ Error fetching trades:', err)
            console.error('❌ Error details:', {
                message: err.message,
                status: err.statusCode,
                data: err.data
            })
        } finally {
            loading.value = false
        }
    }

    const uploadTrades = async (file: File) => {
        loading.value = true
        error.value = null

        try {
            const config = useRuntimeConfig()
            const baseURL = config.public.apiBaseUrl || 'http://localhost:8000'

            const formData = new FormData()
            formData.append('file', file)

            const response = await $fetch(`${baseURL}/api/v1/analytics/upload-trades`, {
                method: 'POST',
                body: formData
            })

            // Refetch analytics and trades after upload
            await fetchAnalytics()
            await fetchTrades()

            return response
        } catch (err: any) {
            error.value = err.message || 'Error al subir archivo'
            console.error('Error uploading trades:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    // Getters
    const sortedTrades = computed(() => {
        return [...trades.value].sort((a, b) =>
            new Date(b.open_time).getTime() - new Date(a.open_time).getTime()
        )
    })

    const winningTrades = computed(() => {
        return trades.value.filter(t => t.status === 'GANADOR')
    })

    const losingTrades = computed(() => {
        return trades.value.filter(t => t.status === 'PERDEDOR')
    })

    const totalProfit = computed(() => analytics.value?.total_profit || 0)
    const winRate = computed(() => analytics.value?.win_rate || 0)
    const profitFactor = computed(() => analytics.value?.profit_factor || 0)

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
        totalProfit,
        winRate,
        profitFactor,

        // Actions
        fetchAnalytics,
        fetchTrades,
        uploadTrades
    }
})
