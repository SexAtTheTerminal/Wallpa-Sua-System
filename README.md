# Wallpa Sua System

<p align="center">
  <img src="https://raw.githubusercontent.com/SexAtTheTerminal/mis-imagenes/refs/heads/main/logo_corregido.svg" alt="Logo de Wallpa Sua System" width="600"/>
</p>

Sistema integral de gestión restaurantera con vistas por rol (admin, cajero, cocinero). Maneja pedidos por mesa, pagos, comprobantes electrónicos y usuarios.

---

## Arquitectura

```
┌─────────────────────┐       ┌──────────────────────┐         ┌─────────────┐
│   Angular 19        │─────▶│   NestJS 11 API      │───────▶│  PostgreSQL │
│   localhost:4200    │  HTTP │   localhost:3000/api │ TypeORM │   :5432     │
│   TailwindCSS       │  JWT  │   Passport Auth      │         │   walpa_db  │
│   Signals (RxJS)    │       │   bcrypt + JWT       │         │             │
└─────────────────────┘       └──────────────────────┘         └─────────────┘
```

**Frontend (Angular 19)**: Standalone components, Signals para estado reactivo, TailwindCSS 4, role-based routing con guards.

**Backend (NestJS 11)**: TypeORM entities, JWT auth con bcrypt, class-validator, passport-jwt. Endpoints con prefijo `/api`. Protección JWT en todas las rutas excepto login.

**Base de datos (PostgreSQL 15)**: 8 tablas, 4 enums personalizados. Migraciones SQL + seeds.

---

## Roles y Credenciales

| Rol | Email | Password |
|---|---|---|
| Administrador | admin@wallpasua.com | admin123 |
| Cajero | caja@wallpasua.com | caja123 |
| Cocinero | cocina@wallpasua.com | cocina123 |
| Mozo | mozo@wallpasua.com | mozo123 |

---

## Base de Datos — Tablas y Relaciones

```
roles ──┬── usuarios ──┬── pedidos ──┬── pagos ──┬── comprobantes
        │              │             │
        │              └── detalles_pedido
        │                      │
        │                      └── items
        │
        └── pagos (cajero_id)
```

### Tablas

- **roles** — Admin, cashier, cooker, waiter (tipo_rol enum)
- **usuarios** — UUID PK, bcrypt hashed passwords, FK a roles
- **items** — Menú del restaurante (precio, categoría, disponible)
- **pedidos** — FK a usuarios (quien toma el pedido), nro_mesa, estado_pedido enum (pendiente → en_cocina → listo → entregado → pagado)
- **detalles_pedido** — Junction entre pedidos e items, con cantidad, precio_unitario y notas
- **pagos** — FK a pedido (1:1), FK a cajero (usuario), metodo_pago enum (efectivo, tarjeta, yape, plin)
- **comprobantes** — FK a pago, tipo_comprobante enum (boleta, factura), datos SUNAT (serie, numero, RUC/DNI, IGV)

---

## API Endpoints

Todas las rutas protegidas con JWT excepto `POST /api/auth/login`.

### Auth
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Login, retorna JWT + user |
| GET | `/api/auth/profile` | Perfil del usuario autenticado |

### Usuarios
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/usuarios` | Lista todos con rol |
| GET | `/api/usuarios/roles` | Lista roles disponibles |
| GET | `/api/usuarios/:id` | Usuario por UUID |
| POST | `/api/usuarios` | Crear (bcrypt hash, validación email único) |
| PUT | `/api/usuarios/:id` | Actualizar |
| DELETE | `/api/usuarios/:id` | Eliminar |

### Productos (Items)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/productos` | Lista solo disponibles |
| GET | `/api/productos/categorias` | Categorías únicas |
| GET | `/api/productos/categoria/:nombre` | Filtro por categoría |
| POST | `/api/productos` | Crear |
| PUT | `/api/productos/:id` | Actualizar |
| DELETE | `/api/productos/:id` | Eliminar |

### Pedidos
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/pedidos` | Todos los pedidos con relaciones |
| GET | `/api/pedidos/pendientes` | Solo pendientes |
| GET | `/api/pedidos/mesas` | Mesas con estado de ocupación |
| GET | `/api/pedidos/mesas/disponibles` | Mesas libres |
| GET | `/api/pedidos/modalidades` | "Para llevar" / "En mesa" |
| GET | `/api/pedidos/mesa/:id` | Pedidos de una mesa |
| POST | `/api/pedidos` | Crear (calcula total en backend) |
| PUT | `/api/pedidos/:id` | Actualizar |
| PUT | `/api/pedidos/:id/estado` | Avanza estado (pendiente→en_cocina→listo→entregado→pagado) |
| PUT | `/api/pedidos/:id/pagado` | Forzar a pagado |
| PUT | `/api/pedidos/mesa/:id/estado` | Marcar todos los pedidos de una mesa como pagados |
| DELETE | `/api/pedidos/:id` | Eliminar |

### Pagos
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/pagos` | Todos los pagos |
| GET | `/api/pagos/metodos` | Métodos de pago disponibles |
| GET | `/api/pagos/verificar-cliente/:dni` | Busca cliente en comprobantes previos |
| POST | `/api/pagos` | Crear (valida monto, actualiza pedido a pagado) |
| DELETE | `/api/pagos/:id` | Eliminar (bloquea si tiene comprobantes) |

---

## Frontend — Rutas y Vistas

### Públicas
| Ruta | Componente | Descripción |
|---|---|---|
| `/auth/log-in` | AuthLogInComponent | Login con redirección por rol |
| `/auth/sign-up` | AuthSignUpComponent | Registro de usuarios |

### Admin (`roleGuard(['admin'])`)
| Ruta | Componente | Descripción |
|---|---|---|
| `/admin` | ViewAdminComponent | Dashboard con cards de acceso |
| `/admin/receipts` | ReceiptsComponent | Visualizar comprobantes |
| `/admin/record` | RecordComponent | CRUD de usuarios |
| `/admin/details` | DetailsComponent | Detalle de comprobante |

### Cajero (`roleGuard(['cashier'])`)
| Ruta | Componente | Descripción |
|---|---|---|
| `/cashier` | ViewCashierComponent | Dashboard |
| `/cashier/pedidos/consultar-pedidos` | ConsultarPedidosComponent | Consulta de pedidos |
| `/cashier/pedidos/registrar-pedidos` | RegistrarPedidosComponent | Crear pedidos |
| `/cashier/pagos/registrar-cobro` | RegistrarCobroComponent | Registrar cobro con búsqueda DNI |

### Cocinero (`roleGuard(['cooker'])`)
| Ruta | Componente | Descripción |
|---|---|---|
| `/cooker` | ViewCookerComponent | Dashboard |
| `/cooker/pedidos/consultar-pedidos` | ConsultarPedidosComponent | Consulta de pedidos |
| `/cooker/pedidos/update-pedidos` | UpdatePedidosComponent | Actualizar estado de pedido |

---

## Despliegue (Docker)

```bash
# Iniciar todos los servicios
docker-compose up -d

# Forzar reinicio completo (borra datos existentes)
docker-compose down -v
docker-compose up -d
```

### Servicios

| Servicio | Puerto | Imagen | Comando |
|---|---|---|---|
| db | 5432 | postgres:15-alpine | init desde database/init.sql |
| backend | 3000 | node:20-alpine | `npm install && npm run start:dev` |
| frontend | 4200 | node:20-alpine | `npm install && npm run start -- --host 0.0.0.0` |

### Variables de Entorno (docker-compose.yml)

| Variable | Descripción | Default |
|---|---|---|
| DB_HOST | Host de PostgreSQL | db |
| DB_PORT | Puerto | 5432 |
| DB_USERNAME | Usuario DB | root |
| DB_PASSWORD | Contraseña DB | rootpassword |
| DB_NAME | Base de datos | walpa_db |
| JWT_SECRET | Secreto JWT | — |
| JWT_EXPIRATION | Expiración JWT | 24h |
| PORT | Puerto API | 3000 |

---

## Desarrollo Local (sin Docker)

```bash
# 1. Iniciar PostgreSQL
# 2. Ejecutar migraciones
psql -U root -d walpa_db -f database/init.sql

# 3. Backend
cd backend
npm install
npm run start:dev

# 4. Frontend
cd frontend
npm install
npm run start
```

---

## Notas Técnicas

- **Auth**: JWT almacenado en localStorage bajo `access_token`. Señales reactivas `currentUser` y `currentRole` en AuthService.
- **Password hashing**: bcrypt con 10 rounds. Backend usa `bcrypt` nativo (C++), compatible con hashes `$2a$` y `$2b$`.
- **Role guarding**: Los guards comparan contra `authService.currentRole()`, que se setea desde el payload JWT al hacer login (valor del enum DB: `admin`, `cashier`, `cooker`, `waiter`).
- **CORS**: Habilitado globalmente en `main.ts` con `app.enableCors()`.
- **Validación**: class-validator con `whitelist: true` + `forbidNonWhitelisted: true` — cualquier campo extra en el body es rechazado.
- **Migraciones pendientes**: Los servicios `ConsultarPedidosService`, `RegistrarPedidosService`, `RegistrarCobroService`, `ReceiptsService`, `UpdatePedidosService` tienen stubs que retornan datos vacíos — esperan migración a la REST API del backend.
