# VERCEL DEPLOYMENT GUIDE

## 1. Preview vs Production

- **Preview branches**: cada push a una rama genera una URL tipo `branch-name.vercel.app`. Ideal para validar cambios pequeños, probar integraciones o QA de funcionalidades nuevas. La base de datos debe apuntar a un entorno de staging (Neon sandbox) y los env vars pueden ser distintas (ej. `NEXTAUTH_URL=https://staging.alkaya.app`).
- **Producción**: la rama `master/main` despliega automáticamente a `https://alkaya.vercel.app`. Usa las credenciales reales (producción) y activa integraciones como Mercado Pago o OpenAI solo cuando estén listas.

Vercel mantiene separados los env vars por scope (Preview/Production), así que siempre define los requeridos en ambos y actualiza `NEXTAUTH_URL`/`NEXT_PUBLIC_APP_URL` con la URL correspondiente.

## 2. Dominios y certificados

- Registro del dominio principal (ej. `alkaya.com`) apuntando a Vercel. En Vercel > Domains añade `alkaya.com` y `www.alkaya.com`, luego configura los DNS (CNAME/A).
- Activa redirecciones por defecto (`www` a raíz o viceversa) en la configuración del dominio.
- Vercel provee certificados SSL automáticamente; no se requiere acción adicional salvo verificar que el dominio esté "verde".

## 3. Variables de entorno críticas

Usar `scripts/check-env.mjs` antes de cada build para garantizar que los valores obligatorios existen.

### Críticas (fallan el build si faltan)
- `DATABASE_URL` → URL del Neon/Postgres (con SSL)
- `NEXTAUTH_SECRET` → `openssl rand -base64 32`
- `NEXTAUTH_URL` / `NEXT_PUBLIC_APP_URL` → URL pública (eg. `https://alkaya.vercel.app`)

### Opcionales (habilitan integraciones)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
- `RESEND_API_KEY`, `RESEND_FROM`
- `MERCADOPAGO_ACCESS_TOKEN`, `MERCADOPAGO_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `MUX_TOKEN_ID`, `MUX_TOKEN_SECRET`
- `OPENAI_API_KEY`

Documenta estos valores en `.env.example` para facilitar onboardings. Si añades nuevas variables, actualiza también `scripts/check-env.mjs` y `.env.example`.

## 4. Pipeline recomendado

1. `git pull` y actualiza dependencias (`npm install`).
2. Ejecuta `npm run check-env` para validar variables.
3. Corre tests o lint si aplica (`npm run lint`, `npm run qa:smoke` en staging).
4. `npm run build` (invocado por Vercel al desplegar; depende del paso anterior).
5. Migra la base de datos en producción con `npx prisma migrate deploy` antes del primer deploy o cuando se añade un cambio de esquema.

Vercel ya ejecuta `npm run build` en cada despliegue. Asegúrate de que `build` comienza con `npm run check-env` para capturar errores temprano (ya está configurado en `package.json`).

## 5. Checklist de despliegue

- [ ] Confirmar que `.env.example` y `scripts/check-env.mjs` incluyen cada variable nueva.
- [ ] Las variables críticas están definidas en los scopes de Preview/Production (mismas llaves, valores distintos si se requiere).
- [ ] Los certificados de dominio están vigentes (Vercel administra TLS automáticamente).
- [ ] Configurar redirecciones (www ↔ raíz si aplica) y habilitar `force HTTPS`.
- [ ] Validar integraciones sensibles (Mercado Pago webhook, Resend, OpenAI) en entorno de preview antes de activar en producción.
- [ ] Correr `npm run qa:smoke` (PowerShell script) contra el entorno de preview o local antes del merge final.

## 6. Seguridad y buenas prácticas

- Nunca commitear `.env` ni credenciales. Usa Secret scan plugins si deseas reforzar.
- Renueva `NEXTAUTH_SECRET` si se expone accidentalmente (puedes generar uno nuevo y redeployar).
- Revisa `logs` en Vercel y en la base de datos `SystemLog/AuditLog` si una ejecución falla.

