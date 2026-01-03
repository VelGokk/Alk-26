# SETUP RAPIDO (ALKAYA)

1) Instalar dependencias:
   - `npm install`

2) Crear `.env` basado en `.env.example` y completar valores.

3) Verificar variables:
   - `npm run env:check`

4) Inicializar base de datos y migraciones:
   - `npx prisma migrate dev --name init`
   - `npm run seed`

5) Ejecutar en local:
   - `npm run dev`

Credenciales seed (password: `Alkaya123!`):
- superadmin@alkaya.ai
- admin@alkaya.ai
- instructor@alkaya.ai
- reviewer@alkaya.ai
- moderator@alkaya.ai
- user@alkaya.ai

Notas:
- Si no configur�s Mercado Pago / Resend / Cloudinary / Mux / OpenAI, la app no se rompe: muestra “disabled”.

