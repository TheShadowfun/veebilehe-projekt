/* nupu JS kood on võetud lehelt: https://codepen.io/alexandrevale/pen/ZMxQJp/ */

$(".cta").click(function(){
    $(this).addClass("active").delay(300).queue(function
   (next){
       $(this).removeClass("active");
       next();
     });
   });