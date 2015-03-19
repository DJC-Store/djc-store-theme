define([ "modules/jquery-mozu" ],
    function ($) {
        $(document).ready(function(){
            setTimeout(function(){
                // force uncheck to fix glitch
                $("input:radio").attr("checked", false);
                console.log("force deselect radio boxes");
            }, 2000);
        });
    });