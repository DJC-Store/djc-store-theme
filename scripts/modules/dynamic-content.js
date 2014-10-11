define(['modules/jquery-mozu'],
	function ($) {
		$(document).ready(function(){
			$('.best-sellers').slick({
				accessibility: true,
				arrows: false,
				slidesToShow: 4,
				swipe: true,
				touchMove: true,
				autoplay: true,
				dots: true
			});
			$('.recently-viewed').slick({
				accessibility: true,
				arrows: false,
				slidesToShow: 2,
				swipe: true,
				touchMove: true,
				autoplay: true,
				dots: true
			});
		});
	});
