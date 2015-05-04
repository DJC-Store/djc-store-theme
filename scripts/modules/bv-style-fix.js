define(['modules/jquery-mozu'], function ($) {
	$(document).ready(function(){
		
		setTimeout(function(){
			$(".bv-secondary-content-clientresponse").removeClass("bv-content-item").addClass("dj-bv-content-item");
		}, 1000);
	});
});