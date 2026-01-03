# QA CHECKLIST (Local + Prod)

## Base
- [ ] `npm run env:check` sin faltantes críticos.
- [ ] `npm run lint` sin errores.
- [ ] `npm run typecheck` sin errores.
- [ ] `npm run build` exitoso.

## Auth & Roles
- [ ] Login con `superadmin@alkaya.ai` (redirect a /super-admin).
- [ ] Login con `admin@alkaya.ai` (redirect a /admin).
- [ ] Login con `instructor@alkaya.ai` (redirect a /instructor).
- [ ] Login con `reviewer@alkaya.ai` (redirect a /reviewer).
- [ ] Login con `moderator@alkaya.ai` (redirect a /moderator).
- [ ] Login con `user@alkaya.ai` (redirect a /app).
- [ ] Acceso denegado a rutas no permitidas.

## Superadmin
- [ ] Dashboard muestra m�(c)tricas y logs.
- [ ] Cambiar rol y activar/desactivar usuarios.
- [ ] Branding guarda cambios.
- [ ] Mantenimiento togglea y muestra banner.
- [ ] Integraciones muestran estado y guardan notas.

## Admin
- [ ] Listado de cursos y cambio de estado.
- [ ] Listado de usuarios.
- [ ] Reportes de pagos y enrollments.
- [ ] CRUD b�sico de cupones.

## Instructor
- [ ] Crear curso, editar, subir thumbnail.
- [ ] Crear módulos y lecciones.
- [ ] Subir recursos.
- [ ] Enviar curso a revisión.

## Reviewer
- [ ] Ver pendientes.
- [ ] Aprobar / rechazar con comentario.
- [ ] Ver historial.

## Moderator
- [ ] Ver reportes.
- [ ] Resolver con acciones.

## Alumno
- [ ] Cat�logo visible.
- [ ] Agregar a carrito y checkout.
- [ ] Pago aprobado genera enrollment.
- [ ] Ver “Mis cursos”.
- [ ] Marcar lecciones como completadas.
- [ ] Certificado disponible al 100%.

## Integraciones (si configuradas)
- [ ] Mercado Pago crea preferencia y webhook actualiza pago.
- [ ] Resend envía email de bienvenida y compra.
- [ ] Cloudinary sube archivos.
- [ ] Mux crea live sessions.
- [ ] AI responde en `/api/ai/quiz`.

