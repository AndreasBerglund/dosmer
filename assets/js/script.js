(function($) {
    console.log('dosmer');
    $(document).ready(function() {

        function updateItem(item, newitem=0) {

            let textBox = item.find('input[name=name]')
            let amountBox = item.find('select')
            let checkBox = item.find('input[type=checkbox]')
          
            let id = item.attr('data-id')
            let name = textBox.val()
            let state = checkBox.prop('checked')
            let amount = amountBox.val()
          
            let imp = item.attr('data-imp')
            let list = item.attr('data-list')

            let url = (newitem == 0 ? "/updateitem" : "/newitem")
  
            //update via ajax
            $.ajax({
                url: url,
                type: "POST",  
                async: true,
                headers: {
                    "cache-control": "no-cache"
                },
                data: JSON.stringify({
                    "id" : id,
                    "name" : name,
                    "state" : state,
                    "amount" : amount,
                    "imp" : imp,
                    "list" : list

                }),
                dataType : "json",
                contentType: "application/json",
                success: function(response, status, http) {
                    if (response) {
                            console.log('AJAX worked!')
                    }
                }
            });
        }

        $('.item').click(function(e) {
            
            let item = $(this)
            item.toggleClass('on')

            let checkBox = item.find('input[type=checkbox]')   
            checkBox.prop("checked", !checkBox.prop("checked"))

            live_sort(item)
            
            updateItem(item)

        });

        $('.item').find('input, select').click(function(e){
            
            e.stopPropagation();
            
            if(e.target.type == 'checkbox') {
                $(this).parent('.item').toggleClass('on')
            }
            
        })

        $('.item').find('input, select').on('change', function(e){
      
            updateItem($(e.target).parent('.item'))
        
        })

        $('button.newitem').click(function(){
            let newitem = $('.item').last().clone(true, true)
            updateItem(newitem, 1)
            newitem.appendTo('.itemlist')
            newitem.find('input[type=text').val('')
            newitem.find('input[type=text]').focus()
        })


        function live_sort(item) {
          
            let state = item.find('input[name=state]').prop('checked')
            let $siblings = item.siblings()

            if ( !state ) {
                //move down
                $siblings.each(function(){
                    if ( !$(this).find('input[name=state]').prop('checked') ) {
                        item.insertBefore( $(this) )
                        return false
                    }
                })
            } else {
                //move up
                $( $siblings.get().reverse() ).each(function() {
                    if ( $(this).find('input[name=state]').prop('checked') ) {
                        item.insertAfter( $(this) )
                        return false
                    }
                })
            }
 
        }

        //scroll
        let lastScrollTop = 0, delta = 5, $menu = $('.menu-container');
        $(window).scroll(function(event){
           let st = $(this).scrollTop();
           
           if(Math.abs(lastScrollTop - st) <= delta)
              return;
           
           if (st > lastScrollTop){
               // downscroll code
               $menu.removeClass('show')
           } else {
              // upscroll code
              $menu.addClass('show')
           }
           lastScrollTop = st;
        });


    });

})(jQuery);
