(function($) {
    let r = confirm('Vil du tilmelde dig denne dosmerseddel?')
    if ( r ) {
        window.location.search +="&force=true"
    } else {
        window.location.href = '/'
    }
})(jQuery);