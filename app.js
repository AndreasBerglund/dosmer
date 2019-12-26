const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => res.send('Small beginnings'))

app.listen(port, () => console.log(`Dosmer app listening on port ${port}!`))