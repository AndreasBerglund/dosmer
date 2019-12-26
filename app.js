const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Small beginnings'))

app.listen(port, () => console.log(`Dosmer app listening on port ${port}!`))