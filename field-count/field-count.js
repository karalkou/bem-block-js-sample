/*------------------------------------------------- append polyfill -------------------------------------------------*/
// Source: https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/append()/append().md
(function (arr) {
    arr.forEach(function (item) {
        if (item.hasOwnProperty('append')) {
            return;
        }
        Object.defineProperty(item, 'append', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function append() {
                var argArr = Array.prototype.slice.call(arguments),
                    docFrag = document.createDocumentFragment();

                argArr.forEach(function (argItem) {
                    var isNode = argItem instanceof Node;
                    docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
                });

                this.appendChild(docFrag);
            }
        });
    });
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);

/*-------------------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------ JS class ----------------------------------------------------*/
window.alfaclub = window.alfaclub || {};

window.alfaclub.FieldCount = (function(){
    'use strict';

    function FieldCount(){
            this.DOM_elem = null;
            this.DOM_counter = null;

            this.left_symbols = 0;
            this.LIMIT = null;

            this.onKeyUp = this.onKeyUp.bind(this)
        }

        /**
         * init
         */
        FieldCount.prototype.init = function(options){
            //console.log('init');
            if ( typeof options !== 'object' ) throw new Error('options is not object');

            this.DOM_elem = options.elem;
            this.LIMIT = options.limit || 80;
        };

        /* NB! first - delete instance; second - init and render instance */

        /**
         * render
         */
        FieldCount.prototype.render = function(){
            //console.log('render');
            this.DOM_elem.classList.add("field-count");

            this.DOM_counter = document.createElement('div');
            this.DOM_counter.className = "field-count__digit";

            this.DOM_counter.innerHTML = this.LIMIT;
            this.DOM_elem.append(this.DOM_counter);

            this.writeCurrentDigit();
            this.switchColor();

            this.DOM_elem.addEventListener( 'keyup', this.onKeyUp );

        };

        /**
         * destroy
         */
        FieldCount.prototype.destroy = function(){
            //console.log('destroy');

            this.DOM_elem.removeChild(this.DOM_counter);
            this.DOM_elem.removeEventListener( 'keyup', this.onKeyUp );

            this.DOM_elem = null;
            this.DOM_counter = null;
        };

        /**
         * Sets current counter value visible
         */
        FieldCount.prototype.writeCurrentDigit = function(){
            //console.log('writeCurrentDigit');

            var contentEditableElem = this.DOM_elem.querySelector('[contenteditable="true"]'),
                textarea = this.DOM_elem.querySelector('textarea');

            if(contentEditableElem){ this.left_symbols = this.LIMIT - contentEditableElem.innerText.length; } //!!!  похоже придётся через регулярку прогонять !!!
            if(textarea){ this.left_symbols = this.LIMIT - textarea.value.length; /*textarea.maxLength = this.LIMIT;*/ }

            this.DOM_elem.dataset.limit = this.left_symbols;

            if(this.DOM_counter){
                this.DOM_counter.innerHTML = this.left_symbols;
            }
        };

        /**
         * Sets other outline color if overflown and emits appropriate BEM-event
         */
        FieldCount.prototype.switchColor = function(){
            //console.log('switchColor');
            var lockEvent = null;

            if( this.left_symbols < 0 ){
                this.DOM_elem.classList.add('overflown');
                lockEvent = new CustomEvent('fieldCount:lock');
            } else{
                this.DOM_elem.classList.remove('overflown');
                lockEvent = new CustomEvent('fieldCount:unlock');
            }
            this.DOM_elem.dispatchEvent(lockEvent);
        };

        /**
         * Keyup handler
         */
        FieldCount.prototype.onKeyUp = function(){
            //console.log('keyup');
            var e = arguments[0];

            if(e.which != 8 && this.left_symbols < 0 ) {
                // console.log('over over over');
                // e.preventDefault();
                this.writeCurrentDigit();
                this.switchColor();
            }else{
                this.writeCurrentDigit();
                this.switchColor();
            }

        };



    return FieldCount;

})();