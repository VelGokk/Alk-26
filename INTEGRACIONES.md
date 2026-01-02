# INTEGRACIONES (ALKAYA)

## Mercado Pago (AR)
Variables:
- `MERCADOPAGO_ACCESS_TOKEN` (obligatoria para pagos)
- `MERCADOPAGO_WEBHOOK_SECRET` (opcional, para validar firma)

Flujos:
- `POST /api/mercadopago/create-preference` crea preferencia.
- `POST /api/mercadopago/webhook` procesa pagos.

## Resend (emails)
Variables:
- `RESEND_API_KEY`
- `RESEND_FROM` (ej: "ALKAYA <hola@tu-dominio.com>")

Si no existen, el sistema solo loguea y sigue.

## Cloudinary (storage)
Variables:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Si faltan, los uploads se guardan localmente en `public/uploads` (solo dev).

## Mux (live/video)
Variables:
- `MUX_TOKEN_ID`
- `MUX_TOKEN_SECRET`

Si faltan, el panel muestra “disabled” y no rompe.

## IA (OpenAI)
Variables:
- `OPENAI_API_KEY`

Endpoint:
- `POST /api/ai/quiz` (genera quiz si está configurado)

## OAuth (opcional)
Google:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

GitHub:
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
