$(function(){

    // Pre- set keys
 var tp_keys = {
    '1': 'Long-term relationship',
    '2': 'Short-term relationship',
    '3': 'Hook up',
    '4': 'One Date',
    '5': 'Sponsor'
  }
 
  var or_keys = {
    '1': 'Straight',
    '2': 'Bi',
    '3': 'Invert'
  }
 
  var ge_keys = {
   '1' : 'Male',
   '2': 'Female',
   '3': 'Both'
  }


    if($('[data-list="user"]').length > 0){
        var page = 1;
        $.get('/0/ads',function(staus,data,g){
            var r = g.responseJSON;
            $('[data-list="user"]').html('');
            function renderr(data){
                data.forEach(e => {
                    $('[data-list="user"]').append(
                        `<div class="col-xs-12 my-ad" data-komment="${e.aid}">
                            <p>${e.desp}</p>
                            <p>
                                <span>${e.location} -> ${ge_keys[e.gender]} -> ${e.age}</span></p><p>
                                <span>${tp_keys[e.tp]} -> ${or_keys[e.or]}</span>
                            </p>
                            <a href="/0/ads/edit?q=${e.aid}">Edit </a><a data-action="delete-ad" href="/0/ads/delete/${e.aid}">Delete </a>
                            <a data-comment="${e.aid}" href="/0/ads/c/${e.aid}"> Replies ${e.c}</a>
                        </div>`
                    )

                    $(`[data-comment="${e.aid}"]`).click(function(event){
                        event.preventDefault();
                        $.get($(this).attr('href'),function(s,m,d){
                            var x = d.responseJSON;
                            console.log(x);
                            $(`[data-komment="${e.aid}"]`).append(`<div class="line"></div>`)
                            x.forEach(function(h){
                                $(`[data-komment="${e.aid}"]`).append(`<p class="comment">${h.comment}</p>`) 
                            })
                        });
                    })
                });
                if(data.length === 10){
                    page = page+1;
                    $('[data-list="user"]').append(`<ul class="pager"><li><a data-get="more" data-page="${page}" href="/0/ads/page/${page}">Load more....</a></li></ul>`)
                    $(`[data-page="${page}"]`).click(function(event){
                        $(this).text('loading.....')
                        $(this).fadeOut(300)
                        event.preventDefault();
                        $.get($(this).attr('href'),function(s,m,d){
                            renderr(d.responseJSON);
                        });
                    });
                }
            }
            renderr(r);
            $('[data-action="delete-ad"]').click(function(event){
                event.preventDefault();
                $.get($(this).attr('href'),function(s,m,d){
    
                });
            })
        });
        
    }

    if($('[data-action="edit"]').length > 0){
        var q = window.location.search.replace('?q=','');
        $.get(`/0/ads/edit/${q}`,function(s,m,d){
            var vals = d.responseJSON[0];
            $('[name="nm"]').val(vals.name);
            $('[name="ag"]').val(vals.age);
            $('[name="lc"]').val(vals.location);
            $('[name="ge"]').val(ge_keys[vals.gender]);
            $('[name="tp"]').val(tp_keys[vals.tp]);
            $('[name="or"]').val(or_keys[vals.or]);
            $('[name="dp"]').val(vals.desp);
        })

        $('[data-action="adedit"]').click(function(event){
            event.preventDefault();
            var val = $(this).data('val');
            var bo = {};
            bo.nm = $('[name="nm"]').val();
            bo.ag = $('[name="ag"]').val();
            bo.lc = $('[name="lc"]').val();
            bo.ge = $('[name="ge"]').val();
            bo.tp = $('[name="tp"]').val();
            bo.or = $('[name="or"]').val();
            bo.dp = $('[name="dp"]').val();
    
            $.post(`/0/ads/edit/${val}`,bo,function(s,m,d){
                console.log(d);
            });
        });

    }

    $('[data-action="cr-ad"]').click(function(event){
        event.preventDefault();
        var bo = {};
        bo.nm = $('[name="nm"]').val();
        bo.ag = $('[name="ag"]').val();
        bo.lc = $('[name="lc"]').val();
        bo.ge = $('[name="ge"]').val();
        bo.tp = $('[name="tp"]').val();
        bo.or = $('[name="or"]').val();
        bo.dp = $('[name="dp"]').val();

        $.post('/0/ads/create',bo,function(s,m,d){
            
        });
    });

});