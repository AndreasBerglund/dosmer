const express = require('express')
const app = express()
const port = process.env.PORT || 3001
const cookieParser = require('cookie-parser')
const shortid = require('shortid')
const ckn = 'dosmerlist'
const db = require('./db.js')
const helper = require('./helper.js')
const bodyParser = require('body-parser')

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
    let items = null
    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    if ( cookie ) {
      items = await db.getitems(cookie)
      items = helper.sorter(items)
      reply = ''

    } 
    res.render('index', { title: 'Dosmer', message: reply, list: items, button : 'new list', urlto: fullUrl  })
})



app.get('/del', (req,res) => {
  res.clearCookie(ckn)
  res.render('index', { title: 'delete', message: 'deleted cookie' })
})

app.get('/make/:name', (req, res) => { 
    // read cookies
    if (!req.cookies[ckn]) {
      
      let identifier = shortid.generate()
      let name = req.params.name

      db.insertlist(name, identifier)
      //set cookie
      res.cookie( ckn, identifier, { maxAge : 1000 * 60 * 60 * 24 * 365 * 20 } )
    }

    res.send('Made a list')
});


app.post('/updateitem', (req, res) => {
  let result = db.updateitem(req.body.name, req.body.state, req.body.amount, req.body.imp, req.body.list, req.body.id)
  res.json({ 'id' : result });
})


app.post('/newitem', async (req, res) => {
  //id is ignored
  let result = await db.insertitem(req.body.name, req.body.state, req.body.amount, req.body.imp, req.body.list)
  res.json({ 'id' : result });
})

app.get('/join/:list', async (req, res) => {

  let cookie = req.cookies['dosmerlist']
  let list = req.params.list
  let valid = shortid.isValid(list)

  //if no cookie and url is valid and in db
  if (valid) {

      if (valid != cookie) {
        //if not an existing cookie check db and make new
        let indb =  await db.checklist(list) 
        if ( indb[0].exists ) {
            //set in cookie and in db
            res.cookie( ckn, list, { maxAge : 1000 * 60 * 60 * 24 * 365 * 10 } )
            res.redirect('/')
        } else {
            //not in db
            res.redirect('/404')
        } 
      } else {
        //if valid and cookie already exits
        res.redirect('/')
      }


  } else {
    //not valid list id
    res.redirect('/404')
  }

})

app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
})


app.listen(port, () => console.log(`Dosmer app listening on port ${port}!`))