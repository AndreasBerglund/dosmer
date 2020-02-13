const express = require('express')
const app = express()
const http = require('http').createServer(app)
var io = require('socket.io')(http);
const port = process.env.PORT || 3001
const cookieParser = require('cookie-parser')
const cookieParser_s = require('socket.io-cookie-parser');
io.use(cookieParser_s());
const shortid = require('shortid')
const ckn = 'dosmerlist'
const db = require('./db.js')
const helper = require('./helper.js')
const bodyParser = require('body-parser')
const categories = require('./categories.json')

app.use(cookieParser())
app.set('view engine', 'pug')

app.use(express.static('assets'))
app.use(bodyParser.json())

io.on('connection', function(socket){

  console.log('a user connected');
 
  let list = socket.request.cookies['dosmerlist']
  if ( list ) {
    socket.join ( list )
  }
  
  socket.on('item', function(msg){

    console.log('item changed. id: ' + msg.id + ' to list: ' + list);
    socket.to( list ).emit('item', msg)

  });


});

app.get('/db', async (req, res) => {
    db.log(res)
})

app.get('/', async (req, res) => {
    let cookie = req.cookies[ckn]
    let items = null
    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl + 'join/' + cookie;

    if ( cookie ) {
      items = await db.getitems(cookie)
      items = helper.sorter(items) //categories
      reply = ''
      res.render('index', { title: 'Dosmer', list: items, urlto: fullUrl, cats: categories.categories  })
    } else {
      res.render('start')
    }

})

app.get('/del', (req,res) => {
  res.clearCookie(ckn)
  res.render('index', { title: 'delete', message: 'deleted cookie' })
})

app.get('/make', async (req, res) => { 
    // read cookies
    let force = req.query.force

    if ( !req.cookies[ckn] || force ) {
      
      let identifier = shortid.generate()
      let name = "Min fancy dosmerseddel"

      res.clearCookie(ckn)
      await db.insertlist(name, identifier)

      //set cookie
      res.cookie( ckn, identifier, { maxAge : 1000 * 60 * 60 * 24 * 365 * 20 } )

      //go to index
      res.redirect('/')
 

    } else {

      res.render('make', { title: 'Dosmer', content : 'Du har allerede en liste. Vil du lave en ny? ( advarsel, sletter den gamle )', link: true })
  
    }
 
});


app.post('/updateitem', (req, res) => {
  let result = db.updateitem(req.body.name, req.body.state, req.body.imp, req.body.list, req.body.id, req.body.category)
  res.json({ 'id' : result });
})


app.post('/newitem', async (req, res) => {
  //id is ignored
  let result = await db.insertitem(req.body.name, req.body.state, req.body.imp, req.body.list, req.body.category)
  res.json({ 'id' : result });
})

app.get('/join/:list', async (req, res) => {

  let cookie = req.cookies[ckn]
  let list = req.params.list
  let force = req.query.force
  let valid = shortid.isValid(list)

  //if no cookie and url is valid and in db
  if (cookie && !force) {
    res.render('join', { list: list })
  } else {
    if (valid) {

      if (valid != cookie) {
        //if not an existing cookie check db and make new
        let indb =  await db.checklist(list) 
        
        if ( indb[0].exists ) {
  
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

  }



})

app.use(function (req, res, next) {
  res.status(404).send("Det er desværre ikke på listen!")
})


http.listen(port, () => console.log(`Dosmer app listening on port ${port}!`))