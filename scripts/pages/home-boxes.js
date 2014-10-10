define(['modules/jquery-mozu'],
	function ($) {
		$(document).ready(function(){
			var xHeight = $(".topic-search").css( "height" );
			$(".feature-box").css( "height", xHeight );
		});
	});
