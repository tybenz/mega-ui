/**
* wp-core.js - version 0.1 - WebPro Release 0.1
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

(function( $, window, document, undefined ){

var WebPro = {
	// Version of the framework.
	version: 0.1,

	// Utility method for wiring up derived class prototypes.

	inherit: function( derived, base ) {
		var anon = function(){};
		anon.prototype = base.prototype;
		derived.prototype = new anon();
		derived.prototype.constructor = derived;
		derived.prototype._super = base;
	},

	ensureArray: function() {
		var results = [],
			len = arguments.length;
		if ( len > 0 ) {
			if ( len > 1 ||  !$.isArray( arguments[ 0 ] ) ) {
				results = $.makeArray( arguments );
			} else {
				results = arguments[ 0 ];
			}
		}
		return results;
	},

	// When similar markup structures, that use the same class names,
	// are nested, it becomes very difficult to find the right set of
	// elements for the outer structures. scopedFind() allows you to search
	// for elements via a selector, within a context element, it then filters
	// the elements in the resulting collection, down to those that have the
	// specified parent, with the specified class name, as their closest ancestor.

	scopedFind: function( contextEle, selector, parentClassName, parent ) {
		// Muse used to provide this same functionality with:
		//
		//     var scopedFind = function($start, selector, scopeSelector, $scope) {
		//         return $start.find(selector).filter(function() { return $(this).closest(scopeSelector).get(0) == $scope.get(0); })
		//     }
		//
		// It is very compact and easy to read, but unfortunately it is extremely slow. The code
		// below ends up being about 7 times faster by avoiding the use of selectors and minimizing
		// the number of function calls that could occur when trying to scope a selector that
		// ends up matching lots of elements.

		// Use spaces before and after the parentClassName so that we
		// don't accidentally match any other classes that start with the
		// same name.

		var className = ' ' + parentClassName + ' ',

			// results will hold the resulting elements after they've been filtered.

			results = [],

			// Find all the elements within the specified context element that
			// match the selector. Note that this collection may also contain
			// elements for nested structures.

			$matches = $( contextEle ).find( selector ),

			// Cache the length of the collection so we can reduce the number
			// of symbol/js-interpreter lookups during each iteration of the
			// loop below.

			numMatches = $matches.length;

		// Make sure our parent is an element and not a selector or collection.

		parent = $( parent )[ 0 ];

		// Run through all elements in the collection and find those that
		// have the specified parent as their closest ancestor.

		for ( var i = 0; i < numMatches; i++ ) {
			// Cache the current element we're going to work with.

			var m = $matches[ i ],
				p = m;

			// Loop through the parent hierarchy of the current element
			// until we find an element with the classname we were given.

			while ( p ) {
				// Does the element have the specified classname? Note
				// that we are purposely not using $.fn.hasClass() because
				// we want this function to be fast.
	
				if ( p.className && ( ' ' + p.className + ' ' ).indexOf( className ) !== -1 ) {
					// Do we have an ancestor that matches the parent we
					// are interested in?

					if ( p === parent ) {
						results.push( m );
					}
					// We found an ancestor that has the specified class
					// so we are done traversing up the ancestor hierarchy.

					break;
				}

				// We haven't found a matching ancestor, so go up
				// another level.

				p = p.parentNode;
			}
		}

		// Return a jQuery collection that contains our results.

		return $( results );
	}
};


//////////////////// EventDispatcher ////////////////////


// EventDispatcher is a utility class that other classes
// that wish to dispatch events can derive from. We use
// it to hide the actual underlying mechanism used so
// we can swap it out at any time. This version simply uses
// jQuery's event mechanism.

function EventDispatcher()
{
}

$.extend(EventDispatcher.prototype, {
	bind: function( name, callback, data ) {
		return $( this ).bind( name, callback, data );
	},
	
	unbind: function( name, callback ) {
		return $( this ).unbind( name, callback );
	},

	trigger: function( name, data ) {
		// We want to give the caller access to the preventDefault and/or
		// stopPropagation status of the event they just triggered, so we
		// create a custom event, use it to dispatch the notification, then
		// return the event object itself from this method.

		var e = $.Event( name );
		$( this ).trigger( e, data );
		return e;
	}
});

WebPro.EventDispatcher = EventDispatcher;


//////////////////// Expose WebPro to the World  ////////////////////


window.WebPro = WebPro;


})( jQuery, window, document );

