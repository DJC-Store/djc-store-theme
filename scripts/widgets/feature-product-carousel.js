define(['modules/jquery-mozu'],
	function ($) {
		$(document).ready(function(){
			$('.feature-product-carousel').slick({
				accessibility: true,
				slidesToShow: 1,
				swipe: true,
				touchMove: true,
				autoplay: false,
				fade: true,
				dots: true,
				dotsClass: 'dj-fpc-carat',
				customPaging: function(slider, i) {
                    return '<img src=\"/resources/images/fpc-carat.png\">';
                }
			});
			
			$('.fpc_thumb').hover(
				function(){
					var slideIndex = $(this).index();
					$('.feature-product-carousel').slickGoTo( parseInt(slideIndex) );
					$(this).addClass( "active" );
			},	function(){
					$(this).removeClass( "active" );
			});
		});
	});
