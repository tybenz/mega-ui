(function( $, WebPro, window, document, undefined ){
	
	var intervalID = 0;
	
	
	
	WebPro.widget( "Widget.NumericInput", WebPro.Widget, {
		_widgetName: "numeric-input",
		
		defaultOptions: {
			buttonWrapperClassName: "wp-numeric-input-buttons",
			upButtonClassName: "wp-numeric-input-up-button",
			downButtonClassName: "wp-numeric-input-down-button",
			inputClassName: "wp-numeric-input"
		},
		
		_extractData: function() {
			this.$buttons = this.$element.find( "." + this.options.buttonWrapperClassName );
			this.$up = this.$buttons.find( "." + this.options.upButtonClassName );
			this.$down = this.$buttons.find( "." + this.options.downButtonClassName );
			this.$input = this.$element.find( "input." + this.options.inputClassName );
		},

		_attachBehavior: function() {
			var self = this;
			
			var dt = new WebPro.DragTracker( this.$buttons.get( 0 ), {
				dragStart: function( tracker, dx, dy ) {
					this.value = parseInt( self.$input.val() );
				},
						
				dragUpdate: function( tracker, dx, dy ) {
					self.$input.val( Math.floor( this.value - ( dy / 3 ) ) );
					self.$input.trigger( "change" );
				},
			});
			
			this.$input.on( "keydown", function( evt ) {
				if ( evt.which == 38 || evt.which == 40 ) {
					evt.preventDefault();
					if ( evt.which == 38 ) {
						//up
						self._incrementValue();
					} else if ( evt.which == 40 ){
						//down
						self._decrementValue();
					}
				}
			});
			
			this.$up.on( "click", function() {
				self._incrementValue();
			});
			
			this.$up.on( "mousedown", function() {
				intervalID = setInterval( function() {
					self._incrementValue();
				}, 170);
			}).on( "mouseup mouseleave", function() {
				clearInterval( intervalID );
			});
			
			this.$down.on( "mousedown", function() {
				intervalID = setInterval( function() {
					self._decrementValue();
				}, 170);
			}).on( "mouseup mouseleave", function() {
				clearInterval( intervalID );
			});
			
			this.$down.on( "click", function() {
				self._decrementValue();
			});
		},

		_decrementValue: function() {
			this.$input.val( parseInt( this.$input.val() ) - 1 ).trigger( "change" );
		},

		_incrementValue: function() {
			this.$input.val( parseInt( this.$input.val() ) + 1 ).trigger( "change" );
		}
	});
	
	
	$.fn.wpNumericInput = function( options ) {
		$( this ).each( function() {
			var ni = new WebPro.Widget.NumericInput( this, options );
		});
		return this;
	};
	
	
	
})( jQuery, WebPro, window, document );