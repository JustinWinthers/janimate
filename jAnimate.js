
(function(window, document, factory){

    "use strict";

    function Factory(el){
        this.repeatVal = false;
        this.context = el
    }

    Factory.prototype = factory.api;

    window.jAnimate = function(el){

        if (typeof el === 'string') el = document.querySelector(el);

        return new Factory(el);

    };

    factory.private.compile(document);


})(window, document, (function(){

        "use strict";

        var _api = {

                eventTypes: {
                    hover: ['onmouseover'],
                    leave: ['onmouseout'],
                    click: ['onclick'],
                    drag: ['ondrag'],
                    dragStart: ['ondragstart', 'ontouchstart'],
                    dragEnd: ['ondragend', 'ontouchend']
                },

                compile: function compile(document) {

                    var nodelist = document.querySelectorAll("[janimate]");

                    Array.prototype.forEach.call(nodelist,function(el){

                        var el = jAnimate(el)
                            ,eventList = _api.buildEventList(el);

                        Object.keys(eventList).forEach(function(key){

                            var animationName = key + '_' +  Math.floor((Math.random() * 10000000000) + 1)
                                ,eventType = (key==='immediate') ? undefined : key;

                            el.newAnimation(animationName, eventList[key]);
                            el[animationName]( eventType );
                        });

                    });
                },

                buildEventList: function(el /*jAnimate object*/ ){

                    var eventList = {};

                    el.context.getAttribute("jAnimate").split(').').sort().forEach(function(func){

                        var prop = func.split('(')[0];                        // get list of functions defined
                        var val = func.split('(')[1].replace(/\)/g,'');
                        var args = val.split(',');                            // get the first parameter to
                        var eventType = args[0].replace(/'/g,'').toString();  // get string value of first parm to see

                        if (!_api.eventTypes.hasOwnProperty(eventType)) eventType = 'immediate';

                        if (!eventList[eventType]) eventList[eventType] = {};

                        eventList[eventType][prop] = (eventType === 'immediate') ? args[0] : args[1];
                        eventList[eventType][prop] = eventList[eventType][prop].replace(/'/g,'');
                    });

                    return eventList;

                },

                validateArgList: function(args, signature){

                    if (args.length !== signature) Array.prototype.unshift.call(args, null);

                    return args;
                },

                getNum: function(val){

                    var sign = ( typeof val === 'string' && val[0] === '-' ? -1 : +1);

                    if (typeof val === 'string') val = val.replace(/[^0-9.]/g, "");

                    return val * sign;
                },

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

                    for (var i=0; i < _api.eventTypes[eventType].length; i++){

                        el.context[_api.eventTypes[eventType][i]] = function(){func.call(el);};
                    }

                },

                setDuration: function(duration) {

                    // assume milliseconds if not second attribute was provided
                    duration = (duration.indexOf('s') === -1 && duration.indexOf('ms') === -1) ? duration + 'ms' : duration;



                    this.context.style.webkitTransitionDuration = duration;
                    this.context.style.mozTransitionDuration = duration;
                    this.context.style.msTransitionDuration = duration;
                    this.context.style.oTransitionDuration = duration;
                    this.context.style.transitionDuration = duration;

                    return this;
                },

                setTiming: function(timingFunction) {

                    this.context.style.webkitTransitionTimingFunction = timingFunction;
                    this.context.style.mozTransitionTimingFunction = timingFunction;
                    this.context.style.msTransitionTimingFunction = timingFunction;
                    this.context.style.oTransitionTimingFunction = timingFunction;
                    this.context.style.transitionTimingFunction = timingFunction;

                    return this;
                },

                setTransform: function(transform) {

                    if ( (this.repeatVal.toString()==='false') && (this.context.style.transform.indexOf(transform.split('(')[0]) !== -1) ) {

                        return false;
                    }

                    if (this.repeatVal.toString()==='toggle') {

                        this.context.style.webkitTransform = transform;
                        this.context.style.mozTransform = transform;
                        this.context.style.msTransform = transform;
                        this.context.style.oTransform = transform;
                        this.context.style.transform = transform;

                    } else {

                        this.context.style.webkitTransform += transform;
                        this.context.style.mozTransform += transform;
                        this.context.style.msTransform += transform;
                        this.context.style.oTransform += transform;
                        this.context.style.transform += transform;

                    }

                    // reset transform property so it doesn't keep building up with each
                    // successive call.  Do this once animation is complete.
                    if (this.repeatVal.toString() === 'true'){


                        var milliseconds = (typeof this.context.style.transitionDuration === 'string' &&
                            this.context.style.transitionDuration.indexOf('ms') !== -1) ? 1 : 1000;
                        var duration = _api.getNum(this.context.style.transitionDuration) * milliseconds;
                        var context = this;

                        if (!duration) duration=500;

                        setTimeout(function(){

                            context.context.style.webkitTransform = '';
                            context.context.style.mozTransform = '';
                            context.context.style.msTransform = '';
                            context.context.style.oTransform = '';
                            context.context.style.transform = '';

                        }, duration);
                    }
                },

                transform: function(eventType, val, transform) {

                    this.toggleState = !this.toggleState;

                    var func = function(){

                        var jAnimateClosure = this;

                        return function(){

                            if (jAnimateClosure.repeatVal==='toggle' && !jAnimateClosure.toggleState){
                                val = (transform==='scaleTransform') ? 1 : 0;
                            }

                            _api[transform].call(jAnimateClosure, val);

                        }

                    }.call(this);

                    _api.assignEvents.call(this, func, eventType);

                },

                backgroundColor: function(color){

                    this.context.style.backgroundColor = color;
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

                    this.context.style.opacity = amount;
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

                    _api.setDuration.call(this,duration);

                    return this;

                },

                timing: function(timingFunction) {

                    _api.setTiming.call(this,timingFunction);

                    return this;

                },

                repeat: function(bool) {

                    this.repeatVal = (bool === 'toggle') ?  bool : (bool.toString() === 'true');

                    return this;

                },

                grow: function() {

                    var args = _api.validateArgList(arguments, 2);

                    var eventType = args[0], growthMultiplier = _api.getNum(args[1]);

                    _api.transform.call(this, eventType, growthMultiplier, 'scaleTransform');

                    return this;

                },

                opacity: function() {

                    var args = _api.validateArgList(arguments, 2);

                    var eventType = args[0], amount = args[1];

                    _api.transform.call(this, eventType, amount, 'opacity');

                    return this;

                },

                spin: function() {

                    var args = _api.validateArgList(arguments, 2);

                    var eventType = args[0], deg = _api.getNum(args[1]);

                    _api.transform.call(this, eventType, deg + 'deg', 'spinTransform');

                    return this;

                },

                turnBackground: function() {

                    var args = _api.validateArgList(arguments, 2);

                    var eventType = args[0], color = args[1];

                    _api.transform.call(this, eventType, color, 'backgroundColor');

                    return this;
                },

                moveUp: function() {

                    var args = _api.validateArgList(arguments, 2);

                    var eventType = args[0], px = '-' + _api.getNum(args[1]) + 'px';

                    _api.transform.call(this, eventType, px, 'translateY');

                    return this;

                },

                moveDown: function() {

                    var args = _api.validateArgList(arguments, 2);

                    var eventType = args[0], px = _api.getNum(args[1]) + 'px';

                    _api.transform.call(this, eventType, px, 'translateY');

                    return this;

                },

                moveLeft: function() {

                    var args = _api.validateArgList(arguments, 2);

                    var eventType = args[0], px = '-' + _api.getNum(args[1]) + 'px';

                    _api.transform.call(this, eventType, px, 'translateX');

                    return this;

                },

                moveRight: function() {

                    var args = _api.validateArgList(arguments, 2);

                    var eventType = args[0], px = _api.getNum(args[1]) + 'px';

                    _api.transform.call(this, eventType, px, 'translateX');

                    return this;

                },

                zoomOut: function() {

                    var args = _api.validateArgList(arguments, 3);

                    var eventType = args[0],
                        scale = _api.getNum(args[1]),
                        spinDegrees = _api.getNum(args[2]);

                    _api.transform.call(this, eventType, scale, 'scaleTransform');
                    _api.transform.call(this, eventType, spinDegrees, 'spinTransform');

                    return this;

                },

                newAnimation: function(name, obj){

                    this[name] = function(eventType){

                        var objVal = eval ( "(" + JSON.stringify(obj) + ")" );

                        if (eventType) {

                            var func = function(){_api.animate.call(this, objVal)};

                            _api.assignEvents.call(this, func, eventType);

                        } else {
                            _api.animate.call(this, objVal);
                        }

                        return this;

                    };

                }

            };

        return {
            api: api,
            private: _api
        };

    })());