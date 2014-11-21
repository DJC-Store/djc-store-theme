define(['modules/jquery-mozu'],
	function ($) {
		$(document).ready(function(){
			$('#dj-product-tabs').easyResponsiveTabs({
				type: 'default', //Types: default, vertical, accordion           
				width: '100%', //auto or any custom width
				fit: true   // 100% fits in a container
			});
		});
	});
