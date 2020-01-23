//db
const { Pool } = require('pg')
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:1qa@localhost:5432/postgres',
  ssl: true
});

const initlist = require('./initlist.json')

exports.log = async function log(res) {
    try {
        const client = await pool.connect()
        const result = await client.query('SELECT * FROM lists')
        const results = { 'results': (result) ? result.rows : null}
        res.send( results )
        client.release()
      } catch (err) {
        console.error(err)
        res.send("Error " + err)
    }
}

exports.insertlist = async function insertlist(name, identifier) {

    try {
        const client = await pool.connect()
        let q = "INSERT INTO lists(name, identifier) VALUES ('" + name + "','" + identifier + "')"
        const result = await client.query(q)         
        client.release() 

        initlist.items.forEach(element => {
            this.insertitem(element.name, element.state, element.imp, identifier, element.category)
        });


    } catch (err) {
        console.error(err)
    }

}

exports.insertitem = async function insertitem(name, state, imp, list, category) {

    try {
        const client = await pool.connect()
        let q = "INSERT INTO items(name, state, imp, list, category) VALUES ('" + name + "'," + state + ",  '" + imp + ", '" + list +  ", '" + category + "') RETURNING id;"   
        const result = await client.query(q) 
        //console.log(result.rows[0].id)
        client.release() 
        return result.rows[0].id

    } catch (err) {
        console.error(err)
    }

}

exports.updateitem = async function updateitem(name, state, imp, list, id, category) {

    imp++

    try {
        const client = await pool.connect()
        let q = "UPDATE items SET name = '" + name + "', state = " + state + ", imp = " + imp + ", category ='" + category + "' WHERE id = " + id 
        const result = await client.query(q) 
        client.release() 
        return result.rows

    } catch (err) {
        console.error(err)
    }

}

exports.getitems = async function getitems(list) {

    try {
        const client = await pool.connect()
        let q = "SELECT * FROM items WHERE list = '" + list + "'"
        
        const result = await client.query(q) 
        const results = (result) ? result.rows : null
       
        client.release() 
        return results;     
        
    } catch (err) {
        console.error(err)
    }

}

exports.checklist = async function(list) {
    try {
        const client = await pool.connect()
        let q = "SELECT EXISTS(SELECT 1 FROM lists WHERE identifier = '" + list + "')"
        
        const result = await client.query(q) 
 
        client.release() 
        return result.rows


    } catch (err) {
        console.error(err)
    }
}