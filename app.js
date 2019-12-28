const express = require('express')
const app = express()
const port = process.env.PORT || 3002
const cookieParser = require('cookie-parser')
const shortid = require('shortid');
 
app.use(cookieParser());
app.set('view engine', 'pug')



//db
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:1qa@localhost:5432/postgres',
  ssl: true
});

app.get('/db', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM lists');
      const results = { 'results': (result) ? result.rows : null};
      res.send( results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })


app.get('/', function (req, res) {
    res.render('index', { title: 'Hey', message: 'Hello there!' })
})

app.get('/make', (req, res) => { 
    // read cookies
    console.log(req.cookies) 
    res.cookie('dosmerlist', shortid.generate())
    res.send('Made a list')
});

app.listen(port, () => console.log(`Dosmer app listening on port ${port}!`))