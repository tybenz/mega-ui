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

WebPro.widget( "Widget.Slider2D", WebPro.Widget, {
	_widgetName: "slider",

	defaultOptions: {
		graphClassName: 'wp-slider-graph',
		thumbClassName: 'wp-slider-thumb'
	},

	_attachBehavior: function() {
		var self = this,
			opts = this.options;

		this.$graph = this.$element.find( '.' + opts.graphClassName );
		this.$thumb = this.$element.find( '.' + opts.thumbClassName );

		var graphWidth = this.$graph.width(),
			graphHeight = this.$graph.height()
			thumbWidth = this.$thumb.width();

		this.percentageX = 0; // % value in the range from zero to one.
		this.percentageY = 0; // % value in the range from zero to one.
		this.positionX = 0; // px
		this.positionY = 0; // px

		this._resetConstraints();

		this.tracker = new  WebPro.DragTracker( this.$thumb[ 0 ], {
				dragStart: function( dt, dx, dy ) { self._handleDragStart( dx, dy ); },
				dragUpdate: function( dt, dx, dy ) { self._handleDragUpdate( dx, dy ); },
				dragStop: function( dt, dx, dy ) { self._handleDragStop( dx, dy ); }
			});
	},

	_handleDragStart: function( dx, dy ) {
		this._startPosX = this.positionX;
		this._startPosY = this.positionY;
	},

	_handleDragUpdate: function( dx, dy ) {
		this.setPositionByPixel( this._startPosX + dx, this._startPosY + dy );
	},

	_handleDragStop: function( dx, dy ) {
		this._startPosX = 0;
		this._startPosY = 0;
	},

	_resetConstraints: function() {
		var graphWidth = this.$graph.width(),
			graphHeight = this.$graph.height(),
			thumbWidth = this.$thumb.outerWidth(),
			thumbHeight = this.$thumb.outerHeight();

		this.maxPosX = graphWidth - thumbWidth;
		this.maxPosY = graphHeight - thumbHeight;

		// Reset the thumb based on our new width.

		this.setPositionByPixel( this.percentageX * this.maxPosX, this.percentageY * this.maxPosY );
	},

	setPositionByPixel: function( posX, posY )
	{
		// Clip the value we were given to our pixel range.

		posX = Math.round( posX || 0 );
		posX = posX < 0 ? 0 : ( posX > this.maxPosX ? this.maxPosX : posX );
		
		posY = Math.round( posY || 0 );
		posY = posY < 0 ? 0 : ( posY > this.maxPosY ? this.maxPosY : posY );

		this._setThumbPosition( posX, posY );
	},

	setPositionByPercentage: function( percent ) {
		this.percentage = percent < 0 ? 0 : ( percent < 1 ? percent : 1 );
		this._setThumbPosition( Math.round( this.percentageX * this.maxPosX ), Math.round( this.percentageY * this.maxPosY ) );
	},

	_setThumbPosition: function( posX, posY ) {
		this.percentageX = posX / this.maxPosX;
		this.positionX = posX;
		this.percentageY = posY / this.maxPosY;
		this.positionY = posY;

		this.$thumb.css({
			left: posX + 'px',
			top: posY + 'px'
		});
		
		this.update();
	},

	update: function() {
		this._update();
		this.trigger( 'wp-slider-update', {
			positionX: this.positionX,
			positionY: this.positionY,
			percentageX: this.percentageX,
			percentageY: this.percentageY
		});
	},

	_update: function() {
		// Stub function to be used by derived class.
	}
});

})( jQuery, WebPro, window, document );

