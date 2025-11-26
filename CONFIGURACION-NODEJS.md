# 🔧 Guía de Configuración de Node.js en Windows

## ⚠️ PROBLEMA DETECTADO
Node.js está instalado pero no se encuentra en el PATH de Windows.

---

## 🛠️ SOLUCIÓN: Configurar Variables de Entorno

### **Opción 1: Configuración Manual del PATH (Recomendada)** ✅

#### **Paso 1: Encontrar la Ruta de Instalación de Node.js**

Node.js normalmente se instala en una de estas ubicaciones:

```
C:\Program Files\nodejs\
C:\Program Files (x86)\nodejs\
```

#### **Paso 2: Agregar Node.js al PATH**

1. **Presiona**: `Windows + R`
2. **Escribe**: `sysdm.cpl` y presiona Enter
3. **Haz clic** en la pestaña **"Opciones avanzadas"**
4. **Haz clic** en **"Variables de entorno..."**
5. En **"Variables del sistema"**, busca la variable **Path**
6. **Selecciónala** y haz clic en **"Editar..."**
7. **Haz clic** en **"Nuevo"**
8. **Agrega** la ruta donde instalaste Node.js:
   ```
   C:\Program Files\nodejs\
   ```
9. **Haz clic** en **"Aceptar"** en todas las ventanas

#### **Paso 3: Cerrar y Volver a Abrir PowerShell**

⚠️ **MUY IMPORTANTE**: Después de agregar al PATH, debes:
1. Cerrar TODAS las ventanas de PowerShell/CMD
2. Abrir una NUEVA ventana de PowerShell
3. Ahora ejecutar los comandos

---

### **Opción 2: Verificar Instalación de Node.js** 🔍

Si no estás seguro si Node.js se instaló correctamente:

#### **Método 1: Verificar en Programas**
1. Presiona `Windows + R`
2. Escribe: `appwiz.cpl` y presiona Enter
3. Busca "Node.js" en la lista de programas

#### **Método 2: Buscar Manualmente**
1. Abre el Explorador de Archivos
2. Ve a `C:\Program Files\nodejs\`
3. Verifica que existan los archivos:
   - `node.exe`
   - `npm.cmd`
   - `npx.cmd`

---

### **Opción 3: Reinstalar Node.js Correctamente** 🔄

Si no encuentras Node.js instalado:

1. **Descargar Node.js LTS**:
   - Ve a: https://nodejs.org/
   - Descarga la versión **LTS** (Long Term Support)
   - Ejemplo: `node-v20.x.x-x64.msi`

2. **Ejecutar el Instalador**:
   - Haz doble clic en el archivo `.msi`
   - ✅ **IMPORTANTE**: Marca la opción **"Add to PATH"** durante la instalación
   - Haz clic en "Next" hasta completar

3. **Verificar la Instalación**:
   - Abre una NUEVA ventana de PowerShell
   - Ejecuta: `node --version`
   - Ejecuta: `npm --version`

---

## 🔍 VERIFICACIÓN PASO A PASO

### **1. Abre PowerShell como Administrador**
- Presiona `Windows + X`
- Selecciona "Windows PowerShell (Admin)"

### **2. Verifica Node.js**
```powershell
node --version
```
**Resultado esperado**: `v20.x.x` o similar

### **3. Verifica npm**
```powershell
npm --version
```
**Resultado esperado**: `10.x.x` o similar

### **4. Verifica la Ubicación**
```powershell
where.exe node
where.exe npm
```
**Resultado esperado**: 
```
C:\Program Files\nodejs\node.exe
C:\Program Files\nodejs\npm.cmd
```

---

## 🚀 UNA VEZ QUE NODE.JS FUNCIONE

### **Paso 1: Navegar al Proyecto**
```powershell
cd c:\Users\harry\OneDrive\Documentos\trading-bot-frontend
```

### **Paso 2: Verificar que package.json Existe**
```powershell
dir package.json
```

### **Paso 3: Instalar Dependencias del Proyecto**
```powershell
npm install
```

### **Paso 4: Instalar Plotly (Requerido para los Gráficos)**
```powershell
npm install plotly.js-dist-min --save
```

### **Paso 5: Crear Archivo .env**
```powershell
echo "NUXT_PUBLIC_API_BASE_URL=http://localhost:8000" > .env
```

### **Paso 6: Ejecutar el Proyecto**
```powershell
npm run dev
```

---

## 📋 CHECKLIST DE CONFIGURACIÓN

- [ ] Node.js instalado en `C:\Program Files\nodejs\`
- [ ] PATH configurado correctamente
- [ ] PowerShell CERRADO y REABIERTO
- [ ] `node --version` funciona ✅
- [ ] `npm --version` funciona ✅
- [ ] `npm install` ejecutado
- [ ] `npm install plotly.js-dist-min` ejecutado
- [ ] Archivo `.env` creado
- [ ] `npm run dev` ejecutado

---

## 🐛 TROUBLESHOOTING

### **Error: "node no se reconoce como comando"**
**Solución**: 
1. Verifica que Node.js esté instalado
2. Agrega `C:\Program Files\nodejs\` al PATH
3. REINICIA PowerShell

### **Error: "npm no se reconoce como comando"**
**Solución**: 
1. npm viene con Node.js
2. Verifica el PATH
3. Reinstala Node.js con la opción "Add to PATH"

### **Error: "Cannot find module"**
**Solución**:
```powershell
npm install
```

### **Error de permisos**
**Solución**:
1. Abre PowerShell como Administrador
2. Ejecuta los comandos de instalación

---

## 💡 COMANDOS ÚTILES

### **Ver la versión de Node.js**
```powershell
node --version
```

### **Ver la versión de npm**
```powershell
npm --version
```

### **Ver dónde está instalado Node.js**
```powershell
where.exe node
```

### **Verificar PATH actual**
```powershell
$env:Path -split ';'
```

### **Limpiar caché de npm (si hay problemas)**
```powershell
npm cache clean --force
```

---

## 🎯 SIGUIENTE PASO

Una vez que `node --version` y `npm --version` funcionen:

1. Vuelve a este chat
2. Te ayudaré a instalar las dependencias
3. Ejecutaremos el proyecto

---

## ⚡ ACCESOS RÁPIDOS

**Abrir Variables de Entorno**:
```powershell
rundll32 sysdm.cpl,EditEnvironmentVariables
```

**Abrir Explorador en la ruta de Node.js**:
```powershell
explorer "C:\Program Files\nodejs\"
```

**Descargar Node.js**:
https://nodejs.org/

---

¡Sigue esta guía y avísame cuando `node --version` funcione! 🚀
