# 🔍 Troubleshooting - Datos No Cargan

## ✅ Cambios Realizados

### 1. Store Analytics Mejorado
- ✅ Agregado console.log detallado
- ✅ Mejor manejo de errores CORS
- ✅ Headers explícitos en requests

### 2. Página Journal Actualizada
- ✅ Indicadores de carga visuales
- ✅ Mensajes de error en pantalla
- ✅ Contador de operaciones cargadas

---

## 🔍 Diagnóstico Paso a Paso

### **Paso 1: Verificar la Consola del Navegador**

1. Abre la página: `http://localhost:3000/journal`
2. Presiona `F12` para abrir DevTools
3. Ve a la pestaña **Console**
4. Busca estos mensajes:

```
🔄 Fetching analytics from: http://localhost:8000/api/v1/analytics/summary
✅ Analytics response: { ... }
🔄 Fetching trades from: http://localhost:8000/api/v1/analytics/filter
✅ Trades response: { ... }
```

### **Paso 2: Identificar el Problema**

#### **Si ves errores de CORS:**
```
Access to fetch at 'http://localhost:8000' has been blocked by CORS policy
```

**Solución**: Agregar CORS en el backend

#### **Si ves errores 404:**
```
❌ Error fetching analytics: 404 Not Found
```

**Solución**: Verificar que los endpoints existan en el backend

#### **Si ves errores 500:**
```
❌ Error fetching analytics: 500 Internal Server Error
```

**Solución**: Revisar logs del backend

---

## 🛠️ Soluciones Comunes

### **Problema 1: CORS No Configurado** 🔴

#### **Síntoma:**
```
CORS policy: No 'Access-Control-Allow-Origin' header
```

#### **Solución en FastAPI:**

```python
# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Agregar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### **Problema 2: Backend No Está Corriendo** 🔴

#### **Síntoma:**
```
❌ Error fetching analytics: fetch failed
```

#### **Solución:**
1. Verificar que el backend esté corriendo:
   ```bash
   # En otra terminal
   cd tu-backend
   uvicorn main:app --reload
   ```

2. Verificar en: `http://localhost:8000/docs`

---

### **Problema 3: URL Incorrecta** 🔴

#### **Síntoma:**
```
🔄 Fetching analytics from: http://localhost:8000/api/v1/analytics/summary
❌ Error: 404
```

#### **Solución:**
Verificar qué URL espera tu backend. Podría ser:
- `/analytics/summary` (sin /api/v1)
- `/api/analytics/summary` (sin v1)

**Actualizar `.env`:**
```env
NUXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

O si tu backend usa otra ruta, cambiar en el store.

---

### **Problema 4: Estructura de Respuesta Diferente** 🔴

#### **Síntoma:**
```
✅ Analytics response: null
```

#### **Solución:**

Tu backend debe retornar esta estructura exacta:

```json
{
  "total_trades": 100,
  "winning_trades": 60,
  "losing_trades": 40,
  "break_even": 0,
  "total_profit": 5000.50,
  "total_profit_pct": 25.5,
  "win_rate": 60.0,
  "profit_factor": 2.5,
  "max_drawdown": -500.0,
  "max_drawdown_pct": -5.0,
  "longest_win_streak": 10,
  "longest_loss_streak": 3,
  "best_day_profit": 1000.0,
  "worst_day_profit": -300.0,
  "equity_dates": ["2024-01-01", "2024-01-02"],
  "equity_curve": [10000, 10500],
  "drawdown_curve": [0, -100],
  "daily_stats": [
    {"date": "2024-01-01", "profit": 500, "trades": 5}
  ],
  "profit_distribution": [100, 200, -50]
}
```

---

## 📋 Checklist de Verificación

### **Backend**
- [ ] Backend está corriendo en `http://localhost:8000`
- [ ] Endpoint `/api/v1/analytics/summary` existe
- [ ] Endpoint `/api/v1/analytics/filter` existe
- [ ] CORS está configurado para `http://localhost:3000`
- [ ] Backend retorna la estructura correcta

### **Frontend**
- [ ] `.env` tiene la URL correcta del backend
- [ ] Servidor Nuxt está corriendo en puerto 3000
- [ ] No hay errores en la consola del navegador
- [ ] Mensajes de debug aparecen en journal

---

## 🧪 Pruebas Manuales

### **Test 1: Probar Endpoint Directo**

Abre en el navegador:
```
http://localhost:8000/api/v1/analytics/summary
```

**Resultado esperado**: JSON con datos de analytics

### **Test 2: Probar con cURL**

```bash
curl http://localhost:8000/api/v1/analytics/summary
```

**Resultado esperado**: JSON response

### **Test 3: Verificar Network en DevTools**

1. F12 → Pestaña **Network**
2. Recargar página del journal
3. Buscar request a `/analytics/summary`
4. Ver:
   - **Status**: Debe ser 200
   - **Response**: Debe tener datos JSON
   - **Headers**: Debe tener CORS headers

---

## 🔄 Pasos Siguientes

### **Si Encuentras el Error:**

1. **Compartir el mensaje de error exacto** de la consola
2. **Verificar qué endpoint falla**: summary o filter
3. **Compartir la respuesta del backend** (desde browser o curl)

### **Si CORS es el Problema:**

Agrega este código al backend FastAPI:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Temporal para debug
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### **Si la URL es el Problema:**

Actualiza el `.env`:
```env
NUXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Y reinicia Nuxt:
```bash
# Ctrl+C para detener
npm run dev
```

---

## 💡 Información de Debug Visible

Con los cambios realizados, ahora en `http://localhost:3000/journal` verás:

1. **⏳ Cargando datos...** (mientras carga)
2. **❌ Error: [mensaje]** (si hay error)
3. **✅ Datos cargados: X operaciones** (si todo está bien)

Y en la **consola del navegador**:
- 🔄 URL que se está llamando
- ✅ Respuesta recibida
- ❌ Errores detallados con código y mensaje

---

## 🎯 Siguiente Paso

1. Abre `http://localhost:3000/journal` en el navegador
2. Abre DevTools (F12)
3. Observa los mensajes de debug
4. Compárteme:
   - Qué mensaje de debug aparece en la página
   - Qué aparece en la consola del navegador

¡Con esa información puedo ayudarte a resolver el problema específico! 🚀
