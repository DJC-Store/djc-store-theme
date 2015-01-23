define(['modules/jquery-mozu'],
	function ($) {
		$(document).ready(function(){
			$('.best-sellers').slick({
				accessibility: true,
				arrows: false,
				slidesToShow: 4,
				autoplay: true,
				dots: true,
				responsive: [
					{
						breakpoint: 940,
						settings: {
							centerMode: true,
							centerPadding: '100px',
							arrows: false,
							swipe: true,
							swipeToSlide: true,
							touchMove: true
						}
					},
					{
						breakpoint: 786,
						settings: {
							centerMode: true,
							centerPadding: '80px',
							arrows: false,
							autoplay: true
						}
					},
					{
						breakpoint: 414,
						settings: {
							centerMode: true,
							slidesToShow: 1,
							arrows: false,
							autoplay: true
						}
					}
				]
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
