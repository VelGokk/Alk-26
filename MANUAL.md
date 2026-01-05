# Alkaya Technical Manual

## 1. Cambiar tokens de diseño

1. Abre `src/config/tokens.ts` para ver la paleta global (colores base, fondo, CTA).
2. Actualiza los valores hex o rgba y guarda.
3. Reinicia `npm run dev` o reconstruye (`npm run build`) para aplicar las variables CSS nuevas.
4. Si agregas una variable, expórtala en `cssVariables` para usarla en clases y componentes.

## 2. Ajustar textos y traducciones

1. La copia principal vive en `src/config/dictionaries/*.json`; edita la clave correspondiente (`dashboard.*`, `nav.*`, etc.).
2. Para mantener tipado, usa `createTranslator` o `dictionary.dashboard.someKey`.
3. Si agregas un nuevo texto, extiende el mismo key en las versiones `es`, `en`, `pt`.
4. Ejecuta `npm run lint` si hiciste cambios grandes para detectar errores.

## 3. Configurar menús por rol

1. `src/config/navigation.ts` define los items, sus roles y flags.
2. Para agregar o mudar una entrada, ajusta la lista `NAVIGATION_ITEMS`; usa `flag` para condicionarla con feature flags.
3. Asegúrate de que `getNavigationForRole` sigue resolviendo correctamente y que `dictionary.dashboard.[labelKey]` existe.
4. Si cambias roles o secciones, puedes actualizar `src/lib/auth/guards.ts`/`src/lib/auth/activeRole.ts` para reflejar nuevas rutas protegidas.

## 4. Editar páginas públicas

1. En el CMS (`/super-admin/pages`), usa el formulario para crear páginas con slug + idioma; cada sección se almacena en Prisma.
2. Para editar contenido manualmente, toca `src/app/[lang]/(public)/` y los componentes en `src/components/public/PageSections.tsx`.
3. La data base se mantiene en `prisma/seed.mjs`; si agregas secciones nuevas, actualiza el seed para mantener consistencia en ambientes frescos.
4. Reúne traducciones en los diccionarios y usa las rutas de `src/config/paths.ts`.

## 5. Correr tests y validaciones

1. `npm run lint` para reglas de código.
2. `npm run typecheck` valida tipos TypeScript.
3. `npm run check-env` antes de build para asegurar variables críticas.
4. `npm run qa:smoke` (PowerShell) corre pruebas básicas en staging/local.
5. `npm run build` ejecuta `check-env` automáticamente y genera la versión lista para producción.

Guarda esta guía junto al repo para referencia rápida al hacer cambios editoriales o de configuración.
