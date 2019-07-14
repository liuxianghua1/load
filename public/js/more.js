$(function() {

	$('.navbar li').hover(function() {
		$(this).find('.subnav').stop().slideDown();
	}, function() {
		$(this).find(".subnav").stop().slideUp();
	})
	jQuery(".focusBox").hover(function() {
		jQuery(this).find(".prev,.next").stop(true, true).fadeTo("show", 0.8)
	}, function() {
		jQuery(this).find(".prev,.next").fadeOut()
	});
//	jQuery(".focusBox").slide({
//		mainCell: ".pic",
//		effect: "fold",
//		autoPlay: true,
//		delayTime: 600,
//		trigger: "click"
//	});
	
	
	
//	jQuery(".daigong").slide({ titCell:".list li", mainCell:".piclist", effect:"leftLoop",vis:4,scroll:1,delayTime:800,trigger:"click",
	easing:"easeOutCirc"});

	//input		
	$('input[type=text]').bind({
		focus: function() {
			if(this.value == this.defaultValue) {
				this.value = "";
			}
		},
		blur: function() {
			if(this.value == "") {
				this.value = this.defaultValue;
			}
		}
	});

//});




