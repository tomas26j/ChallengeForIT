const express = require('express')
const app = express()
const port = 3005

// Configuración CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Middleware para procesar JSON
app.use(express.json())

const tareas = [[1, "tarea1"], [2, "tarea2"], [3, "tarea3"]];

app.get('/', (req, res) => {
  try {
  res.send('Hello World!');
  } catch (error) {
    console.error('Error en la ruta principal:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
})

//Obtener todas las tareas R
app.get('/api/tasks', (req, res) => {
  try {
    res.json(tareas);
  } catch (error) {
    console.error('Error al obtener las tareas:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
})

//Crear una nueva tarea R
app.post('/api/tasks', (req, res) => {
    try {
    const newTask = req.body.task;
        tareas.push([tareas.length + 1, newTask]);
    res.status(201).json({ message: 'Tarea creada exitosamente', task: newTask });
    console.log({tareas});
    } catch (error) {
        console.error('Error al crear la tarea:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
})

//Actualizar una tarea existente R
app.put('/api/tasks/:id', (req, res) => {
    try {
        const newTask = req.body.task;
        for (let i = 0; i < tareas.length; i++) {
            if (tareas[i][0] === parseInt(req.params.id)) {
                tareas[i][1] = newTask;
                console.log({tareas})
                return res.status(200).json({ message: 'Tarea actualizada exitosamente', task: newTask });
            }
        }
        console.log({tareas})
        return res.status(404).json({ message: 'Tarea no encontrada' });
    } catch (error) {
        console.error('Error al actualizar la tarea:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
})

//Eliminar una tarea
app.delete('/api/tasks/:id', (req, res) => {
    try {
        const taskId = parseInt(req.params.id);
        const taskIndex = tareas.findIndex(task => task[0] === taskId);
        
        if (taskIndex === -1) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        tareas.splice(taskIndex, 1);
        return res.status(200).json({ message: 'Tarea eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar la tarea:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})