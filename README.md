# Trading Bot Frontend - Vue 3 + Nuxt 3

Professional frontend interface for real-time trading bot control with Vue 3 and Nuxt 3. Features comprehensive dashboard, account management, positions tracking, live charts, strategy control panel, and order management with beautiful Tailwind CSS design.

## Project Structure

```
trading-bot-frontend/
├── app.vue                    # Root component
├── nuxt.config.ts            # Nuxt configuration
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
├── components/
│   ├── Dashboard/
│   │   ├── AccountCard.vue       # Account info display
│   │   ├── PositionsTable.vue    # Open positions table
│   │   ├── StrategyPanel.vue     # Strategy control
│   │   ├── LiveChart.vue         # Real-time price charts
│   ├── Forms/
│   │   ├── OrderForm.vue         # Create orders
│   │   ├── StrategyForm.vue      # Configure strategies
│   │   ├── SettingsForm.vue      # App settings
│   ├── Layout/
│   │   ├── Navbar.vue            # Top navigation
│   │   ├── Sidebar.vue           # Side menu
│   │   ├── Footer.vue            # Footer
│   ├── Common/
│   │   ├── LoadingSpinner.vue    # Loading indicator
│   │   ├── ErrorAlert.vue        # Error display
│   │   ├── SuccessNotification.vue # Success notifications
├── pages/
│   ├── index.vue             # Dashboard main
│   ├── backtest.vue          # Backtesting page
│   ├── strategies.vue        # Strategy management
│   ├── orders.vue            # Order history
│   ├── settings.vue          # Settings page
│   ├── about.vue             # About page
├── layouts/
│   ├── default.vue           # Default layout
│   ├── minimal.vue           # Minimal layout
├── composables/
│   ├── useApi.ts             # API calls hook
│   ├── useWebSocket.ts       # WebSocket hook
│   ├── useTradingStore.ts    # Trading store hook
│   ├── useNotification.ts    # Notifications hook
├── stores/
│   ├── trading.ts            # Trading data store
│   ├── strategies.ts         # Strategies store
│   ├── orders.ts             # Orders store
│   ├── ui.ts                 # UI state store
├── types/
│   ├── index.ts              # Global types
│   ├── api.ts                # API types
│   ├── trading.ts            # Trading types
│   ├── strategy.ts           # Strategy types
├── server/
│   ├── api/                  # Nitro API routes
│   ├── config.ts             # Server configuration
├── public/
│   ├── favicon.ico
│   ├── logo.png
├── assets/
│   ├── styles/
│   │   ├── main.css              # Global styles
│   │   ├── variables.css         # CSS variables
│   ├── icons/
│   │   ├── buy.svg
│   │   ├── sell.svg
│   │   ├─┐ trading.svg
├── utils/
│   ├── api.ts                # HTTP client setup
│   ├── formatter.ts          # Data formatting
│   ├─┐ validators.ts         # Form validators
├── .env.example
├── package.json
├── package-lock.json
├── README.md
├── .nuxtignore
├─┐ .gitignore
```

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/tu-usuario/trading-bot-frontend.git
cd trading-bot-frontend
```

### 2. Install Dependencies

```bash
npm install
# or with yarn
yarn install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
NUXT_PUBLIC_API_BASE_URL=http://localhost:8000
NUXT_PUBLIC_API_VERSION=v1
NUXT_PUBLIC_WS_URL=ws://localhost:8000
```

### 4. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Access the application at `http://localhost:3000`

## Dependencies

**Core Framework:**
- vue==3.3.0
- nuxt==3.8.0
- pinia==2.1.0

**HTTP & WebSocket:**
- axios==1.6.0
- socket.io-client==4.7.0

**UI & Styling:**
- tailwindcss==3.3.0
- postcss==8.4.0
- autoprefixer==10.4.0

**Charts & Visualization:**
- recharts==2.10.0

**Utilities:**
- vueusecore==10.7.0
- typescript==5.3.0

**Development:**
- nuxtdevtools==1.0.0
- @nuxtjs/tailwindcss==6.10.0
- eslint==8.0.0
- @typescript-eslint/eslint-plugin==6.0.0

## Key Features

**Dashboard Components:**
- **AccountCard**: Display balance, equity, profit, and margin info
- **PositionsTable**: Real-time open positions with profit/loss
- **StrategyPanel**: Active strategy control and monitoring
- **LiveChart**: Real-time price charts with Recharts

**Forms & Controls:**
- **OrderForm**: Quick order creation (Buy/Sell)
- **StrategyForm**: Configure and start strategies
- **SettingsForm**: Application preferences

**Data Management:**
- Pinia stores for centralized state
- WebSocket integration for real-time updates
- Composable hooks for reusable logic

**UI/UX:**
- Dark mode optimized design
- Tailwind CSS for responsive layouts
- Custom trading theme colors
- Professional animations and transitions

## API Integration

The frontend connects to the backend API at:

```
http://localhost:8000/api/v1/
```

**Key Endpoints Used:**
- `GET /account` - Account information
- `GET /positions` - Open positions
- `GET /rates` - OHLCV data
- `POST /orders/buy` - Create buy order
- `POST /orders/sell` - Create sell order
- `GET /strategies` - Available strategies
- `POST /strategies/start` - Start strategy

## WebSocket Connections

Real-time updates through WebSocket at `ws://localhost:8000`:

- Price updates
- Position changes
- Order fills
- Strategy events

## Build & Deployment

### Build for Production

```bash
npm run build
```

### Generate Static Site

```bash
npm run generate
```

### Preview Production Build

```bash
npm run preview
```

## Tailwind CSS Customization

Custom theme in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      trading: {
        primary: '#2d8f8f',
        secondary: '#1a6464',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b'
      }
    }
  }
}
```

## Component Examples

### AccountCard Component

Displays real-time account information including balance, equity, and margin.

### PositionsTable Component

Shows all open positions with entry price, current price, and profit/loss.

### LiveChart Component

Renders OHLCV data using Recharts for professional trading charts.

## Next Steps

- [ ] Implement missing UI components
- [ ] Connect WebSocket real-time updates
- [ ] Add Recharts visualizations
- [ ] Implement notification system
- [ ] Add unit and E2E tests
- [ ] Complete API documentation
- [ ] Setup Docker deployment

## GitHub Setup

1. Create empty repository on GitHub: `trading-bot-frontend`
2. Clone this project
3. Change remote:

```bash
git remote set-url origin https://github.com/tu-usuario/trading-bot-frontend.git
git push -u origin main
```

## License

MIT License - Feel free to use and modify for your trading UI projects.
