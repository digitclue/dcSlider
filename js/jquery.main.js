jQuery(function(){
	jQuery('.slider-holder').dcSlider();
});

// I just leave it here
jQuery.fn.rightInit = function(options){
	var options = jQuery.extend({
		stopParent:'body'
	}, options);
	
	return this.each(function(){
		var holder = jQuery(this);
		var hiddenParents = jQuery();

		function showHiddenBlock(block){
			if (block.is(options.stopParent)) return;

			if (block.is(':hidden')){
				hiddenParents = hiddenParents.add(block);
				block.show();
			}
			showHiddenBlock(block.parent());
		}
		showHiddenBlock(holder);

		if (typeof options.init === 'function'){
			options.init.call(holder);
		}

		hiddenParents.hide();
	});
}


/*
 * Slider plugin
*/
;(function($){
	function DcSlider(options){
		this.options = $.extend({
			slider:'.slider-point',
			activeClass:'active',
		}, options);
		this.init();
	}
	DcSlider.prototype = {
		init:function(){
			this.findElements();
			this.attachEvents();

			this.makeCallback('onInit', this);
		},
		findElements:function(){
			this.holder = $(this.options.holder);
			this.slider = this.holder.find(this.options.slider);
			this.holderWidth = this.holder.width();
			this.holderOffsetX = this.holder.offset().left;

			// set initial
			this.slider.css({
				left:0
			});
		},
		attachEvents:function(){
			var self = this;
			var quickStep;

			this.startHandler = function(e){
				console.log('start');

				jQuery(document).on('mousemove touchmove', self.moveHandler);
			}
			this.moveHandler = function(e){
				console.log('move');
				e.preventDefault();
				var pos = e.pageX - self.holderOffsetX;

				if (pos < 0){
					pos = 0;
				} else if (pos > self.holderWidth){
					pos = self.holderWidth;
				}

				self.setPosition(pos);
			}
			this.endHandler = function(e){
				console.log('end');

				jQuery(document).off('mousemove touchmove', self.moveHandler);
			}
			this.quickStepHandler = function(e){
				e.preventDefault();

				quickStep = 0.2 * self.holder.width();
				var curPos = e.pageX - self.holderOffsetX;
				var sliderPos = parseInt(self.slider.css('left'));


				if (curPos > sliderPos){
					self.setPosition(sliderPos + quickStep);
					self.quickStepHandler();
				} else {
					self.setPosition(sliderPos - quickStep);
					self.quickStepHandler();
				}
			}

			this.slider.on('mousedown touchstart', this.startHandler);
			jQuery(document).on('mouseup touchend', this.endHandler);

			this.holder.on('mousedown touchstart', this.quickStepHandler);
		},
		setPosition: function(pos){
			this.slider.css({
				left: pos
			});
		},
		makeCallback:function(name){
			if (typeof this.options[name] === 'function'){
				var args = Array.prototype.slice.call(arguments);
				args.shift();
				this.options[name].apply(this, args);
			}
		},
		destroy:function(){

		}
	}
	$.fn.dcSlider = function(options){
		return this.each(function(){
			$(this).data('DcSlider', new DcSlider($.extend({holder:this},options)));
		});
	}
})(jQuery);