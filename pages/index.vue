<template>
  <div class="page-index">
    <div class="hero">
      <h1 class="hero-title">📊 Trading Analytics Dashboard</h1>
      <p class="hero-subtitle">Analiza tu performance de trading con herramientas profesionales</p>
      
      <div class="action-buttons">
        <NuxtLink to="/upload" class="btn btn-primary">
          📤 Subir Operaciones
        </NuxtLink>
        <NuxtLink to="/journal" class="btn btn-secondary">
          📈 Ver Dashboard
        </NuxtLink>
      </div>
    </div>
    
    <div class="features">
      <div class="feature-card">
        <div class="feature-icon">📊</div>
        <h3>KPIs Profesionales</h3>
        <p>Win Rate, Profit Factor, Drawdown y más</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">📈</div>
        <h3>Equity Curve</h3>
        <p>Visualiza tu curva de capital en tiempo real</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">📅</div>
        <h3>Heatmap Diario</h3>
        <p>Performance día a día en calendario visual</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">📋</div>
        <h3>Historial Completo</h3>
        <p>Todas tus operaciones con filtros avanzados</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Inicio'
})
</script>

<style scoped>
.page-index {
  @apply min-h-screen p-8;
}

.hero {
  @apply text-center max-w-4xl mx-auto mb-16 mt-12;
}

.hero-title {
  @apply text-6xl font-bold text-white mb-4;
}

.hero-subtitle {
  @apply text-xl text-gray-400 mb-8;
}

.action-buttons {
  @apply flex gap-4 justify-center flex-wrap;
}

.btn {
  @apply px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105;
}

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 shadow-lg;
}

.btn-secondary {
  @apply bg-gray-700 text-white hover:bg-gray-600 border-2 border-gray-600;
}

.features {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto;
}

.feature-card {
  @apply bg-gray-800 p-6 rounded-lg border border-gray-700 text-center hover:border-blue-500 transition-all duration-300;
}

.feature-icon {
  @apply text-5xl mb-4;
}

.feature-card h3 {
  @apply text-xl font-bold text-white mb-2;
}

.feature-card p {
  @apply text-gray-400;
}
</style>
