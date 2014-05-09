// JavaScript Document
$(function() {
    $('#navigation a').bind('click',function(event){
        var $anchor = $(this);
 
        // $('html, body').stop().animate({
        //     scrollTop: $($anchor.attr('href')).offset().top
        // }, 1500,'easeInOutExpo');
        /*
        if you don't want to use the easing effects:
       
        */
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top-100
        }, 1000);
        event.preventDefault();
    });
});