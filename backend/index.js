const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

//Obtener todas las tareas
app.get('/api/tasks', (req, res) =>{
    res.send("Obtener todas las tareas")
})

//Crear una nueva tarea
app.post('/api/tasks', (req, res) =>{
    res.send("Crear una nueva tarea")
})

//Actualizar una tarea existente
app.put('/api/tasks/:id', (req, res) =>{
    res.send("IMPRIMIR TODAS LAS TAREAS")
})

//Eliminar una tarea
app.delete('/api/tasks/:id', (req, res) =>{
    res.send("IMPRIMIR TODAS LAS TAREAS")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})