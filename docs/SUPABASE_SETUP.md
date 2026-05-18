# Configuración de Supabase — OPL Pacífico Sur

Guía para conectar el sitio web corporativo con tu proyecto de Supabase (noticias + panel admin).

## 1. Crear o usar un proyecto

1. Entra en [supabase.com/dashboard](https://supabase.com/dashboard).
2. Crea un proyecto nuevo o abre el que ya tengas.
3. Anota el **Project URL** y la **anon public key**:
   - **Settings** → **API** → `Project URL`
   - **Settings** → **API** → `anon` `public`

> Si borraste un proyecto anterior, las llaves del proyecto viejo **ya no funcionan**. Debes usar las del proyecto nuevo.

## 2. Variables de entorno locales

Crea un archivo `.env` en la raíz del proyecto (no lo subas a Git):

```env
VITE_SUPABASE_URL=https://TU_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Formulario de contacto (Web3Forms)
VITE_WEB3FORMS_KEY=tu_access_key_de_web3forms
```

Reinicia el servidor de desarrollo después de cambiar `.env`:

```bash
npm run dev
```

## 3. Crear la tabla `news` y políticas RLS

En el dashboard: **SQL Editor** → **New query** → pega y ejecuta el contenido de:

[`supabase/migrations/001_news.sql`](../supabase/migrations/001_news.sql)

Eso crea:

- Tabla `public.news` con slug, título, extracto, contenido, imagen, etc.
- Índices y trigger `updated_at`
- Row Level Security (lectura pública de publicadas; escritura solo autenticados)

## 4. Usuario administrador (Supabase Auth)

1. **Authentication** → **Users** → **Add user** → **Create new user**
2. Email y contraseña del admin (ej. `admin@tuempresa.com`)
3. Confirma el email si el proyecto lo exige (o desactiva confirmación en **Auth** → **Providers** → **Email** para desarrollo)

El panel admin está en:

- Login: `/admin/login`
- Panel: `/admin`

Solo usuarios con sesión activa pueden crear, editar o eliminar noticias.

## 5. Storage para imágenes de noticias

El admin **solo sube imágenes** al bucket `news-images` de Supabase (no se usan URLs externas en el formulario).

En el **SQL Editor**, ejecuta también:

[`supabase/migrations/002_storage_news_images.sql`](../supabase/migrations/002_storage_news_images.sql)

Eso crea el bucket público `news-images` (máx. 5 MB, JPG/PNG/WebP/GIF) y las políticas:

- **Lectura**: pública (cualquiera ve las imágenes en el sitio)
- **Escritura**: solo usuarios autenticados (admin con sesión iniciada)

Alternativa manual en el dashboard: **Storage** → **New bucket** → `news-images` → Public, y añade las mismas políticas RLS.

## 6. Despliegue (Vercel / Netlify)

Añade las mismas variables en el panel de tu hosting:

| Variable | Descripción |
|----------|-------------|
| `VITE_SUPABASE_URL` | URL del proyecto |
| `VITE_SUPABASE_ANON_KEY` | Clave anon pública |
| `VITE_WEB3FORMS_KEY` | Clave Web3Forms |

Vuelve a desplegar tras guardar las variables.

## 7. Verificación

- [ ] `.env` con URL y anon key del **proyecto correcto**
- [ ] SQL `001_news.sql` ejecutado sin errores
- [ ] SQL `002_storage_news_images.sql` ejecutado (subida de imágenes)
- [ ] Usuario admin creado en Authentication
- [ ] `/admin/login` — inicio de sesión OK
- [ ] `/admin` — crear noticia de prueba
- [ ] `/noticias` — aparece la noticia
- [ ] `/noticias/tu-slug` — vista de detalle
- [ ] Formulario `/contacto` sigue enviando con Web3Forms

## 8. Datos de demostración

En `/admin`, si no hay noticias, usa el botón **Cargar Demo** para insertar 3 artículos de ejemplo vía Supabase.

## Notas

- El código **no** usa el proyecto hardcodeado antiguo (`info.tsx`); todo pasa por `VITE_SUPABASE_*`.
- Los mensajes de contacto **no** se guardan en Supabase; van a Web3Forms.
- La Edge Function legacy (`make-server-72bfe855`) está deprecada y no es necesaria para noticias.
