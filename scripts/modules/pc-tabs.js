define(['modules/jquery-mozu', 'vendor/easy-responsive-tabs/easyResponsiveTabs'], function ($, easyResponsiveTabs) {
	$(document).ready(function(){
		$('.pc-page-tabs').easyResponsiveTabs({
			type: 'default', //Types: default, vertical, accordion           
			width: '100%', //auto or any custom width
			fit: true   // 100% fits in a container
		});
	});
});
