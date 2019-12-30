const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const cookieParser = require('cookie-parser')
const shortid = require('shortid')
const ckn = 'dosmerlist'
const db = require('./db.js')
const bodyParser = require('body-parser');

app.use(cookieParser())
app.set('view engine', 'pug')

app.use(express.static('assets'))
app.use(bodyParser.json())


app.get('/db', async (req, res) => {
    db.log(res)
})

app.get('/', async (req, res) => {
    let cookie = req.cookies[ckn]
    let reply = 'make a new list or join a list'
    let items = [] 
    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    if ( cookie ) {
      items = await db.getitems(cookie)
      reply = 'hello here is your list: '
      error.log(items)
    } 
    res.render('index', { title: 'Hey', message: reply, list: items, button : 'new list', urlto: fullUrl  })
})

app.get('/del', (req,res) => {
  res.clearCookie(ckn)
  res.render('index', { title: 'delete', message: 'deleted cookie' })
})

app.get('/make', (req, res) => { 
    // read cookies
    if (!req.cookies[ckn]) {
      
      let identifier = shortid.generate()
      let name = 'a generic list name'
    
      db.insertlist(name, identifier)
      //set cookie
      res.cookie( ckn, identifier )
    }

    res.send('Made a list')
});


app.post('/updateitem', (req, res) => {
  db.updateitem(req.body.name, req.body.state, req.body.amount, req.body.imp, req.body.list, req.body.id)
})


app.post('/newitem', (req, res) => {
  //id is ignored
  db.insertitem(req.body.name, req.body.state, req.body.amount, req.body.imp, req.body.list)
})

app.get('/*', async (req, res) => {
  let cookie = req.cookies['dosmerlist']
  let url = req.url.slice(1)
  let valid = shortid.isValid(url)

  //if no cookie and url is valid and in db
  if (valid && valid != cookie) {
     let indb =  await db.checklist(url) 
     if ( indb[0].exists ) {
        res.cookie( ckn, url )
        res.redirect('/')
     }
  } 

  //res.render('index', { title: 'wildcard', message: 'shortid :'  + url + ' is : '  + valid + ' cookie: '+ cookie })
})


app.listen(port, () => console.log(`Dosmer app listening on port ${port}!`))