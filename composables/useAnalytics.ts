import { computed } from 'vue'
import { useAnalyticsStore } from '~/stores/analytics'

export const useAnalytics = () => {
    const analyticsStore = useAnalyticsStore()

    const analytics = computed(() => analyticsStore.analytics)
    const trades = computed(() => analyticsStore.trades)
    const loading = computed(() => analyticsStore.loading)
    const error = computed(() => analyticsStore.error)

    const totalProfit = computed(() => analyticsStore.totalProfit)
    const winRate = computed(() => analyticsStore.winRate)
    const profitFactor = computed(() => analyticsStore.profitFactor)

    const sortedTrades = computed(() => analyticsStore.sortedTrades)
    const winningTrades = computed(() => analyticsStore.winningTrades)
    const losingTrades = computed(() => analyticsStore.losingTrades)

    return {
        // State
        analytics,
        trades,
        loading,
        error,

        // Computed properties
        totalProfit,
        winRate,
        profitFactor,
        sortedTrades,
        winningTrades,
        losingTrades,

        // Actions
        fetchAnalytics: analyticsStore.fetchAnalytics,
        fetchTrades: analyticsStore.fetchTrades,
        uploadTrades: analyticsStore.uploadTrades
    }
}
