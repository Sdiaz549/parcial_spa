# Serenity Spa

Serenity Spa es una aplicacion full-stack para un spa profesional. Permite registro, login con JWT, consulta de servicios, reserva de citas y paneles separados para usuarios y administradores.

## Arquitectura

```text
serenity-spa/
├── auth-service/      # Spring Boot 3 + PostgreSQL + JWT
├── spa-service/       # Spring Boot 3 + MySQL + JWT
├── api-gateway/       # Spring Cloud Gateway
├── frontend/          # React + Vite
├── docker-compose.yml
├── README.md
├── DEPLOY_FREE.md
└── .gitignore
```

## Tecnologias

- Java 21, Spring Boot 3, Maven
- Spring Security, BCrypt, JWT
- PostgreSQL para autenticacion
- MySQL para servicios y reservas
- React, Vite, React Router, Lucide Icons
- Docker y Docker Compose
- Render Free para backends
- Vercel o Netlify Free para frontend

## Puertos

| Servicio | Puerto |
| --- | --- |
| PostgreSQL auth | 5432 |
| MySQL spa | 3306 |
| auth-service | 8081 |
| spa-service | 8082 |
| api-gateway | 8080 |
| frontend | 3000 |

## Usuarios de prueba

| Rol | Email | Password |
| --- | --- | --- |
| ADMIN | admin@spa.com | admin123 |
| USER | user@spa.com | user123 |

Estos usuarios se crean automaticamente al iniciar `auth-service`.

## Ejecucion local con Docker

Desde la raiz:

```bash
docker compose up --build
```

Abrir:

- Frontend: http://localhost:3000
- API Gateway: http://localhost:8080
- Auth API: http://localhost:8080/auth
- Spa API: http://localhost:8080/services

## Ejecucion local por servicio

Auth service:

```bash
cd auth-service
mvn clean package
mvn spring-boot:run
```

Spa service:

```bash
cd spa-service
mvn clean package
mvn spring-boot:run
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Variables de entorno

Auth service:

```env
AUTH_DB_HOST=localhost
AUTH_DB_PORT=5432
AUTH_DB_NAME=auth_db
AUTH_DB_USER=auth_user
AUTH_DB_PASSWORD=auth_password
JWT_SECRET=serenity-spa-super-secret-key-change-me-2026
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

Spa service:

```env
SPA_DB_HOST=localhost
SPA_DB_PORT=3306
SPA_DB_NAME=spa_db
SPA_DB_USER=spa_user
SPA_DB_PASSWORD=spa_password
JWT_SECRET=serenity-spa-super-secret-key-change-me-2026
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

Frontend:

```env
VITE_AUTH_API_URL=http://localhost:8080
VITE_SPA_API_URL=http://localhost:8080
```

## Endpoints

Auth:

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

Servicios:

- `GET /services`
- `GET /services/{id}`
- `POST /services` ADMIN
- `PUT /services/{id}` ADMIN
- `DELETE /services/{id}` ADMIN

Reservas:

- `GET /appointments` ADMIN
- `GET /appointments/my` USER o ADMIN
- `POST /appointments` USER o ADMIN
- `PUT /appointments/{id}/status` ADMIN
- `DELETE /appointments/{id}` propietario o ADMIN

## Checklist demo profesor

1. Abrir frontend desplegado.
2. Registrar un USER.
3. Login USER.
4. Ver servicios.
5. Reservar cita.
6. Ver mis reservas.
7. Logout.
8. Login ADMIN con `admin@spa.com / admin123`.
9. Crear servicio.
10. Editar servicio.
11. Eliminar servicio.
12. Ver reservas.
13. Cambiar estado de reserva.
14. Mostrar URLs publicas.
15. Mostrar repositorio GitHub.
16. Mostrar Dockerfiles.
17. Mostrar `docker-compose.yml`.

## Despliegue

La guia completa esta en [DEPLOY_FREE.md](DEPLOY_FREE.md).
