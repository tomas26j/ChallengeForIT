# ChallengeForIT

Aplicación básica de lista de tareas que demuestra conocimientos fundamentales de Git, JavaScript, Node.js y React.


## Instalación

### Backend

1. Navega al directorio del backend:
```bash
cd backend
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor:
```bash
node index.js
```

El servidor se ejecutará en `http://localhost:3000`

### Frontend

1. En una nueva terminal, navega al directorio del frontend:
```bash
cd frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia la aplicación:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Uso

1. **Ver Tareas**: Al cargar la aplicación, verás la lista de tareas existentes.

2. **Crear Tarea**: 
   - Usa el campo de texto en la parte superior
   - Escribe tu tarea y presiona Enter o el botón "Agregar"

3. **Editar Tarea**:
   - Pasa el mouse sobre una tarea para ver los botones de acción
   - Haz clic en el ícono de lápiz para editar
   - Modifica el texto y guarda los cambios

4. **Eliminar Tarea**:
   - Pasa el mouse sobre una tarea
   - Haz clic en el ícono de papelera
   - Confirma la eliminación

5. **Cambiar Tema**:
   - Usa el botón de sol/luna en la esquina superior derecha
   - Alterna entre modo claro y oscuro

## Tecnologías Utilizadas

- **Frontend**:
  - React
  - TypeScript
  - Tailwind CSS
  - Vite

- **Backend**:
  - Node.js
  - Express
  - JavaScript

## Estructura del Proyecto

```
ChallengeForIT/
├── frontend/          # Aplicación React
│   ├── src/
│   └── package.json
└── backend/           # Servidor Express
    ├── index.js
    └── package.json
```
