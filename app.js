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
    let items = null
    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    if ( cookie ) {
      items = await db.getitems(cookie)
      items = helper.sorter(items)
      reply = ''
      res.render('index', { title: 'Dosmer', list: items, urlto: fullUrl  })
    } else {
      res.render('start')
    }

})

app.get('/del', (req,res) => {
  res.clearCookie(ckn)
  res.render('index', { title: 'delete', message: 'deleted cookie' })
})

app.get('/make', (req, res) => { 
    // read cookies
    let force = req.query.force

    if ( !req.cookies[ckn] || force ) {
      
      let identifier = shortid.generate()
      let name = "Min fancy dosmerseddel"

      res.clearCookie(ckn)
      db.insertlist(name, identifier)
      //set cookie
      res.cookie( ckn, identifier, { maxAge : 1000 * 60 * 60 * 24 * 365 * 20 } )

      res.render('make', { title: 'Dosmer', content : 'Laver ny liste...' })

    } else {

      res.render('make', { title: 'Dosmer', content : 'Du har allerede en liste. Vil du lave en ny? ( advarsel, sletter den gamle )', link: true })
  
    }
 
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
  res.status(404).send("Det er desværre ikke på listen!")
})


app.listen(port, () => console.log(`Dosmer app listening on port ${port}!`))