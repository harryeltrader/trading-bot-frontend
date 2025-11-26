<template>
  <div class="page-upload">
    <h1 class="page-title">📤 Cargar Historial de Operaciones</h1>
    
    <div class="upload-container">
      <div class="instruction-card">
        <h2>📋 Instrucciones</h2>
        <ol>
          <li>Exporta tu historial desde MT5: <code>Historial → Guardar como Informe</code></li>
          <li>Selecciona formato <strong>CSV</strong></li>
          <li>Arrastra el archivo aquí o haz clic para seleccionar</li>
        </ol>
      </div>
      
      <div
        class="dropzone"
        :class="{ 'is-dragging': isDragging }"
        @drop.prevent="handleDrop"
        @dragover.prevent="isDragging = true"
        @dragleave="isDragging = false"
      >
        <input
          ref="fileInput"
          type="file"
          accept=".csv"
          @change="handleFileSelect"
          class="file-input"
        />
        
        <div class="dropzone-content" @click="($refs.fileInput as HTMLInputElement)?.click()">
          <div class="icon">📁</div>
          <p class="title">Arrastra tu archivo CSV aquí</p>
          <p class="subtitle">o haz clic para seleccionar</p>
        </div>
      </div>
      
      <div v-if="selectedFile" class="file-preview">
        <div class="file-info">
          <span class="file-name">{{ selectedFile.name }}</span>
          <span class="file-size">{{ formatFileSize(selectedFile.size) }}</span>
        </div>
        
        <button
          @click="uploadFile"
          :disabled="uploading"
          class="btn btn-primary btn-lg"
        >
          {{ uploading ? '⏳ Procesando...' : '🚀 Procesar Archivo' }}
        </button>
      </div>
      
      <div v-if="error" class="error-message">
        ❌ {{ error }}
      </div>
      
      <div v-if="success" class="success-message">
        ✅ Archivo procesado exitosamente. Redirigiendo...
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAnalyticsStore } from '~/stores/analytics'

const router = useRouter()
const analyticsStore = useAnalyticsStore()

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const isDragging = ref(false)
const uploading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    validateAndSetFile(files[0])
  }
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    validateAndSetFile(files[0])
  }
}

const validateAndSetFile = (file: File) => {
  if (!file.name.endsWith('.csv')) {
    error.value = 'Solo se aceptan archivos CSV'
    return
  }
  
  if (file.size > 10 * 1024 * 1024) { // 10MB
    error.value = 'El archivo es demasiado grande (máx 10MB)'
    return
  }
  
  selectedFile.value = file
  error.value = null
}

const uploadFile = async () => {
  if (!selectedFile.value) return
  
  uploading.value = true
  error.value = null
  
  try {
    await analyticsStore.uploadTrades(selectedFile.value)
    success.value = true
    
    setTimeout(() => {
      router.push('/journal')
    }, 1500)
  } catch (err: any) {
    error.value = err.message || 'Error al procesar el archivo'
  } finally {
    uploading.value = false
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}
</script>

<style scoped>
.page-upload {
  @apply max-w-4xl mx-auto p-8;
}

.page-title {
  @apply text-4xl font-bold text-white mb-8;
}

.upload-container {
  @apply space-y-6;
}

.instruction-card {
  @apply bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg p-6;
}

.instruction-card h2 {
  @apply text-xl font-bold text-white mb-4;
}

.instruction-card ol {
  @apply space-y-2 text-gray-300 pl-5;
}

.instruction-card code {
  @apply bg-gray-800 px-2 py-1 rounded text-sm;
}

.dropzone {
  @apply border-4 border-dashed border-gray-600 rounded-lg p-12 transition cursor-pointer;
}

.dropzone.is-dragging {
  @apply border-blue-500 bg-blue-900 bg-opacity-20;
}

.dropzone-content {
  @apply text-center;
}

.file-input {
  @apply hidden;
}

.icon {
  @apply text-6xl mb-4;
}

.title {
  @apply text-xl font-bold text-white mb-2;
}

.subtitle {
  @apply text-gray-400;
}

.file-preview {
  @apply bg-gray-800 rounded-lg p-6 flex justify-between items-center;
}

.file-info {
  @apply flex flex-col;
}

.file-name {
  @apply text-white font-bold;
}

.file-size {
  @apply text-gray-400 text-sm;
}

.btn {
  @apply px-6 py-3 rounded font-semibold transition;
}

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.btn-primary:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.btn-lg {
  @apply text-lg;
}

.error-message {
  @apply bg-red-900 bg-opacity-30 border border-red-500 rounded-lg p-4 text-red-300;
}

.success-message {
  @apply bg-green-900 bg-opacity-30 border border-green-500 rounded-lg p-4 text-green-300;
}
</style>
