exports.sorter = function(items) {

    sorted_list = []
    items.forEach(element => {
        if  ( element.state ) {
            element.sorted = element.imp + 10000000
        } else  {
            element.sorted = element.imp
        }

        sorted_list.push(element)
    });
    sorted_list.sort((a, b) => (a.sorted < b.sorted) ? 1 : -1)

    return sorted_list
}