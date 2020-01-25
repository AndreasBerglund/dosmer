(function($) {
    let r = confirm('Vil du tilmelde dig denne dosmerseddel?')
    if ( r ) {
        window.location.href = window.location.href + '?force=true'
    } else {
        window.location.href = '/'
    }
})(jQuery);