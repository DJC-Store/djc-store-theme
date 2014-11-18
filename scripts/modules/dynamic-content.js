define(['modules/jquery-mozu'],
	function ($) {
		$(document).ready(function(){
			$('.best-sellers').slick({
				accessibility: true,
				arrows: false,
				slidesToShow: 4,
				swipe: true,
				touchMove: true,
				autoplay: false,
				dots: true
			});
			$('.recently-viewed').slick({
				accessibility: true,
				arrows: false,
				slidesToShow: 2,
				swipe: true,
				touchMove: true,
				autoplay: false,
				dots: true
			});
		});
		//$(window).load(function(){
		//	$('.dycon-img').each(function(){
		//		var pxWidth = $(this).attr( 'width' );
		//		var imgWidth = parseInt(pxWidth, 10);
		//		var displace = imgWidth/2;
		//		$(this).css( 'margin-left', -displace );
		//	});
		//});
	});
