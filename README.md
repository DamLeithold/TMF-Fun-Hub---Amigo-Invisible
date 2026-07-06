# TMF Fun Hub - Amigo Invisible

Aplicación web para organizar el Amigo Invisible de TMF.

## Incluye

- Login con código secreto.
- Panel administrador en `/admin`.
- Carga de participantes desde el panel.
- Sorteo automático.
- Nadie se asigna a sí mismo.
- Buzón digital de pistas.
- Revelación automática del amigo secreto el 23/07 a las 16:45.
- Exportación de códigos en CSV.
- Diseño con logo y colores TMF.

## Variables de entorno en Vercel

```env
FIREBASE_PROJECT_ID=amigo-invisible-tmf
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
ADMIN_CODE=TMFADMIN2026
NEXT_PUBLIC_APP_NAME=TMF Fun Hub
NEXT_PUBLIC_EVENT_NAME=Amigo Invisible TMF
NEXT_PUBLIC_EVENT_DATE=2026-07-23
NEXT_PUBLIC_EVENT_TIME=16:45
NEXT_PUBLIC_REVEAL_DATETIME=2026-07-23T16:45:00-03:00
NEXT_PUBLIC_GIFT_BUDGET=$20000
```

## Flujo

1. Subir el proyecto a GitHub.
2. Importar en Vercel.
3. Cargar las variables de entorno.
4. Deploy.
5. Entrar a `/admin`.
6. Cargar participantes, uno por línea.
7. Guardar participantes.
8. Realizar sorteo.
9. Exportar códigos o copiarlos desde la tabla.
10. Enviar a cada persona su código.

## Firestore

No hace falta crear colecciones manualmente. El panel administrador crea:

- `participants`
- `clues`


## v2

Incluye home tipo plataforma TMF Fun Hub y módulo activo de Amigo Invisible en `/amigo`.


## v5

Rediseño fuerte de home tipo aplicación, menú lateral, evento protagonista y firma `Powered by Engagement Team`.
