# Guía de Despliegue — Vercel y Netlify

Proyecto: **React + Vite** (SPA con `react-router-dom`)  
Directorio de salida: `build`  
Comando de build: `npm run build`

---

## Antes de desplegar — Variables de Entorno

El formulario de contacto usa Web3Forms. La key **no debe estar hardcodeada** en el código.

**1. Crea un archivo `.env` en la raíz del proyecto:**

```env
VITE_WEB3FORMS_KEY=tu_access_key_real_aqui
```

**2. Actualiza `src/pages/Contact.tsx` línea 9:**

```tsx
// Antes (INSEGURO):
const WEB3FORMS_ACCESS_KEY = 'TU_ACCESS_KEY_AQUI';

// Después (CORRECTO):
const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string;
```

**3. Agrega `.env` a tu `.gitignore`:**

```
.env
.env.local
```

> En Vite, todas las variables de entorno expuestas al cliente deben empezar con `VITE_`.

---

## Desplegar en Vercel

### Opción A — Desde la interfaz web (recomendado)

1. Ve a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
2. Haz clic en **"Add New Project"** e importa tu repositorio.
3. Vercel detecta automáticamente que es un proyecto Vite. Verifica la configuración:

   | Campo | Valor |
   |-------|-------|
   | Framework Preset | `Vite` |
   | Build Command | `npm run build` |
   | Output Directory | `build` |
   | Install Command | `npm install` |

4. Agrega la variable de entorno:
   - Ve a **Settings → Environment Variables**
   - Nombre: `VITE_WEB3FORMS_KEY`
   - Valor: tu key de Web3Forms

5. Haz clic en **"Deploy"**.

### Configuración para SPA (rutas del cliente)

El proyecto usa `BrowserRouter`, lo que significa que rutas como `/servicios` o `/contacto` deben redirigirse al `index.html`. Crea este archivo en la raíz:

**`vercel.json`**

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Opción B — Desde la terminal (Vercel CLI)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Iniciar sesión
vercel login

# Desplegar (primera vez)
vercel

# Desplegar a producción
vercel --prod
```

Durante el asistente interactivo, usa estos valores:
- Build Command: `npm run build`
- Output Directory: `build`

---

## Desplegar en Netlify

### Opción A — Desde la interfaz web (recomendado)

1. Ve a [netlify.com](https://netlify.com) e inicia sesión.
2. Haz clic en **"Add new site" → "Import an existing project"**.
3. Conecta tu repositorio de GitHub y selecciona el repo.
4. Configura el build:

   | Campo | Valor |
   |-------|-------|
   | Build Command | `npm run build` |
   | Publish Directory | `build` |

5. Agrega la variable de entorno:
   - Ve a **Site settings → Environment variables → Add a variable**
   - Key: `VITE_WEB3FORMS_KEY`
   - Value: tu key de Web3Forms

6. Haz clic en **"Deploy site"**.

### Configuración para SPA (rutas del cliente)

Crea el archivo `public/_redirects` (Netlify lo copia al directorio de salida automáticamente):

**`public/_redirects`**

```
/*    /index.html   200
```

Alternativamente, puedes usar `netlify.toml` en la raíz:

**`netlify.toml`**

```toml
[build]
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Opción B — Desde la terminal (Netlify CLI)

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Iniciar sesión
netlify login

# Conectar el sitio (primera vez)
netlify init

# Build y despliegue a producción
netlify deploy --prod --dir=build
```

---

## Resumen de archivos a crear

```
web_corporativa/
├── .env                  ← variables locales (agregar a .gitignore)
├── vercel.json           ← si despliegas en Vercel
├── netlify.toml          ← si despliegas en Netlify
└── public/
    └── _redirects        ← alternativa a netlify.toml para Netlify
```

---

## Checklist antes de desplegar

- [ ] `WEB3FORMS_ACCESS_KEY` usa `import.meta.env.VITE_WEB3FORMS_KEY`
- [ ] `.env` está en `.gitignore`
- [ ] Variable `VITE_WEB3FORMS_KEY` configurada en el dashboard de Vercel/Netlify
- [ ] Archivo `vercel.json` o `public/_redirects` creado (para rutas SPA)
- [ ] El build local funciona: `npm run build` sin errores

---

## Troubleshooting frecuente

### "Page Not Found" al refrescar la página
Falta la regla de redirect para SPA. Asegúrate de tener `vercel.json` (Vercel) o `public/_redirects` (Netlify).

### El formulario no envía correos
Verifica que la variable `VITE_WEB3FORMS_KEY` esté configurada en el dashboard de tu plataforma, no solo en `.env` local.

### Error de build: "Cannot find module"
Ejecuta `npm install` localmente y verifica que `node_modules` no esté en el repo.

### Las imágenes de assets no cargan
Vercel y Netlify sirven el contenido de la carpeta `build/`. Asegúrate de que los assets estén en `public/` o se importen correctamente en el código.
