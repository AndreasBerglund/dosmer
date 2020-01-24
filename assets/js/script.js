(function($) {
    console.log('dosmer');
    $(document).ready(function() {

        function updateItem(item, newitem=0, toggle=false) {

            let textBox = item.find('input[name=name]')
            let categoryBox = item.find('select')
            let checkBox = item.find('input[type=checkbox]')
          
            let id = item.attr('data-id')
            let name = textBox.val()
            let state = checkBox.prop('checked')
            let category = categoryBox.val()
          
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
                    "category" : category,
                    "imp" : imp,
                    "list" : list
                }),
                dataType : "json",
                contentType: "application/json",
                success: function(data) {
            
                    if (toggle) {
                        
                        item.toggleClass('on')
                        item.removeClass('active')
                        live_sort(item) 

                    }

                    //console.log(data)
                    if (newitem == 1) {
                        item.attr('data-id', data.id )
                    } 
                    
                },
                error: function(xhr, status, error) {
                    var err = eval("(" + xhr.responseText + ")");
                    alert(err);
                  },
                complete : function() {
                    console.log('call complete')
                }
            });
        }

        function bind_listeners() {


            $('.item').click(function(e) {
            
                let item = $(this)
                item.toggleClass('active')
    
                let checkBox = item.find('input[type=checkbox]')   
                checkBox.prop("checked", !checkBox.prop("checked"))
                
                updateItem(item, 0, true)
    
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

            $('.item').find('select').on('change', function(e){
          
                updateItem($(e.target).parent('.item'),0, true);
            
            })
    
        }

        bind_listeners();

        $('.button.newitem').click(function(){
            let newitem = $('.item').last().clone(true, true)
            updateItem(newitem, 1)
            newitem.appendTo('.itemlist')
            
            newitem.find('input[type=text').val('')
            newitem.find('input[type=text]').focus()
        })


        function live_sort(item) {
          
            let state = item.find('input[name=state]').prop('checked');
            let $group = $('.category-container').last();
           
            if ( state ) {
                $group = $('.category-container[data-cat="' + item.attr('data-cat') + '"]'); 
            }
            let $siblings = $group.find('.item');
    
        
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
                if ( $siblings.length > 0 ) {
                    $( $siblings.get().reverse() ).each(function() {
                        if ( $(this).find('input[name=state]').prop('checked') ) {
                            item.insertAfter( $(this) )
                            return false
                        }
                    })
                } else {
                    item.appendTo($group)
                }
            }
 
        }

        //scroll
        $('.totop').click(function(){
            $('html, body').animate({scrollTop:0},'50');
        });

        //share link
        $('.share').click(function(){
            copyLink()
        });
        function copyLink() {
            /* Get the text field */
            var copyText = document.getElementById("hiddenurl");
          
            /* Select the text field */
            copyText.select();
            copyText.setSelectionRange(0, 99999); /*For mobile devices*/
          
            /* Copy the text inside the text field */
            document.execCommand("copy");
          
            /* Alert the copied text */
            alert("Din liste kan nu sættes ind i en besked: " + copyText.value);
        }

        //search filter
        $('#search').keyup(function() {
            let val = $(this).val().toLowerCase()
            $('.item').each(function() {
                let item = $(this)
              
                if ( item.children('input[name=name]').val().toLowerCase().indexOf(val) > -1 ) {
                    item.show()
                } else {
                    item.hide()
                }
            })
        })

    });

})(jQuery);
