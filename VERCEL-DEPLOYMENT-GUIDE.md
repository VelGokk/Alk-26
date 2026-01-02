# VERCEL DEPLOYMENT GUIDE

1) Crear proyecto en Vercel
   - Importar este repositorio.
   - Framework: Next.js (detectar automático).

2) Configurar base de datos (Neon)
   - Crear un proyecto en Neon.
   - Copiar `DATABASE_URL` y cargarlo en Vercel.

3) Variables de entorno obligatorias (Vercel)
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET` (generar con `openssl rand -base64 32`)
   - `NEXTAUTH_URL` (URL de producción, ej: https://alkaya.vercel.app)
   - `NEXT_PUBLIC_APP_URL` (igual a `NEXTAUTH_URL`)

4) Variables opcionales (si querés activar integraciones)
   - Mercado Pago: `MERCADOPAGO_ACCESS_TOKEN`, `MERCADOPAGO_WEBHOOK_SECRET`
   - Resend: `RESEND_API_KEY`, `RESEND_FROM`
   - Cloudinary: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - Mux: `MUX_TOKEN_ID`, `MUX_TOKEN_SECRET`
   - OpenAI: `OPENAI_API_KEY`
   - OAuth: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`

5) Build & Deploy
   - Vercel ejecuta `npm install` y `npm run build` por defecto.
   - Prisma genera cliente en `postinstall`.

6) Migraciones en producción
   - Ejecutar en local: `npx prisma migrate deploy`
   - O usar un script de CI/CD externo.

Seguridad:
- No subir tokens al repositorio. Siempre usar variables en Vercel.
