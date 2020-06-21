const express = require('express')
const app = express()
const expressJSX = require('./express-jsx')

app.engine('jsx', expressJSX)
app.set('views')
app.set('view engine', 'jsx')

app.get('/', (req, res) => {
  res.render('index', { hello: 'Hola', world: 'Mundo2'})
})

const server = app.listen(8000, () => {
  console.log(`Listening http://localhost:${server.address().port}`)
})