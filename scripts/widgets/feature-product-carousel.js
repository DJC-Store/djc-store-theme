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
				waitForAnimate: false,
				fade: false,
				dots: true,
				dotsClass: 'dj-fpc-carat',
				customPaging: function(slider, i) {
					return '<img src=\"/resources/images/fpc-carat.png\">';
				},
				responsive: [
					{
						breakpoint: 786,
						settings: {
							arrows: true,
							dotsClass: 'slick-dots',
							customPaging: function(slider, i) {
								return '<button type="button" data-role="none">' + (i + 1) + '</button>';
							},
							autoplay: true
						}
					}
				]
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
