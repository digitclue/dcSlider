jQuery(function(){
	jQuery('.slider-holder').dcSlider();
});

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
			this.holderDownHandler = function(e){
				e.preventDefault();

				var curPos = e.pageX - self.holderOffsetX;
				var sliderPos = parseInt(self.slider.css('left'));

				if (curPos > sliderPos){
					self.setPosition(sliderPos)
				} else {

				}

			}

			this.slider.on('mousedown touchstart', this.startHandler);
			jQuery(document).on('mouseup touchend', this.endHandler);

			this.holder.on('mousedown touchstart', this.holderDownHandler);
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