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

    let found_categories = []
    let sorted_items = [ { "name" : "Ikke til indkøb", "items" : [] } ]
    let non_active = []
    items.forEach(element => {
        if ( element.state ) {
            if ( !found_categories.includes(element.category) ) {
                found_categories.push(element.category)
                let cat_obj = { "name" : element.category, "items": [element] }
                sorted_items.push(cat_obj)
            } else {
                let obj = sorted_items.find( x => x.name === element.category )
                let index = sorted_items.indexOf(obj)
                sorted_items[index].items.push( element )
            }           
        } else {
            sorted_items[0].items.push ( element )
        }
    });

    return sorted_items.reverse()

}