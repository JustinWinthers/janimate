
(function(window, factory){

    "use strict";

    var jAnimate = window.jAnimate = function(el){

            factory = jAnimate.factory || factory;

            if (typeof el === 'string') el = document.querySelector(el);

            var Factory = function(el){
                this.context = el
            };

            Factory.prototype = factory;

            var jAnimateObj = new Factory(el);

            //todo: will this circular reference cause memory issues?
            jAnimateObj.context.janimate = jAnimateObj;
            jAnimateObj.repeat = false;

            return jAnimateObj;
        },

        compile = (function compile() {

            var nodelist = document.querySelectorAll("div[janimate]");

            Array.prototype.forEach.call(nodelist,function(el){

                eval ("jAnimate(el)." + el.getAttribute("janimate"));

            })})();

    jAnimate.factory = factory;

    jAnimate.newAnimation = factory.newAnimation;

})(window, (function(){

        "use strict";

        //local vars

        var _eventTypes = {
                hover: ['onmouseover'],
                leave: ['onmouseout'],
                click: ['onclick','ontouchstart'],
                drag: ['ondrag'],
                dragStart: ['ondragstart', 'ontouchstart'],
                dragEnd: ['ondragend', 'ontouchend']
            },


        // local api

            _api = {

                animate: function (objVal) {

                    var el = this;

                    Object.keys(objVal).forEach(function(key){

                        if (objVal.hasOwnProperty(key)) {

                            el[key](objVal[key]);

                        }
                    });
                },

                assignEvents: function(func, eventType) {

                    if (!eventType) {
                        // if we don't have an eventType then execute the transform
                        func.call(this.context);
                        return;
                    }

                    var el = this;

                    for (var i=0; i < _eventTypes[eventType].length; i++){

                        el.context[_eventTypes[eventType][i]] = function(){func.call(el);};
                    }

                },

                setDuration: function(duration) {

                    this.style.webkitTransitionDuration = duration;
                    this.style.mozTransitionDuration = duration;
                    this.style.msTransitionDuration = duration;
                    this.style.oTransitionDuration = duration;
                    this.style.transitionDuration = duration;

                    return this;
                },

                setTransform: function(transform) {

                    if (this.janimate.transform && !this.janimate.repeat) {
                        if (this.janimate.transform.indexOf(transform) !== -1) return;
                    }

                    this.style.webkitTransform += transform;
                    this.style.mozTransform += transform;
                    this.style.msTransform += transform;
                    this.style.oTransform += transform;
                    this.style.transform += transform;

                    this.janimate.transform += transform;

                },


                transform: function(eventType, val, transform) {

                    var func = function(){

                        return function(){

                            // todo: figure out why I have to handle this
                            // todo: why it works different when eventType exists via add new animation
                            // todo: or via api
                            _api[transform].call(this.context || this, val);

                        }

                    }.call(this);

                    _api.assignEvents.call(this, func, eventType);

                },

                backgroundColor: function(color){

                    this.style.backgroundColor = color;
                },

                scaleTransform: function(amount){

                    return _api.setTransform.call(this, "scale("+ amount + "," + amount + ")");
                },

                translateX: function(px){

                    return _api.setTransform.call(this, "translateX("+ px + ")");
                },

                translateY: function(px){

                    return _api.setTransform.call(this, "translateY("+ px + ")");
                },

                opacity: function(amount){

                    this.style.opacity = amount;
                },

                spinTransform: function(deg){

                    return _api.setTransform.call(this, "rotate("+ deg + ")");
                },

                translateZ: function(z){

                    return _api.setTransform.call(this, "translateZ(" + z + ")");
                }

            },


        // public api

            api = {

                duration: function(duration) {

                    _api.setDuration.call(this.context,duration);

                    return this;

                },

                grow: function() {

                    var args = helpers.validateArgList(arguments, 2);

                    var eventType = args[0], growthMultiplier = helpers.getNum(args[1]);

                    _api.transform.call(this, eventType, growthMultiplier, 'scaleTransform');

                    return this;

                },

                opacity: function() {

                    var args = helpers.validateArgList(arguments, 2);

                    var eventType = args[0], amount = args[1];

                    _api.transform.call(this, eventType, amount, 'opacity');

                    return this;

                },

                spin: function() {

                    var args = helpers.validateArgList(arguments, 2);

                    var eventType = args[0], deg = helpers.getNum(args[1]);

                    _api.transform.call(this, eventType, deg + 'deg', 'spinTransform');

                    return this;

                },

                turnBackground: function() {

                    var args = helpers.validateArgList(arguments, 2);

                    var eventType = args[0], color = args[1];

                    _api.transform.call(this, eventType, color, 'backgroundColor');

                    return this;
                },

                moveUp: function() {

                    var args = helpers.validateArgList(arguments, 2);

                    var eventType = args[0], px = '-' + helpers.getNum(args[1]) + 'px';

                    _api.transform.call(this, eventType, px, 'translateY');

                    return this;

                },

                moveDown: function() {

                    var args = helpers.validateArgList(arguments, 2);

                    var eventType = args[0], px = helpers.getNum(args[1]) + 'px';

                    _api.transform.call(this, eventType, px, 'translateY');

                    return this;

                },

                moveLeft: function() {

                    var args = helpers.validateArgList(arguments, 2);

                    var eventType = args[0], px = '-' + helpers.getNum(args[1]) + 'px';

                    _api.transform.call(this, eventType, px, 'translateX');

                    return this;

                },

                moveRight: function() {

                    var args = helpers.validateArgList(arguments, 2);

                    var eventType = args[0], px = helpers.getNum(args[1]) + 'px';

                    _api.transform.call(this, eventType, px, 'translateX');

                    return this;

                },

                zoomOut: function() {

                    var args = helpers.validateArgList(arguments, 3);

                    var eventType = args[0],
                        scale = helpers.getNum(args[1]),
                        spinDegrees = helpers.getNum(args[2]);

                    _api.transform.call(this, eventType, scale, 'scaleTransform');
                    _api.transform.call(this, eventType, spinDegrees, 'spinTransform');

                    return this;

                },

                newAnimation: function(name, obj){

                    jAnimate.factory[name] = function(eventType){

                        var objVal = eval ( "(" + JSON.stringify(obj) + ")" );

                        this.repeat = objVal.repeat;

                        delete objVal.repeat;

                        if (eventType) {

                            var func = function(){jAnimate.factory.animate.call(this, objVal)};

                            jAnimate.factory.assignEvents.call(this, func, eventType);

                        } else {
                            jAnimate.factory.animate.call(this, objVal);
                        }

                        return this;

                    };

                }

            },

            helpers = {

                validateArgList: function(args, signature){

                    if (args.length !== signature) Array.prototype.unshift.call(args, null);

                    return args;
                },

                getNum: function(val){

                    if (typeof val === 'string') return val.replace(/[^0-9.]/g, "");

                    return val;
                }

            };


        return  {
            duration:api.duration,
            spin:api.spin,
            turnBackground:api.turnBackground,
            grow:api.grow,
            zoomOut:api.zoomOut,
            opacity:api.opacity,
            moveUp:api.moveUp,
            moveDown:api.moveDown,
            moveRight:api.moveRight,
            moveLeft:api.moveLeft,
            newAnimation:api.newAnimation,
            assignEvents:_api.assignEvents,
            animate:_api.animate
        }
    })());