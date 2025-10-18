
---

```markdown
# Sistema de Gestión de Inventario de Libros – Frontend

Aplicación web desarrollada con **Angular 18** que permite gestionar **autores, libros, usuarios y préstamos** del sistema de biblioteca.  
Se conecta al backend desarrollado en **.NET 8 + Oracle**.

---

##  Tecnologías

- **Angular 18 (Standalone Components + Vite)**
- **TypeScript**
- **SweetAlert2**
- **Bootstrap / CSS personalizado**
- **xlsx** para exportación a Excel
- **JWT Auth con Guards**

---

##  Estructura principal
src/
├── app/
│ ├── auth/ → Login y autenticación JWT
│ ├── autores/ → CRUD de autores
│ ├── libros/ → CRUD y búsqueda de libros + exportar Excel
│ ├── usuarios/ → CRUD de usuarios (solo bibliotecario)
│ ├── prestamos/ → Registro y devolución de préstamos
│ ├── services/ → Servicios compartidos HTTP
│ ├── app.routes.ts → Configuración de rutas y guards
│ └── app.ts → Layout principal y navbar
└── assets/ → Imágenes, íconos y estilos


---

##  Roles y permisos

| Rol | Acceso |
|------|--------|
| **Bibliotecario** | Puede gestionar libros, autores, usuarios y registrar préstamos |
| **Lector** | Solo puede consultar catálogos |

Los permisos se controlan con **`authGuard`** y **`bibliotecarioGuard`**.

---

##  Autenticación

- Login vía `/login`

---

##  Funcionalidades principales

| Módulo | Características |
|---------|----------------|
| **Libros** | Búsqueda por título/autor, CRUD completo, exportar Excel |
| **Autores** | CRUD completo, exportar Excel |
| **Usuarios** | CRUD (solo bibliotecario), validación de roles |
| **Préstamos** | Registro de préstamos y devoluciones, validación de copias y rol lector |
| **Login** | Autenticación JWT con control visual de errores |

---

##  Instalación

```bash
npm install
npm start

Accede en: http://localhost:4200/