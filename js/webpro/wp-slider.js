/**
* wp-slider.js - version 0.1 - WebPro Release 0.1
*
* Copyright (c) 2012. Adobe Systems Incorporated.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are met:
*
*   * Redistributions of source code must retain the above copyright notice,
*     this list of conditions and the following disclaimer.
*   * Redistributions in binary form must reproduce the above copyright notice,
*     this list of conditions and the following disclaimer in the documentation
*     and/or other materials provided with the distribution.
*   * Neither the name of Adobe Systems Incorporated nor the names of its
*     contributors may be used to endorse or promote products derived from this
*     software without specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
* AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
* IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
* ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
* LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
* CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
* SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
* INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
* CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
* ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
* POSSIBILITY OF SUCH DAMAGE.
*/

(function( $, WebPro, window, document, undefined ){

// XXX: This still needs to be made generic so that we can use
//      this in a horizontal, vertical, and both mode.

WebPro.widget( "Widget.Slider", WebPro.Widget, {
	_widgetName: "slider",

	defaultOptions: {
		trackClassName: 'wp-slider-track',
		thumbClassName: 'wp-slider-thumb'
	},

	_attachBehavior: function() {
		var self = this,
			opts = this.options;

		this.$track = this.$element.find( '.' + opts.trackClassName );
		this.$thumb = this.$element.find( '.' + opts.thumbClassName );

		var trackWidth = this.$track.width(),
			thumbWidth = this.$track.width();

		this.percentage = 0; // % value in the range from zero to one.
		this.position = 0; // px

		this._resetConstraints();

		this.tracker = new  WebPro.DragTracker( this.$thumb[ 0 ], {
				dragStart: function( dt, dx, dy ) { self._handleDragStart( dx, dy ); },
				dragUpdate: function( dt, dx, dy ) { self._handleDragUpdate( dx, dy ); },
				dragStop: function( dt, dx, dy ) { self._handleDragStop( dx, dy ); }
			});
	},

	_handleDragStart: function( dx, dy ) {
		this._startPos = this.position;
	},

	_handleDragUpdate: function( dx, dy ) {
		this.setPositionByPixel( this._startPos + dx );
	},

	_handleDragStop: function( dx, dy ) {
		this._startPos = 0;
	},

	_resetConstraints: function() {
		var trackWidth = this.$track.width(),
			thumbWidth = this.$thumb.width();

		this.maxPos = trackWidth - thumbWidth;

		// Reset the thumb based on our new width.

		this.setPositionByPixel( this.percentage * this.maxPos );
	},

	setPositionByPixel: function( pos )
	{
		// Clip the value we were given to our pixel range.

		pos = Math.round( pos || 0 );
		pos = pos < 0 ? 0 : ( pos > this.maxPos ? this.maxPos : pos );

		this._setThumbPosition( pos );
	},

	setPositionByPercentage: function( percent ) {
		this.percentage = percent < 0 ? 0 : ( percent < 1 ? percent : 1 );
		this._setThumbPosition( Math.round( this.percentage * this.maxPos ) );
	},

	_setThumbPosition: function( pos ) {
		this.percentage = pos / this.maxPos;
		this.position = pos;

		this.$thumb.css( 'left', pos + 'px');
		this.update();
	},

	update: function() {
		this._update();
		this.trigger( 'wp-slider-update', { position: this.position, percentage: this.percentage } );
	},

	_update: function() {
		// Stub function to be used by derived class.
	}
});

// Add a convenience method to the jQuery Collection prototype,
// that applies our Slider behavior to all the elements in the collection.

$.fn.wpSlider = function( options ) {
	$( this ).each( function() {
		$( this ).data( 'wpSlider', new WebPro.Widget.Slider( this, options ) );
	});

	return this;
};

})( jQuery, WebPro, window, document );

