exports.sorter = function(items) {

    let sorted_list = []
    items.forEach(element => {
        if  ( element.state ) {
            element.sorted = element.imp + 10000000
        } else  {
            element.sorted = element.imp
        }

        sorted_list.push(element)
    });
    sorted_list.sort((a, b) => (a.sorted < b.sorted) ? 1 : -1)
    sorted_list = sorter_categories( sorted_list )
    return sorted_list
}

function sorter_categories(items) {

    const json = require('./categories.json')
    categories_objects = []
    json.categories.forEach(cat => {
        let obj = {"name" : cat, "items" : []}
        categories_objects.push(obj)
    })
    categories_objects.push( { "name" : "Ikke til indkøb", "items" : [] } )

    items.forEach(element => {
        if ( element.state ) {
         
            let obj = categories_objects.find( x => x.name === element.category )
            let index = categories_objects.indexOf(obj)
            if ( index > -1) {
                categories_objects[index].items.push( element )
            }
                    
        } else {

            categories_objects[categories_objects.length - 1].items.push ( element )
        }
    });

    return categories_objects

}