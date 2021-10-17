$(function(){
  new Skroll()
  .add("h1.a",{
      animation: "fadeInUp",
      duration: 2000
  })
  .add("img.load-img",{
    animation: "zoomIn",
    delay: 500,
    mobile: true
}).init();

// Pre- set keys
 var tp_keys = {
   '1': 'Long term relationship',
   '2': 'Short term relationship',
   '3': 'Hook up',
   '4': 'One date',
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
 // pre - set keys
  

  setTimeout(function(){
      $('div.preloader').fadeOut(600);
  },3000)

  // Extract age range from local storage if is??
  var vls = JSON.parse(localStorage.getItem('opts')) 
  if(vls === null){
    vls = [ 20, 30 ] 
  }else{
    vls = vls.r
  }
  // Else use the default value

  $( "#slider,#slider2").slider({
    range: true,
    min: 18,
    max: 100,
    values: vls,
    slide: function( event, ui ) {
      $( ".age" ).text(ui.values[ 0 ] + " to " + ui.values[ 1 ] );
    }
  });
  $( ".age" ).text(vls[0]+ " to "+vls[1]);



  //Initialize search

  if($('[data-suggest="random"]').length > 0){
    //initialize search

    // Remmmber user options using Local storage

    if(localStorage.getItem('opts') !== null){
        var opts = JSON.parse(localStorage.getItem('opts'));

        if(opts.tp){
          $('img.tp-img,img.tp-img2').remove();
          if(window.innerWidth > 425){
            $(`[data-suggest="tp"][data-val="${opts.tp}"]`)
            .append('<img src="./images/checked.png" class="img-responsive tp-img" data-check="checked">')
          }else{
            $(`[data-suggest="tp"][data-val="${opts.tp}"]`)
            .append('<img src="./images/checked.png" class="img-responsive tp-img2" data-check="checked">')
          }
        }
        if(opts.ge){
          if(window.innerWidth > 425){
            $('[name="ge"]').removeAttr('checked');
            $(`[name="ge"][data-val="${opts.ge}"]`).attr('checked','checked');
          }else{
            $('[name="gen"]').removeAttr('checked');
            $(`[name="gen"][data-val="${opts.ge}"]`).attr('checked','checked');
          }
          
        }

        if(opts.or){
          if(window.innerWidth > 425){
            $('select.or-select option').removeAttr('selected')
            if(opts.or === 'Straight'){
              $('select.or-select option[data-val="1"]').attr('selected','selected');
            }else if(opts.or === 'Bi'){
              $('select.or-select option[data-val="2"]').attr('selected','selected');
            }else{
              $('select.or-select option[data-val="3"]').attr('selected','selected');
            }
          }else{
            $('select.or-select2 option').removeAttr('selected')
          if(opts.or === 'Straight'){
            $('select.or-select2 option[data-val="1"]').attr('selected','selected');
          }else if(opts.or === 'Bi'){
            $('select.or-select2 option[data-val="2"]').attr('selected','selected');
          }else{
            $('select.or-select2 option[data-val="3"]').attr('selected','selected');
          }
          }
        }

        $.post('http://localhost:3000/find',opts,function(data,status){
          $('div.suggest-banner > div.row').html('');
          data.forEach(function(e){
            $('div.suggest-banner > div.row').append(
              `<div class="col-lg-12 col-xs-12 single-suggest"><p>${e.name}</p><p>${e.desp}</p>
              <p><span>${ge_keys[JSON.stringify(e.gender)]} -></span>${e.age} -> ${e.location}</p>
              <span>${tp_keys[JSON.stringify(e.tp)]}</span><span> -> ${or_keys[JSON.stringify(e.or)]}</span>
              <div class="col-xs-10" style="margin-top: 10px">
                  <input data-comment="${e.aid}" class="form-control" placeholder="Leave a commment or drop your contact">
              </div>
              <div class="col-xs-2">
                  <button data-toggle="comment" data-commentz="${e.aid}" class="btn btn-default">Send</button>
              </div>
              </div>`
            )
            $(`[data-toggle="comment"][data-commentz="${e.aid}"]`).click(function(){
              var val = $(this).data('commentz');
              var b = $(`input[data-comment="${val}"]`).val();
              $.post('http://localhost:3000/co',{'id': val ,'co': b},function(data,status){
                if(data === 'DONE'){
                  $(`input[data-comment="${val}"]`).val('');
                  $(`input[data-comment="${val}"]`).attr('placeholder','Well Done... Sent!!');
                  setTimeout(() => {
                    $(`input[data-comment="${val}"]`).attr('placeholder','Leave a comment or drop your contact')
                  },2000);  
                }
              });
            });
          })
        })

    }else{
      $.ajax({
        url: 'http://localhost:3000/random',
        success: function(data){
          $('div.suggest-banner > div.row').html('');
          data.forEach(function(e){
            $('div.suggest-banner > div.row').append(
              `<div class="col-lg-12 col-xs-12 single-suggest"><p>${e.name}</p><p>${e.desp}</p>
              <p><span>${ge_keys[JSON.stringify(e.gender)]} -></span>${e.age} -> ${e.location}</p>
              <span>${tp_keys[JSON.stringify(e.tp)]}</span><span> -> ${or_keys[JSON.stringify(e.or)]}</span>
              <div class="col-xs-10" style="margin-top: 10px">
                  <input data-comment="${e.aid}" class="form-control" placeholder="Leave a commment or drop contact">
              </div>
              <div class="col-xs-2">
                  <button data-toggle="comment" data-commenty="${e.aid}" class="btn btn-default">Send</button>
              </div>
              </div>`
            )
            $(`[data-toggle="comment"][data-commenty="${e.aid}"]`).click(function(){
              var val = $(this).data('commenty');
              var b = $(`input[data-comment="${val}"]`).val();
              $.post('http://localhost:3000/co',{'id': val ,'co': b},function(data,status){
                if(data === 'DONE'){
                  $(`input[data-comment="${val}"]`).val('');
                  $(`input[data-comment="${val}"]`).attr('placeholder','Well Done... Sent!!');
                  setTimeout(() => {
                    $(`input[data-comment="${val}"]`).attr('placeholder','Leave a comment or drop your contact')
                  },2000);  
                }
              });
            });
          })
        }
      })
    }

    // remmmeber user options using local storage
  }

  $('[data-suggest="tp"]').click(function(){
      if(window.innerWidth > 425){
        $('img.tp-img').remove();
        $(this).append('<img src="./images/checked.png" class="img-responsive tp-img" data-check="checked">')
      }else{
        $('img.tp-img2').remove();
        $(this).append('<img src="./images/checked.png" class="img-responsive tp-img2" data-check="checked">')
      }
  });

  $('[data-action="find"]').click(function(){
      var opts = {};
      
      if(window.innerWidth > 425){
        opts.r = [$( "#slider" ).slider( "values", 0 ),$( "#slider" ).slider( "values", 1 )]
        opts.ge = $('[name="ge"][type="radio"]:checked').data('val');
        opts.or = $('select.or-select').val(); 
        opts.tp = $('img.tp-img').parent().data('val');
      }else{
        opts.r = [$( "#slider2" ).slider( "values", 0 ),$( "#slider2" ).slider( "values", 1 )] 
        opts.ge = $('[name="gen"][type="radio"]:checked').data('val');
        opts.or = $('select.or-select2').val();
        opts.tp = $('img.tp-img2').parent().data('val');
      }

      //Save user prefrences to local storage
      if(localStorage){
        localStorage.setItem('opts',JSON.stringify(opts));  
      }
      //Save user prefrences to local storage

      //send opts to server
      $.post('http://localhost:3000/find',opts,function(data,status){
        $('div.suggest-banner > div.row').html('');
          data.forEach(function(e){
            $('div.suggest-banner > div.row').append(
              `<div class="col-lg-12 col-xs-12 single-suggest"><p>${e.name}</p><p>${e.desp}</p>
              <p><span>${ge_keys[JSON.stringify(e.gender)]} -></span>${e.age} -> ${e.location}</p>
              <span>${tp_keys[JSON.stringify(e.tp)]}</span><span> -> ${or_keys[JSON.stringify(e.or)]}</span>
              <div class="col-xs-10" style="margin-top: 10px">
                  <input data-comment="${e.aid}" class="form-control" placeholder="Leave a commment or drop contact">
              </div>
              <div class="col-xs-2">
                  <button data-toggle="comment" data-commentx="${e.aid}" class="btn btn-default">Send</button>
              </div>
              </div>`
            )
            $(`[data-toggle="comment"][data-commentx="${e.aid}"]`).click(function(){
              var val = $(this).data('commentx');
              var b = $(`input[data-comment="${val}"]`).val();
              $.post('http://localhost:3000/co',{'id': val ,'co': b},function(data,status){
                if(data === 'DONE'){
                  $(`input[data-comment="${val}"]`).val('');
                  $(`input[data-comment="${val}"]`).attr('placeholder','Well Done... Sent!!');
                  setTimeout(() => {
                    $(`input[data-comment="${val}"]`).attr('placeholder','Leave a comment or drop your contact')
                  },2000);  
                }
              });
            });
          })
         
      })
  });
})