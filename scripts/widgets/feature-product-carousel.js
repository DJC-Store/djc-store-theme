define(['modules/jquery-mozu'],
	function ($) {
		$(document).ready(function(){
			$('.feature-product-carousel').slick({
				accessibility: true,
				dots: true,
				slidesToShow: 1
			});
		});
	});
