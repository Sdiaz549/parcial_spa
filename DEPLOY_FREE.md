# Despliegue gratis de Serenity Spa

Guia pensada para una demo universitaria con servicios gratuitos o trial. Render ofrece web services gratis y PostgreSQL gratis con limites; su documentacion actual indica que los servicios deben escuchar en `0.0.0.0` y usar el puerto `PORT`, y que PostgreSQL Free expira despues de 30 dias. Para MySQL, Railway tiene plan Free con credito limitado y Clever Cloud ofrece plan DEV gratis para pruebas.

Referencias oficiales utiles:

- Render Free: https://render.com/docs/free
- Render Docker: https://render.com/docs/docker
- Render Web Services y `PORT`: https://render.com/docs/web-services
- Render variables: https://render.com/docs/configure-environment-variables
- Railway MySQL: https://docs.railway.com/guides/mysql
- Railway planes: https://docs.railway.com/reference/pricing/plans
- Clever Cloud MySQL: https://www.clever.cloud/developers/doc/addons/mysql/
- Vercel variables: https://vercel.com/docs/environment-variables

## 1. Subir a GitHub

Desde la raiz del proyecto:

```bash
git init
git add .
git commit -m "Initial Serenity Spa microservices app"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/serenity-spa.git
git push -u origin main
```

## 2. Crear PostgreSQL gratis para auth-service

Opcion recomendada para el examen: Render PostgreSQL Free.

1. Entrar a Render.
2. Crear `New > PostgreSQL`.
3. Plan: Free.
4. Nombre sugerido: `serenity-auth-db`.
5. Copiar los datos de conexion:
   - host
   - port
   - database
   - user
   - password

Variables que usara `auth-service`:

```env
AUTH_DB_HOST=host_de_render
AUTH_DB_PORT=5432
AUTH_DB_NAME=database_de_render
AUTH_DB_USER=user_de_render
AUTH_DB_PASSWORD=password_de_render
```

## 3. Desplegar auth-service en Render

1. Crear `New > Web Service`.
2. Conectar el repositorio de GitHub.
3. Seleccionar:
   - Language: Docker
   - Root Directory: `auth-service`
   - Dockerfile Path: `Dockerfile`
   - Instance Type: Free
4. Variables de entorno:

```env
PORT=10000
AUTH_DB_HOST=host_de_render
AUTH_DB_PORT=5432
AUTH_DB_NAME=database_de_render
AUTH_DB_USER=user_de_render
AUTH_DB_PASSWORD=password_de_render
JWT_SECRET=usa-un-secreto-largo-de-minimo-32-caracteres
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,https://tu-frontend.vercel.app,https://*.vercel.app,https://*.netlify.app
```

5. Deploy.
6. Probar:

```bash
curl https://tu-auth-service.onrender.com/actuator/health
```

## 4. Crear MySQL gratis para spa-service

Opciones viables:

- Railway Free o Trial: crear un proyecto y agregar MySQL.
- Clever Cloud DEV: crear add-on MySQL DEV para pruebas.
- AlwaysData o Aiven Trial: crear MySQL y copiar credenciales.

En Railway:

1. Crear proyecto.
2. Agregar MySQL.
3. Copiar variables:
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLDATABASE`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`

Mapearlas asi para Render:

```env
SPA_DB_HOST=MYSQLHOST
SPA_DB_PORT=MYSQLPORT
SPA_DB_NAME=MYSQLDATABASE
SPA_DB_USER=MYSQLUSER
SPA_DB_PASSWORD=MYSQLPASSWORD
```

## 5. Desplegar spa-service en Render

1. Crear otro `New > Web Service`.
2. Conectar el mismo repositorio.
3. Seleccionar:
   - Language: Docker
   - Root Directory: `spa-service`
   - Dockerfile Path: `Dockerfile`
   - Instance Type: Free
4. Variables de entorno:

```env
PORT=10000
SPA_DB_HOST=host_mysql
SPA_DB_PORT=3306
SPA_DB_NAME=spa_db_o_nombre_real
SPA_DB_USER=user_mysql
SPA_DB_PASSWORD=password_mysql
JWT_SECRET=el-mismo-secreto-usado-en-auth-service
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,https://tu-frontend.vercel.app,https://*.vercel.app,https://*.netlify.app
```

5. Deploy.
6. Probar:

```bash
curl https://tu-spa-service.onrender.com/actuator/health
curl https://tu-spa-service.onrender.com/services
```

## 6. Desplegar frontend Spring Boot en Render

1. Crear otro `New > Web Service` en Render.
2. Conectar el repositorio de GitHub.
3. Configurar:
   - Language: Docker
   - Root Directory: `frontend`
   - Dockerfile Path: `Dockerfile`
   - Instance Type: Free
4. Variables de entorno:

```env
PORT=10000
API_GATEWAY_URL=https://tu-api-gateway.onrender.com
```

5. Deploy y copiar la URL final, por ejemplo:

```text
https://serenity-spa-frontend.onrender.com
```

6. Volver a Render y actualizar `CORS_ALLOWED_ORIGINS` en `auth-service`, `spa-service` y `api-gateway` agregando la URL exacta del frontend.
7. Redeploy de servicios backend.

## 7. Alternativa frontend temporal

Puedes publicar temporalmente el frontend con Dev Tunnels sobre el puerto 3000.

## 8. Probar URLs publicas

Auth:

```bash
curl -X POST https://tu-auth-service.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@spa.com\",\"password\":\"admin123\"}"
```

Spa:

```bash
curl https://tu-spa-service.onrender.com/services
```

Frontend:

1. Abrir `https://tu-frontend.onrender.com` o la URL del tunnel.
2. Login con `user@spa.com / user123`.
3. Crear una reserva.
4. Login con `admin@spa.com / admin123`.
5. Entrar a Admin Reservas y cambiar el estado.

## 9. Notas importantes para la demo

- Render Free puede dormir los servicios si no reciben trafico. Abrir primero `/actuator/health` de cada backend y esperar a que despierte.
- Usar el mismo `JWT_SECRET` en ambos microservicios.
- Si cambia la URL del frontend, actualizar `CORS_ALLOWED_ORIGINS` y redeploy.
- No subir credenciales reales a GitHub. Configurarlas solo como variables de entorno en Render/Vercel/Netlify.
