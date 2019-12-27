const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const cookieParser = require('cookie-parser')
const shortid = require('shortid');

 
app.use(cookieParser());


app.get('/make', (req, res) => { 
    // read cookies
    console.log(req.cookies) 
    res.cookie('dosmerlist', shortid.generate())
    res.send('Made a list')
});

app.listen(port, () => console.log(`Dosmer app listening on port ${port}!`))