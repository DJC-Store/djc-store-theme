define(['modules/jquery-mozu'],
	function ($) {
		$(document).ready(function(){
			$('.feature-product-carousel').slick({
				accessibility: true,
				arrows: false,
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
					$(this).siblings().removeClass( "active" );
					$(this).addClass( "active" );
			},	function(){
					// mouseOut event - here to prevent mouseEnter and mouseOut confusion when doing directly from thumb to thumb
			});
		});
	});
