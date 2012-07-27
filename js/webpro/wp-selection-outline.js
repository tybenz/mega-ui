/**
* wp-selection-outline.js - version 0.1 - WebPro Release 0.1
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

var WebPro = WebPro || {};

( function( $, WebPro, window ) {

WebPro.SelectionOutline = function( element ) {
	this.element = element;
	this.top = 0;
	this.left = 0;
	this.width = 0;
	this.height = 0;
	this.borderWidth = 1;
	this.handleWidth = 5 + ( 2 * this.borderWidth );

	this.outline = document.createElement( "div" );
	this.outline.className = "selection-outline";
	//this.outline.innerHTML = '<div class="selection-top"><div class="selection-handle-top-left"></div><div class="selection-handle-top"></div><div class="selection-handle-top-right"></div></div><div class="selection-right"><div class="selection-handle-right"></div></div><div class="selection-bottom"><div class="selection-handle-bottom-left"></div><div class="selection-handle-bottom"></div><div class="selection-handle-bottom-right"></div></div><div class="selection-left"><div class="selection-handle-left"></div></div>';

	// Create the borders.

	this.topBorder = createBorder( "top" );
	this.rightBorder = createBorder( "right" );
	this.bottomBorder = createBorder( "bottom" );
	this.leftBorder = createBorder( "left" );

	// Create the handles.

	this.topLeftHandle = createHandle( "top-left" );
	this.topHandle = createHandle( "top" );
	this.topRightHandle = createHandle( "top-right" );
	this.rightHandle = createHandle( "right" );
	this.bottomLeftHandle = createHandle( "bottom-left" );
	this.bottomHandle = createHandle( "bottom" );
	this.bottomRightHandle = createHandle( "bottom-right" );
	this.leftHandle = createHandle( "left" );

	// Add the handles to the top border.

	var ele = this.topBorder;
	ele.appendChild( this.topLeftHandle );
	ele.appendChild( this.topHandle );
	ele.appendChild( this.topRightHandle );

	// Add the handles to the bottom border.

	var ele = this.bottomBorder;
	ele.appendChild( this.bottomLeftHandle );
	ele.appendChild( this.bottomHandle );
	ele.appendChild( this.bottomRightHandle );

	// Add handles to the side borders.

	this.leftBorder.appendChild( this.leftHandle );
	this.rightBorder.appendChild( this.rightHandle );

	// Add all the borders to the outline outline.

	this.outline.appendChild( this.topBorder );
	this.outline.appendChild( this.rightBorder );
	this.outline.appendChild( this.bottomBorder );
	this.outline.appendChild( this.leftBorder );

	if ( this.element ) {
		this.update();
	}
};

var proto = WebPro.SelectionOutline.prototype;

proto.show = function() {
	document.body.appendChild( this.outline );
};

proto.hide = function() {
	document.body.removeChild( this.outline );
};

proto.attach = function( ele ) {
	this.element = ele;
	this.update();
};

proto.detach = function( ele ) {
	this.element = null;
	this.hide;
};

proto.update = function() {
	var ele = $( this.element ),
		offset = ele.offset();

	this.setPosition( offset.left, offset.top, ele.outerWidth(), ele.outerHeight() );
};

proto.setPosition = function( x, y, w, h ) {
	var bw = this.borderWidth,
		wx = this.borderWidth * 2,
		hndlw = this.handleWidth / 2 ,
		hw = ( ( w + wx ) / 2 ) - hndlw,
		hh = ( ( h + wx ) / 2 ) - hndlw;

	this.left = x;
	this.top = y;
	this.width = w;
	this.height = h;

	// Set the dimensions of the outline.

	this.topBorder.style.width = this.bottomBorder.style.width = w + wx + "px";
	this.leftBorder.style.height = this.rightBorder.style.height = h + wx + "px";

	// Set the position of the outline.

	this.outline.style.top = y - bw + "px";
	this.outline.style.left = x - bw + "px";
	this.bottomBorder.style.top = h + bw + "px";
	this.rightBorder.style.left = w + bw + "px";

	// Fix up the midpoint handles.

	this.topHandle.style.left = this.bottomHandle.style.left = hw + "px";
	this.leftHandle.style.top = this.rightHandle.style.top = hh + "px";
	
}

function createBorder( borderName ) {
	var div = document.createElement( "div" );
	div.className = "selection-" + borderName;
	return div;
}

function createHandle( handleName ) {
	var div = document.createElement( "div" );
	div.className = "selection-handle-" + handleName;
	return div;
}

})( jQuery, WebPro, window);

