define(['modules/jquery-mozu', 'vendor/video-js/video'], function ($, videojs) {
	$(document).ready(function(){
		
		videojs.options.flash.swf = "/scripts/vendor/video-js/video-js.swf";
		
	});
});