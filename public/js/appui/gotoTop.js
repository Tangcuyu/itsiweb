 $(window).scroll(function(){
        var sc=$(window).scrollTop();
        var rwidth=$(window).width()+$(document).scrollLeft();
        var rheight=$(window).height()+$(document).scrollTop();
        if(sc>0){
            $("#goTop").css("display","block");
            $("#goTop").css("left",(rwidth-80)+"px");
            $("#goTop").css("top",(rheight-120)+"px");
        }else{
            $("#goTop").css("display","none");
        }
    });
    
$("#goTop").click(function(){
        $('body,html').animate({scrollTop:0},300);
    });
