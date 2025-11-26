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
  
  // Hora del día
  hourly_profit?: number[]
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
